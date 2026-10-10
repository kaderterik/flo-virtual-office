# Fillo'nun Yolculuğu

20 departmanı oda keşfi, hazırlık oyunu ve toplam 60 iş senaryosuyla tanıtan FLO GEN staj projesi. Arayüz HTML/CSS/JavaScript kullanır; derleme adımı gerekmez.

## Gönüllü staj projem

Ben Kader Terik. Bu projeyi FLO’daki gönüllü stajım kapsamında, departmanları ve iş süreçlerini oyunlarla keşfedilebilir bir deneyime dönüştürmek için hazırladım. Fillo maskotu eşliğinde ofiste gezebilir, görevleri tamamlayabilir ve öğrenme yolculuğunun sonunda kişisel sertifikanı indirebilirsin.

Mobil departman seçimi, staj defteri ve 100 üzerinden görev sonuçları da deneyimin bir parçasıdır. Chatbot backend’i henüz deploy edilmediği için asistan şu an yalnızca yerel kurulumla çalışır. Oyunlar ve ofis keşfi ayrı bir backend gerektirmez.

[LinkedIn](https://www.linkedin.com/in/kaderterik) · [GitHub](https://github.com/kaderterik)

## Çalıştırma

Proje kökünde `python -m http.server 5500 --bind 127.0.0.1` çalıştırıp `http://127.0.0.1:5500` açın. Chatbot ayrı ve yerel bir servistir; kurulum ve veri güncelleme için `flo_chatbot/README.md` dosyasına bakın.

## Oyunlar ve kayıtlar

Hazırlık görevini geçtikten sonra üç iş senaryosunda karar verilir. Rozet, hazırlık ve en az 5/6 karar puanıyla kazanılır. Sonuç ekranı seçimlerin etkisini ve doğru yaklaşımı açıklar. Senaryolar eğitim amaçlıdır.

Rozet, en iyi skor ve keşif notları bu tarayıcının yerel verisinde tutulur. Eski kayıtlar korunur. Staj Defterim içindeki **Yolculuğu Sıfırla** seçeneği onaylandıktan sonra bu üç kaydı temizler. Mobilde **Asistan** düğmesi aynı sohbeti dialog içinde açar.

## Doğrulama

Playwright'ın kurulu olması gerekir. `NODE_PATH` paket dizinini; gerekirse `BROWSER_PATH` Edge/Chromium yürütülebilir dosyasını gösterir.

```powershell
node tests/games.browser.cjs
node tests/game-regression.cjs
node tests/simulation-rules.browser.cjs
node tests/journey.browser.cjs
node tests/mission-chat.browser.cjs
flo_chatbot/.venv/Scripts/python.exe tests/chatbot_unit.py
```

Tarayıcı testleri ekran görüntülerini `tmp/` içine yazar. Backend testleri dış servisleri taklit eder; gerçek bağlantıyı test etmez.

`game-regression.cjs` güncel 20 oyunu ve dokuz simülasyonun mobil görünümünü test eder. `simulation-rules.browser.cjs` yanlış kararları, ortak stok/kapasite tüketimini, yayın ve şantiye bağımlılıklarını doğrular. Önceki `games.browser.cjs` kapsamı korunmuştur; bu test, yeni senaryo verisini yüklemeden eski mekaniklerin uyumluluğunu kontrol eder.

## Görseller ve paylaşım kapsamı

Arayüz, WebP oda ve koridor görsellerini yükler. Bu depoda güncel uygulama kaynakları, kullanılan görseller, tarayıcı testleri ve chatbot kaynak kodu bulunur. Yerel `.env` dosyası, staj belgeleri, sanal ortam, eski prototip ve geçici çıktılar paylaşılmaz. Chatbot bilgi tabanını kullanmak için kendi belgelerini ve API ayarlarını yerel kurulumda sağlamalısın.

Oyun mekanikleri ve genişletme bilgisi `js/GAMES.md` dosyasındadır.
