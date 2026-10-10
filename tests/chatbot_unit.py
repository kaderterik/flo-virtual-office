"""Offline contract tests: external clients are mocked; Qdrant's pure data models are real."""
import importlib.util
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace, ModuleType
from unittest.mock import patch, MagicMock

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "flo_chatbot"))
import main as api
import load_data as loader
from fastapi import HTTPException
from pydantic import ValidationError
# Load only Qdrant's Python data declarations, not its network/native gRPC clients.
qdrant_path = Path(importlib.util.find_spec("qdrant_client").origin).parent
spec = importlib.util.spec_from_file_location("offline_qdrant_models", qdrant_path / "http" / "models" / "models.py")
models = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = models
spec.loader.exec_module(models)
PointStruct = models.PointStruct


class ChatTests(unittest.TestCase):
    def test_greeting_does_not_swallow_question(self):
        for question in ["Merhaba, işe alım nasıl ilerliyor?", "Kanka lojistik ne yapıyor?", "Teşekkürler, bir de İK'yı anlat", "İK ne yapıyorsun sorusunu mülakatta sorar mı?"]:
            with self.subTest(question=question), patch.object(api, "cevap_uret", return_value="Yanıt") as answer:
                self.assertEqual(api.chat(api.ChatRequest(message=question)), {"answer": "Yanıt"})
                answer.assert_called_once_with(question)

    def test_short_smalltalk_does_not_use_services(self):
        for message in ["Merhaba!", "selam", "Teşekkür ederim.", "Görüşürüz!", "Nasılsın?", "   "]:
            with self.subTest(message=message), patch.object(api, "cevap_uret") as answer:
                self.assertTrue(api.chat(api.ChatRequest(message=message))["answer"])
                answer.assert_not_called()

    def test_length_limit_is_server_side(self):
        with self.assertRaises(ValidationError):
            api.ChatRequest(message="x" * 501)
        with self.assertRaises(ValidationError):
            api.ChatRequest(message="")

    def test_backend_failure_returns_recoverable_status(self):
        with patch.object(api, "cevap_uret", side_effect=RuntimeError("offline test")), patch.object(api.logger, "exception"):
            with self.assertRaises(HTTPException) as error:
                api.chat(api.ChatRequest(message="İşe alım süreci nedir?"))
            self.assertEqual(error.exception.status_code, 503)
            self.assertIn("tekrar", error.exception.detail)

    def test_empty_rewrite_uses_original_question(self):
        groq = MagicMock()
        groq.chat.completions.create.return_value = SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(content=None))])
        with patch.object(api, "get_groq", return_value=groq):
            self.assertEqual(api.soruyu_duzenle("İK görevleri"), "İK görevleri")

    def test_rewrite_failure_and_legacy_collection_fallback(self):
        model, client = MagicMock(), MagicMock()
        model.encode.return_value.tolist.return_value = [0.1, 0.2, 0.3]
        client.query_points.return_value.points = []
        for active in [False, True]:
            client.collection_exists.return_value = active
            with patch.object(api, "soruyu_duzenle", side_effect=RuntimeError("rewrite unavailable")), patch.object(api, "get_embedding_model", return_value=model), patch.object(api, "get_qdrant", return_value=client), patch.object(api.logger, "warning"):
                self.assertEqual(api.bilgi_ara("İK görevleri"), [])
                model.encode.assert_called_with("İK görevleri", normalize_embeddings=True)
                client.query_points.assert_called_with(collection_name=api.ACTIVE_COLLECTION_NAME if active else api.COLLECTION_NAME, query=[0.1, 0.2, 0.3], limit=4)


class PublishTests(unittest.TestCase):
    def setUp(self):
        self.client = MagicMock()
        self.client.count.return_value = SimpleNamespace(count=1)
        self.client.get_aliases.return_value = SimpleNamespace(aliases=[])
        parent = ModuleType("qdrant_client")
        parent.models = models
        self.modules = patch.dict(sys.modules, {"qdrant_client":parent, "qdrant_client.models":models})
        self.modules.start()
        self.points = [PointStruct(id=1, vector=[0.1, 0.2, 0.3], payload={"metin":"ilk kaynak"})]

    def tearDown(self):
        self.modules.stop()

    def publish_old(self):
        old = loader.publish_collection(self.client, self.points, 3)
        self.client.get_aliases.return_value = SimpleNamespace(aliases=[SimpleNamespace(alias_name=loader.ACTIVE_COLLECTION_NAME, collection_name=old)])
        return old

    def test_success_switches_alias_and_keeps_previous(self):
        old = self.publish_old()
        new_points = self.points + [PointStruct(id=2, vector=[0.2, 0.3, 0.4], payload={"metin":"ikinci kaynak"})]
        self.client.count.return_value = SimpleNamespace(count=2)
        new = loader.publish_collection(self.client, new_points, 3)
        self.assertNotEqual(old, new)
        operations = self.client.update_collection_aliases.call_args.kwargs["change_aliases_operations"]
        self.assertEqual(len(operations), 2)
        self.assertEqual(operations[0].delete_alias.alias_name, loader.ACTIVE_COLLECTION_NAME)
        self.assertEqual(operations[1].create_alias.collection_name, new)
        self.assertEqual(operations[1].create_alias.alias_name, loader.ACTIVE_COLLECTION_NAME)
        self.client.delete_collection.assert_not_called()

    def test_failed_upload_keeps_active_source(self):
        old = self.publish_old()
        with patch.object(self.client, "upsert", side_effect=RuntimeError("upload interrupted")):
            with self.assertRaises(RuntimeError):
                loader.publish_collection(self.client, self.points, 3)
        self.assertEqual(self.client.update_collection_aliases.call_count, 1)
        self.assertEqual(self.client.update_collection_aliases.call_args.kwargs['change_aliases_operations'][0].create_alias.collection_name, old)
        self.client.delete_collection.assert_not_called()

    def test_wrong_count_does_not_switch_alias(self):
        self.publish_old()
        with patch.object(self.client, "count", return_value=SimpleNamespace(count=0)):
            with self.assertRaisesRegex(RuntimeError, "Aktif kaynak değiştirilmedi"):
                loader.publish_collection(self.client, self.points, 3)
        self.assertEqual(self.client.update_collection_aliases.call_count, 1)
        self.client.delete_collection.assert_not_called()

    def test_failed_alias_switch_keeps_old_source(self):
        self.publish_old()
        with patch.object(self.client, "update_collection_aliases", side_effect=RuntimeError("switch interrupted")):
            with self.assertRaises(RuntimeError):
                loader.publish_collection(self.client, self.points, 3)
        self.client.delete_collection.assert_not_called()


if __name__ == "__main__":
    unittest.main()
