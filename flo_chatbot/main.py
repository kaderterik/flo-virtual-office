import os
import logging
import re
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from groq import Groq


# ============================================================
# 1. AYARLAR
# ============================================================

load_dotenv(Path(__file__).resolve().parent / ".env")

COLLECTION_NAME = "flo_bilgi_tabani"
ACTIVE_COLLECTION_NAME = "flo_bilgi_tabani_active"
logger = logging.getLogger(__name__)


# ============================================================
# 2. FASTAPI
# ============================================================

app = FastAPI(
    title="FLO RAG Chatbot API"
)


# ============================================================
# 3. CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# 4. GROQ
# ============================================================

@lru_cache
def get_groq():
    return Groq(api_key=os.getenv("GROQ_API_KEY"), timeout=15, max_retries=0)


# ============================================================
# 5. QDRANT
# ============================================================

@lru_cache
def get_qdrant():
    from qdrant_client import QdrantClient
    return QdrantClient(url=os.getenv("QDRANT_URL"), api_key=os.getenv("QDRANT_API_KEY"), timeout=10)


# ============================================================
# 6. EMBEDDING MODELİ
# ============================================================

@lru_cache
def get_embedding_model():
    from sentence_transformers import SentenceTransformer
    return SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")


# ============================================================
# 7. REQUEST MODELİ
# ============================================================

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=500)


# ============================================================
# 8. SORUYU ARAMA İÇİN DÜZENLE
# ============================================================

def soruyu_duzenle(soru):

    response = get_groq().chat.completions.create(
    model="qwen/qwen3.6-27b",
    messages=[
        {
            "role": "system",
            "content": """
            Kullanıcının sorusunu bilgi tabanında arama yapmak için
            daha açık, düzgün ve anlamı korunmuş şekilde yeniden yaz.

            Kurallar:
            - Yeni bilgi ekleme.
            - Kullanıcının kastını değiştirme.
            - FLO staj projesi bağlamını koru.
            - Sadece yeniden yazılmış soruyu döndür.
            - Açıklama yapma.
            """
        },
        {
            "role": "user",
            "content": soru
        }
    ],
    temperature=0,
    reasoning_effort="none",
    max_completion_tokens=100
)

    cevap = response.choices[0].message.content or ""

    if "</think>" in cevap:
        cevap = cevap.split("</think>")[-1].strip()

    return cevap.strip() or soru


# ============================================================
# 9. QDRANT ARAMASI
# ============================================================

def bilgi_ara(soru):

    try:
        duzenlenmis_soru = soruyu_duzenle(soru)
    except Exception:
        logger.warning("Arama sorusu düzenlenemedi; özgün soru kullanılacak.")
        duzenlenmis_soru = soru

    soru_vector = get_embedding_model().encode(
        duzenlenmis_soru,
        normalize_embeddings=True
    ).tolist()

    client = get_qdrant()
    collection = ACTIVE_COLLECTION_NAME if client.collection_exists(ACTIVE_COLLECTION_NAME) else COLLECTION_NAME
    results = client.query_points(
        collection_name=collection,
        query=soru_vector,
        limit=4
    ).points

    return results


# ============================================================
# 10. RAG CEVABI
# ============================================================

def cevap_uret(soru):

    results = bilgi_ara(soru)

    if not results or results[0].score < 0.35:
        return "Bu konuda bilgi tabanımda bilgi bulunmuyor."

    kaynak_metinler = []

    for result in results:
        if result.score >= 0.35:
            kaynak_metinler.append(
                (result.payload or {}).get("metin", "")
            )

    context = "\n\n---\n\n".join(kaynak_metinler)

    system_prompt = """
Sen FLO GEN staj projesi için geliştirilmiş bir bilgi asistanısın.

Kullanıcının sorularını SADECE verilen kaynak bilgilerden cevapla.

Kurallar:
- Kendi genel bilgilerini kullanma.
- Bilgi uydurma.
- Tahmin yapma.
- Kaynaklarda cevap yoksa:
  "Bu konuda bilgi tabanımda bilgi bulunmuyor."
  de.
- Türkçe konuş.
- Günlük ve doğal bir dil kullan.
- Kullanıcı yazım hataları yapabilir.
- Kullanıcının ne demek istediğini anlamaya çalış.
- Kısa sorulara kısa cevap ver.
- Gereksiz akademik veya resmi ifadeler kullanma.
"""

    user_prompt = f"""
KAYNAK BİLGİLER:

{context}

KULLANICI SORUSU:

{soru}
"""

    response = get_groq().chat.completions.create(
        model="qwen/qwen3.6-27b",
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],
        temperature=0.1,
        reasoning_effort="none",
        max_completion_tokens=300
    )

    cevap = response.choices[0].message.content or "Bu konuda bilgi tabanımda bilgi bulunmuyor."

    if "</think>" in cevap:
        cevap = cevap.split("</think>")[-1].strip()

    return cevap


# ============================================================
# 11. ANA SAYFA
# ============================================================

@app.get("/")
def root():
    return {
        "status": "FLO Chatbot API çalışıyor."
    }


# ============================================================
# 12. CHAT ENDPOINT
# ============================================================

@app.post("/chat")
def chat(request: ChatRequest):
    soru = request.message.strip()
    if not soru:
        return {"answer": "Lütfen bir soru yaz."}
    soru_kucuk = re.sub(r"[\W_]+", " ", soru.lower()).strip()

    # Nasılsın / hal hatır
    if soru_kucuk in [
        "nasılsın",
        "naber",
        "ne haber",
        "napıyorsun",
        "ne yapıyorsun"
    ]:
        return {
            "answer": "İyiyim, teşekkür ederim! 😊 FLO staj programı veya departmanlar hakkında ne öğrenmek istersin?"
        }

    # Teşekkür
    if soru_kucuk in [
        "teşekkür",
        "teşekkürler",
        "teşekkür ederim",
        "sağ ol",
        "sağol",
        "eyvallah"
    ]:
        return {
            "answer": "Rica ederim! 😊 Başka bir sorun varsa yardımcı olabilirim."
        }

    # Vedalaşma
    if soru_kucuk in [
        "görüşürüz",
        "hoşça kal",
        "bay bay",
        "bye"
    ]:
        return {
            "answer": "Görüşürüz! 👋"
        }

    # Selamlaşma
    if soru_kucuk in [
        "selam",
        "merhaba",
        "selamlar",
        "hey",
        "kanka"
    ]:
        return {
            "answer": "Selam! 👋 FLO departmanları ve staj programı hakkında ne öğrenmek istersin?"
        }
    try:
        cevap = cevap_uret(soru)
    except Exception:
        logger.exception("Chatbot yanıtı üretilemedi.")
        raise HTTPException(status_code=503, detail="Asistan şu an yanıt veremiyor. Biraz sonra tekrar dene.") from None

    return {
        "answer": cevap
    }
