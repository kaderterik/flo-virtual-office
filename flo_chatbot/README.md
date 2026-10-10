# FLO RAG Chatbot

Bu klasör, departman bilgi belgelerini Qdrant'a yükleyen FastAPI tabanlı FLO bilgi asistanını içerir.

## Bilgi belgesi ekleme

1. `.docx` veya `.txt` dosyasını `flo_chatbot/data` klasörüne ekleyin.
2. Word belgesinde departman ve konu adlarını **Başlık 1 / Başlık 2** stilleriyle yazın. Her başlık bağımsız bir RAG parçasına dönüştürülür.
3. `flo_chatbot` klasöründe `python load_data.py` komutunu çalıştırın. Belgeler yeni bir koleksiyona yüklenir; kayıt sayısı doğrulandıktan sonra `flo_bilgi_tabani_active` alias'ı tek işlemde değiştirilir. Yükleme başarısız olursa aktif kaynak korunur. Önceki koleksiyonlar otomatik silinmez; geri dönüş için saklanır ve depolama kullanımına dahildir.

Geçici Word dosyaları (`~$...`) otomatik olarak yok sayılır. Kaynak dosya adı, bölüm başlığı ve departman bilgisi Qdrant metadata'sına eklenir.

## Çalıştırma

```powershell
cd flo_chatbot
uvicorn main:app --reload
```

Arayüz varsayılan olarak `http://127.0.0.1:8000/chat` adresine bağlanır. API başka bir adreste çalışıyorsa `js/app.js` yüklenmeden önce `window.FLO_CHATBOT_API_URL` değerini tanımlayın.

Bilgi tabanı ilk kez hazırlanıyorsa veya kaynaklar değiştiyse ayrıca `python load_data.py` çalıştırın. API aktif alias varsa onu, yoksa önceki `flo_bilgi_tabani` koleksiyonunu kullanır. İlk bilgi sorusunda embedding modeli yüklenir; selamlaşmalar modele ihtiyaç duymaz. Groq ve Qdrant bağlantılarında süre sınırları vardır; arayüz 45 saniyede beklemeyi sonlandırıp tekrar deneme sunar. Modeli ilk kez yüklemek daha uzun sürebilir.

Kök klasörden offline kontrol: `flo_chatbot/.venv/Scripts/python.exe tests/chatbot_unit.py`. Bu test ağ istemcilerini taklit eder, kurulu Qdrant'ın Python veri modellerini kullanır; canlı Groq/Qdrant bağlantısını doğrulamaz.

Gerekli `.env` alanları:

```text
GROQ_API_KEY=...
QDRANT_URL=...
QDRANT_API_KEY=...
```
