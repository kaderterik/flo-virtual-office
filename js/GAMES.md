# Departman oyunları

Proje doğrudan script etiketleriyle çalışan JavaScript kullanır; ortak bileşenler için React veya ek derleme adımı gerekmez.

- `data.js`: Her departmanın `gameTitle`, `taskSummary`, `gameComponent` ve `hotspots` alanları.
- `games-data.js`: Kartlar, doğru cevaplar, süreler ve oyun hedefleri.
- `mission-data.js`: 20 departmanın her biri için üç iş senaryosu; kanıtlar, seçimler, karar puanları ve sonuç açıklamaları.
- `simulation-data.js`: Dokuz departmanın güncel operasyon verisi ve oyun meta verisi. `games-data.js` sonrasında yüklenir; eski temel mekanikleri bu departmanlarda değiştirir.
- `simulation-games.js`: Durum tutan oynanışlar; ortak stok/kapasite, ön koşullar, süre ve puan kuralları. Mevcut tur yaşam döngüsüne bağlıdır.
- `prop-art.js`: Tüm oda bilgi noktaları ve oyun kartları için SVG oyun nesneleri; gölgeler, ışık ayrıntıları ve ortak çizgi dili. Yeni bir nesne `art` çizimleri ve `emoji`/`aliases` eşlemesiyle eklenir.
- `games.js`: `components` kaydı, mekanikler ve tur yaşam döngüsü. `gameComponent` kayıtta bulunamazsa “Oyun Yakında Ekleniyor” görünür.
- `game-feedback.js`: Ortak `TaskIntro`, `ScoreBar`, `FilloReaction`, `CompletionOverlay` ve `GameFeedbackProvider`. Mekanikler `onCorrectDrop` / `onWrongDrop` ile tepki bildirir. Skorlar `scoreMetrics` üzerinden mekaniğe uygun etiketle gösterilir.
- `game-art.js`: Fil maskotunun ifadeleri ve ortak kalın çizgili SVG görev illüstrasyonları.
- `../css/game-theme.css`: Tüm oyunların kontrast, renk, katı gölge ve basılabilir buton tasarımı; mobil ve azaltılmış hareket desteği.
- `room-explore.js`: Görsele hizalanan bilgi noktaları, erişilebilir keşif listesi ve açıklama paneli.

Yeni bir departman için mevcut bir `gameComponent` anahtarı seçip departman meta verisini ve oyun içeriğini eklemek yeterlidir. Yeni bir mekanik için `components` kaydına çizici ve tip eklenir; geri bildirim veya sonuç ekranı yeniden yazılmaz.

13. odadaki Canlı Sprint, beş işi gerçekten geliştirme ve test aşamalarından geçirir. Aynı anda iki geliştirme ve bir test çalışabilir. `dev` ve `test` süreleri gün ilerletmeyle tüketilir; sıfırlanmadan sonraki aşamaya geçilemez. `deps`, yayına çıkması gereken ön koşul işlerinin indeksleridir. Onuncu gün dolmadan işler tamamlanmalıdır; yedinci günden sonraki bitişler puanı düşürür.

## Revize edilen temel oyunlar

| Departman | Oynanış |
|---|---|
| 1 / İK | Adayların iki yetkinliğini görüşmelerle doğrula; karşılamayan adaya teklif başarısız olur. |
| 4 / Planning | 20 çifti raf kapasitesi, stok açığı ve katkıya göre dağıt; gönderimler sınırlı havuzdan tüketilir. |
| 6 / Operasyon | Bekleyen satış, iade ve transfer kayıtlarıyla sayımı uzlaştır; sayı ve neden ayrı puanlanır. |
| 8 / Perakende | Siparişleri serbest sırada karşıla; tüm siparişler aynı stok ve paketleme kapasitesini tüketir. |
| 9 / E-ticaret | Üç vitrin alanını seç; aynı ürünü iki kez kullanamazsın. Stok, ilgi, iade ve alan görünürlüğü puanı etkiler. |
| 12 / Yalın dönüşüm | Her gözlem için israf türü ve iyileştirme seç. Nesneye tıklamak kendi başına puan vermez. |
| 13 / Teknoloji | Kapasite ve yayın bağımlılıklarıyla sprint yönet. |
| 18 / Mimari | İki ekiple işleri paralel planla; bağımlılıklar ve güvenlik kontrolü tamamlanmadan açılış yapılamaz. |
| 20 / Lojistik | Güzergâh ve palet kapasitesine göre araçları yükle, gerektiğinde yükü geri al, sefer sayısını azalt. |

Simülasyonlar `passScore` eşiğini sağlayınca aynı karar masası ve rozet akışıyla devam eder. Başarısız işlemler durumu değiştirmez; tekrar deneme yeni tur oluşturur. Gün kontrolü gerçek zaman sayacı değildir, oyuncunun yönettiği simülasyon takvimidir.

Rozetler başarı anında `flo-game-badges` anahtarı altında benzersiz departman kimlikleriyle saklanır. Sohbete dönüldüğünde ilerleme çubuğu yeniden senkronize edilir. Sonuçtan çıkma, tekrar oynama ve odadan ayrılma eski turun zamanlayıcılarını ve dinleyicilerini temizler.

Her oyun artık iki aşamalıdır. Hazırlık görevi geçilince, süre baskısı olmayan karar masası açılır. Her senaryoda seçeneklerin sırası tur başında karıştırılır. Güçlü karar 2, eksik karar 1, koşullara uymayan karar 0 puandır; her seçim tek kez sayılır ve sonucu açıklanır. Üç senaryoda en az 5/6 karar puanı gerekir. Hazırlığı geçmek tek başına rozet kazandırmaz. Son rapor hazırlık ve karar puanlarını ayrı gösterir; kalıcı skor bunların toplamıdır. Eski rozetler korunur.

Bütçe görevi, 100 birimin tamamı dağıtılsa bile hedefe %75'ten az yakınlıkta başarısız olur. Başarılı bütçe hazırlığı da karar masasıyla devam eder. Görev raporunda senaryo seçimleri ve önerilen yaklaşımlar incelenebilir. Sayılar ve kurallar eğitim amaçlı örneklerdir.

Mod etiketleri gerçek kuralları gösterir: süreli görev, hata hakkı olan görev veya serbest tempo. İki hata hakkı yalnızca bunu verisinde tanımlayan oyunda geçerlidir; diğer oyunlara otomatik can/süre sınırı eklenmez. Süreli turlar düğmeden veya sekme arka plana geçtiğinde duraklar, kalan süre ve hamleler korunur.

Görev, ülke, nokta, sipariş, Kanban kolonu ve stok farkı sayıları ilgili dizilerden hesaplanır. İçeriğe yeni öğe eklerken açıklamadaki sayıları da güncelleyin. 100 birim bütçe, 100 itibar puanı ve ±5 gün toleransı içerik adedi değil, senaryo kurallarıdır.

Chatbot bu proje için yerel kullanım içindir; `http://127.0.0.1:8000/chat` bağlantısı korunur ve backend deploy edilmez.

## Yolculuk özeti

`journey-data.js` kayıtları doğrular; `journey.js` öneri, Canvas sertifikası ve staj defterini ortak erişilebilir dialog içinde gösterir. Görünüm `../css/journey.css` içindedir. Mobilde koridor altındaki menü aynı ekranları açar.

- `flo-game-scores`: `{[deptId]: {score, total, percent}}`. `finish()` her sonuçta `onComplete(id, {score,total,percent,badge,won})` çağırır. Başarısız denemeler de kaydolur; yalnızca başarı rozet kazandırır. Tekrarlarda en yüksek yüzde korunur.
- `flo-room-notes`: `{[deptId]: [spotId, ...]}`. Boş dizi odaya girildiğini, listedeki kimlikler okunan bilgileri belirtir.
- Öneri, en az beş tamamlanmış ve geçerli skoru olan departmanın `family` grubuna göre yüzde ortalamasını karşılaştırır. Eşit ortalamada görev adedi, ardından aile adı sıralaması kullanılır; eşitlik ekranda belirtilir. En güçlü departman eşitliğinde küçük kimlik önce gelir. Eski rozetlerden skor üretilmez; bu görevler yeniden oynanabilir.
- Sertifika her ilerleme düzeyinde yerel Canvas ile 1200×630 PNG üretilir. Paylaşım için dosyayı kullanıcı indirir.
- Koridor ipucu, son ziyaret edilen kapının merkezine en yakın tamamlanmamış kapıyı gösterir. Kat bittiyse merdivene, bütün görevler bittiyse Lounge finaline yönlendirir. Azaltılmış hareket tercihinde nabız animasyonu kapatılır.

Yolculuk testi: `node tests/journey.browser.cjs` (aşağıdaki test ile aynı `NODE_PATH` / `BROWSER_PATH` ayarları).

Karar ve sohbet testi: `node tests/mission-chat.browser.cjs`. Başarı eşiği, kısmi puan, başarısız kararlar, çift tıklama, erken rozet verilmemesi, mobil görünüm, sohbet yeniden denemesi/zaman aşımı ve onaylı kayıt sıfırlama doğrulanır. Sohbet API'si bu testte taklit edilir.

Güncel oyun testi: `NODE_PATH` Playwright kurulumunu gösterecek şekilde `node tests/game-regression.cjs`. Kural testi: `node tests/simulation-rules.browser.cjs`. `BROWSER_PATH` ile Chromium tabanlı tarayıcı yolu değiştirilebilir. `games.browser.cjs`, önceki sıralama, slider, stok ve Kanban mekanikleri için korunan uyumluluk testidir; simülasyon veri katmanı o testte yüklenmez.
