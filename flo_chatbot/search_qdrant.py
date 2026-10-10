import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer

load_dotenv()

# --------------------------------------------------
# 1. QDRANT BAĞLANTISI
# --------------------------------------------------

client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

# --------------------------------------------------
# 2. EMBEDDING MODELİ
# --------------------------------------------------

model = SentenceTransformer(
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

COLLECTION_NAME = "flo_bilgi_tabani"

# --------------------------------------------------
# 3. KULLANICIDAN SORU AL
# --------------------------------------------------

soru = input("\nSorunu yaz: ")

# Soruyu embedding'e çevir
query_vector = model.encode(soru).tolist()

# --------------------------------------------------
# 4. QDRANT'TA BENZER BİLGİLERİ ARA
# --------------------------------------------------

results = client.query_points(
    collection_name=COLLECTION_NAME,
    query=query_vector,
    limit=3
).points

# --------------------------------------------------
# 5. SONUÇLARI GÖSTER
# --------------------------------------------------

print("\n======================================")
print("       EN İLGİLİ QDRANT SONUÇLARI")
print("======================================\n")

for i, result in enumerate(results, start=1):

    print(f"SONUÇ {i}")
    print(f"Benzerlik skoru : {result.score:.4f}")
    print(f"Departman       : {result.payload.get('departman')}")
    print(f"Gün             : {result.payload.get('gun')}")
    print(f"Kaynak          : {result.payload.get('kaynak')}")
    print()

    print(result.payload.get("metin"))

    print("\n" + "-" * 70 + "\n")