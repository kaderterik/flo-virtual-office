import os

from dotenv import load_dotenv
from groq import Groq
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer


# ============================================================
# 1. AYARLAR
# ============================================================

load_dotenv()

COLLECTION_NAME = "flo_bilgi_tabani"


# ============================================================
# 2. GROQ BAĞLANTISI
# ============================================================

groq_client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


# ============================================================
# 3. QDRANT BAĞLANTISI
# ============================================================

qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)


# ============================================================
# 4. EMBEDDING MODELİ
# ============================================================

print("Embedding modeli yükleniyor...")

embedding_model = SentenceTransformer(
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

print("Chatbot hazır!\n")

def soruyu_duzenle(soru):

    response = groq_client.chat.completions.create(
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
        temperature=0
    )

    cevap = response.choices[0].message.content

    if "</think>" in cevap:
        cevap = cevap.split("</think>")[-1].strip()

    return cevap.strip()
# ============================================================
# 5. QDRANT'TAN İLGİLİ BİLGİLERİ GETİR
# ============================================================

def bilgi_ara(soru):

    duzenlenmis_soru = soruyu_duzenle(soru)

    print(f"\nArama sorusu: {duzenlenmis_soru}\n")

    soru_vector = embedding_model.encode(
        duzenlenmis_soru,
        normalize_embeddings=True
    ).tolist()

    results = qdrant_client.query_points(
        collection_name=COLLECTION_NAME,
        query=soru_vector,
        limit=4
    ).points

    return results


# ============================================================
# 6. RAG İLE CEVAP ÜRET
# ============================================================

def cevap_uret(soru):

    results = bilgi_ara(soru)

    # Çok düşük benzerlik varsa cevap verme
    if not results or results[0].score < 0.35:
        return (
            "Bu konuda bilgi tabanımda "
            "bilgi bulunmuyor."
        )

    kaynak_metinler = []

    for result in results:

        if result.score >= 0.35:

            metin = result.payload.get(
                "metin",
                ""
            )

            kaynak_metinler.append(metin)

    context = "\n\n---\n\n".join(
        kaynak_metinler
    )

    system_prompt = """
Sen FLO GEN staj projesi için geliştirilmiş
bir bilgi asistanısın.

Görevin kullanıcının sorularını SADECE sana
verilen KAYNAK BİLGİLER kullanılarak cevaplamaktır.

KURALLAR:

1. Yalnızca kaynak bilgilerde bulunan bilgileri kullan.
2. Kendi genel bilgilerini kullanma.
3. Kaynaklarda bulunmayan bilgi üretme veya tahmin etme.
4. Sorunun cevabı kaynaklarda bulunmuyorsa:
   "Bu konuda bilgi tabanımda bilgi bulunmuyor."
   cevabını ver.
5. Türkçe cevap ver.
6. Cevaplarını açık, doğal ve anlaşılır şekilde oluştur.
7. Gereksiz şekilde uzun cevap verme.
8. Kaynakta kesin olmayan bir bilgiyi kesinmiş gibi sunma.
"""

    user_prompt = f"""
KAYNAK BİLGİLER:

{context}

----------------------------

KULLANICI SORUSU:

{soru}
"""

    response = groq_client.chat.completions.create(
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

        temperature=0.1
    )

    cevap = response.choices[0].message.content

    # Model <think> çıktısı döndürürse kaldır
    if "</think>" in cevap:
        cevap = cevap.split(
            "</think>"
        )[-1].strip()

    return cevap


# ============================================================
# 7. CHATBOT
# ============================================================

while True:

    soru = input("Sen: ").strip()

    if soru.lower() in [
        "çık",
        "cik",
        "exit",
        "quit"
    ]:
        print("\nFLO Asistan: Görüşmek üzere!")
        break

    if not soru:
        continue

    print("\nFLO Asistan düşünüyor...\n")

    cevap = cevap_uret(soru)

    print("FLO Asistan:")
    print(cevap)

    print("\n" + "-" * 60 + "\n")