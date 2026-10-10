// Fictional workplace cases. Values and policies belong to these training scenarios.
// Each choice has a consequence: 2 = sound decision, 1 = incomplete, 0 = misses a constraint.
const departmentMissions = (() => {
    const mission = (title, brief, evidence, choices) => ({title, brief, evidence,
        choices: choices.map(([label, points, consequence]) => ({label, points, consequence}))});
    return {
        1: [
            mission('Aday kısa listesi', 'Bir analist pozisyonu için iki aday kaldı. Kısa listeyi nasıl hazırlarsın?',
                ['İş için Excel ve veri yorumlama gerekiyor.', 'Aday A: uygulama testi 85/100, ilgili deneyim 1 yıl.', 'Aday B: uygulama testi 55/100, ilgili deneyim 4 yıl.'], [
                    ['İşle ilgili aynı ölçütlerle değerlendir; A’yı yönetici görüşmesine taşı.', 2, 'İşe uygun kanıtları kullanıp görüşmeyle doğrulamak, yalnızca kıdeme bakmaktan daha tutarlı bir değerlendirme sağlar.'],
                    ['İkisini de kısa listeye al; ölçütleri yönetici belirlesin.', 1, 'İki aday korunur ama ortak ölçütleri baştan belirlemediğin için karar kişisel tercihlere açık kalır.'],
                    ['Daha deneyimli olduğu için doğrudan B’ye teklif gönder.', 0, 'Testteki beceri açığı ve kalan değerlendirme adımları atlandı. Kıdem, gereken yetkinliği tek başına kanıtlamaz.']]),
            mission('Referans bilgisi', 'Görüşmeler iyi geçti. Adayın verdiği referans henüz yanıtlamadı; ekip hızlı başlamak istiyor.',
                ['Bu senaryoda tekliften önce referans kontrolü gerekiyor.', 'Adaya süreç ve takvim önceden açıklandı.', 'Referans için adayın onayı alınmış.'], [
                    ['Adayı bilgilendir; onaylı başka bir referansla kontrolü tamamla.', 2, 'Hem kontrol adımı hem adayın bilgisi ve onayı korunur. Hız için süreçten vazgeçilmez.'],
                    ['Yanıt gelene kadar adaya haber vermeden bekle.', 1, 'Kontrol korunur ama belirsizlik aday deneyimini zayıflatır. Takvimi paylaşmalısın.'],
                    ['Kontrolü atla, teklif gönder ve sonra referansı ara.', 0, 'Senaryonun teklif öncesi kontrol şartını karşılamadın.']]),
            mission('İlk hafta', 'Yeni çalışan ilk gününde sistemlere giremiyor. Ne yaparsın?',
                ['Yönetici ilk görevini hazırladı.', 'Eğitim hesabı ve ekipman talebi henüz açılmadı.', 'Kişisel hesap paylaşımı yasak.'], [
                    ['İlgili ekiplerle erişimleri açtır; ilk hafta planı ve bir ekip arkadaşıyla başlangıcı düzenle.', 2, 'İşe giriş, ekip koordinasyonu ve öğrenme planı birlikte ele alındı.'],
                    ['Sadece eğitim videolarını gönder; erişimler sonra çözülür.', 1, 'Öğrenmeye destek var ama çalışmayı engelleyen erişim sorunu çözülmedi.'],
                    ['Hızlı başlasın diye başka çalışanın hesabını kullandır.', 0, 'Hesap paylaşımı, kimin hangi işlemi yaptığı bilgisini ve erişim güvenliğini bozar.']])
        ],
        2: [
            mission('Talep mi, stok fazlası mı?', 'Bir model için yeni sipariş talebi geldi. Önce ticari veriyi değerlendir.',
                ['Haftalık satış 120 çift; elde 240 çift var.', 'Yeni sipariş teslimi 5 hafta sürüyor.', 'Önümüzdeki 6 hafta benzer talep bekleniyor.'], [
                    ['Tedarik planını şimdi başlat; teslim gelene kadar stok ve talebi haftalık izle.', 2, 'Stok yalnızca 2 haftalık talebi karşılıyor; 5 haftalık tedarik süresi satış kaybı riski yaratıyor.'],
                    ['Bir hafta daha izle, ardından sipariş kararını ver.', 1, 'Veri takibi faydalı ama gecikme, zaten uzun olan tedarik süresini daha da uzatır.'],
                    ['Stok yüksek göründüğü için sezon sonuna kadar sipariş verme.', 0, 'Mutlak stok sayısını satış hızıyla karşılaştırmadın. 240 çift bu durumda fazla stok değil.']]),
            mission('İade alarmı', 'Yeni model hızlı satıyor fakat iade oranı yükseldi.',
                ['İade oranı %18; benzer modellerde %5.', 'İadelerin çoğu “kalıp dar” gerekçesiyle geliyor.', 'Ürün sayfasında beden yönlendirmesi bulunmuyor.'], [
                    ['Kalite ve beden bilgisini incele; ürün açıklamasını düzeltip sonucu ölç.', 2, 'Satışın yanında müşteri deneyimi ve iade nedeni ele alındı. Nedene yönelik iyileştirme yapılır.'],
                    ['Yeni siparişi durdur, nedeni araştırmayı bir sonraki rapora bırak.', 1, 'Stok riski azalır ama mevcut müşterilerin yaşadığı sorun devam eder.'],
                    ['İadeyi telafi etmek için hemen daha büyük kampanya aç.', 0, 'Sorun çözülmeden talebi artırmak daha fazla iade ve memnuniyetsizlik oluşturabilir.']]),
            mission('Mağazalar arası denge', 'Aynı ürün iki mağazada farklı hızlarda satılıyor.',
                ['A: stok 80, haftalık satış 5.', 'B: stok 10, haftalık satış 25.', 'Transfer 2 gün; tedarik 4 hafta.'], [
                    ['A’dan B’ye kontrollü transfer yap; iki mağazanın kalan stokunu takip et.', 2, 'Transfer, fazla ve yetersiz stoku aynı anda dengeler; yeni tedarikten daha hızlıdır.'],
                    ['B için yeni sipariş ver, A’nın stokunu koru.', 1, 'B’nin ihtiyacı tanındı ama 4 haftalık bekleme ve A’daki atıl stok çözülmedi.'],
                    ['Her iki mağazada aynı oranda indirim yap.', 0, 'B’de talep zaten güçlü ve stok az. Genel indirim, stok dengesizliğini çözmez.']])
        ],
        3: [
            mission('Kategori incelemesi', 'Bir kategori geçen aya göre daha az satıyor. Önce hangi karşılaştırmayı yaparsın?',
                ['Satış adedi %12 düştü.', 'Mağaza sayısı aynı; iki çok satan model bazı bedenlerde tükendi.', 'Trafik geçen ayla benzer.'], [
                    ['Beden bazlı bulunurluk ve satış kaybını incele.', 2, 'Talep sürerken bulunurluk kaybı satış düşüşünü açıklayabilir. Kategori toplamı tek başına yeterli değildir.'],
                    ['Önce bütün kategori için rakip fiyatlarını topla.', 1, 'Rakip bilgisi faydalı olabilir ama elindeki en belirgin stok sinyalini ertelemiş olursun.'],
                    ['Düşüşü talep kaybı sayıp tüm kategori alımını azalt.', 0, 'Stoksuzluk nedeniyle oluşan kaybı talep azalmasıyla karıştırdın.']]),
            mission('Sezon dengesi', 'Yeni sezon alım planını hazırlıyorsun.',
                ['Temel ürünlerin satışları istikrarlı.', 'Yeni trend model sosyal medyada güçlü, satış geçmişi yok.', 'Bütçe sınırlı; sezon içinde ek sipariş mümkün.'], [
                    ['Temel talebi koru; trend modeli sınırlı pilotla test et.', 2, 'Belirsiz talebi kontrollü test ederken istikrarlı satışları riske atmazsın.'],
                    ['Bütçeyi geçen sezonla tamamen aynı dağıt.', 1, 'Mevcut talep korunur ama yeni trendi ölçme fırsatı kaçırılır.'],
                    ['Bütçenin tamamını trend modele ayır.', 0, 'Satış kanıtı olmayan tek ürüne yoğunlaşmak kategori ve stok riskini artırır.']]),
            mission('Rakip fiyatı', 'Bir rakip benzer üründe fiyat düşürdü. Nasıl karar verirsin?',
                ['Senin ürününde satış hedefi karşılanıyor.', 'Brüt marj %32; eş fiyat için %15 indirim gerekiyor.', 'Ürün kalitesi ve garanti koşulları aynı değil.'], [
                    ['Ürün farklarını, marj etkisini ve satış dönüşümünü birlikte değerlendir.', 2, 'Fiyat kararı, rakip etiketi kadar değer önerisi ve kârlılıkla da ilgilidir.'],
                    ['Küçük bir mağaza grubunda indirim dene, marjı ayrıca takip et.', 1, 'Pilot ölçüm sağlar ama ürünlerin karşılaştırılabilirliği önce doğrulanmalı.'],
                    ['Tüm mağazalarda otomatik olarak rakip fiyatına in.', 0, 'Performans ve marj etkisi değerlendirilmeden genel fiyat değişikliği yapıldı.']])
        ],
        4: [
            mission('Talep sapması', 'Planlanan stok dağılımı sonrası bir mağazada satış hızlandı.',
                ['A mağazası: 1 haftalık stok; satış artışı 3 haftadır sürüyor.', 'B mağazası: 8 haftalık stok.', 'Transfer maliyeti, yeni sipariş maliyetinden düşük.'], [
                    ['B’den A’ya transfer planla; yeni talebe göre sonraki dağılımı güncelle.', 2, 'Kısa vadeli stok açığı ve sonraki planın doğruluğu birlikte iyileşir.'],
                    ['A’ya yeni sipariş aç; mevcut dağılım oranlarını koru.', 1, 'A’nın ihtiyacı karşılanabilir ama B’deki stok fazlası ve güncelliğini yitiren plan korunur.'],
                    ['Plan bozulmasın diye dağılımı sezon sonuna kadar değiştirme.', 0, 'Gerçekleşen talebi plana yansıtmamak satış kaybını sürdürür.']]),
            mission('Bütçe önceliği', 'Ek alım için 100 birim var. İki ürünün beklentisini karşılaştır.',
                ['X: yüksek talep, 2 haftalık stok, 3 haftalık tedarik.', 'Y: yavaş satış, 10 haftalık stok.', 'Yeni alımın amacı bulunurluğu korumak.'], [
                    ['X’in açığına öncelik ver; Y için yeni alımı ertele.', 2, 'Bütçe, mevcut stok ve tedarik süresiyle desteklenen ihtiyaçlara yönlendirildi.'],
                    ['Bütçeyi iki ürüne eşit böl.', 1, 'Dağılım dengeli görünür ama gerçek ihtiyaçlar eşit değil.'],
                    ['Y’nin birim fiyatı ucuz olduğu için bütçeyi Y’ye ver.', 0, 'Birim maliyet düşse de ihtiyaç olmayan stok büyür.']]),
            mission('Tahmin kontrolü', 'Son tahmin 1.000, gerçekleşen satış 700. Sonraki tahmini nasıl düzeltirsin?',
                ['İki hafta stok kesintisi yaşandı.', 'Kampanya planlanan tarihte başlamadı.', 'Satış kaybı ile talep düşüşü henüz ayrıştırılmadı.'], [
                    ['Stok ve kampanya etkisini ayır; gerçek talep sinyaliyle tahmini güncelle.', 2, 'Gerçekleşen satışın koşulları anlaşılmadan oranı kopyalamak doğru talep tahmini vermez.'],
                    ['Tahmini kademeli azaltıp sonraki raporu bekle.', 1, 'Daha temkinli plan oluşur ama nedenler henüz açıklanmadığı için sapma tekrarlayabilir.'],
                    ['Tüm ürünlerin tahminini doğrudan %30 azalt.', 0, 'Tek senaryodaki sapmayı bütün ürünlere genelleyip stok kesintisini talep kaybı saydın.']])
        ],
        5: [
            mission('Numune kapısı', 'Üretici teslim tarihini korumak için numune onayını beklemeden üretim istiyor.',
                ['Taban dayanıklılık testinde uygunsuzluk var.', 'Seri üretimde 5.000 çift planlandı.', 'Malzeme değişikliği 3 gün sürüyor.'], [
                    ['Uygunsuzluğu giderip yeniden test et; teslim planını ilgili ekiplerle güncelle.', 2, 'Küçük gecikme, seri üretimde büyüyecek kalite riskini önler.'],
                    ['Üretimin küçük bir bölümünü başlat, diğerini testten sonra yap.', 1, 'Risk azalır ama uygunsuz ürün üretimi yine de başlamış olur.'],
                    ['Tarihi korumak için tüm üretimi onayla.', 0, 'Teslim hızını doğrulanmış kalite sorununun önüne koydun.']]),
            mission('Veri tutarlılığı', 'Tasarım onaylandı ama üretimde eski renk kodu görünüyor.',
                ['PLM kaydı güncel.', 'Üretim siparişinde bir önceki sürüm var.', 'Üretim henüz başlamadı.'], [
                    ['Üretimi beklet; sipariş ve ürün verisini aynı onaylı sürüme getir.', 2, 'Sistemler arası sürüm farkı, yanlış ürüne dönüşmeden düzeltildi.'],
                    ['Üreticiye telefonda doğru rengi söyle, kayıtları sonra düzelt.', 1, 'Bilgi ulaşır ama resmî kayıt ve izlenebilirlik uyuşmazlığı sürer.'],
                    ['Onaylanmış sipariş eski olduğu için eski rengi üret.', 0, 'Güncel tasarım gereksinimini karşılamayan ürünler oluşur.']]),
            mission('Teslim gecikmesi', 'Bir malzeme gecikti ve sevkiyat risk altında.',
                ['Alternatif malzeme var; kalite testi yapılmadı.', 'Mevcut malzeme 4 gün sonra gelecek.', 'Mağaza açılışına 12 gün var.'], [
                    ['Kaliteyle alternatif testi ve üretimle güncel kritik takvimi birlikte değerlendir.', 2, 'Hem güvenilir alternatif hem gerçek teslim ihtiyacı değerlendirilir.'],
                    ['Sadece mevcut malzemeyi bekle; satış ekibine gecikmeyi söyle.', 1, 'Bilgilendirme var ama uygulanabilir alternatif araştırılmıyor.'],
                    ['Alternatifi test etmeden hemen kullan.', 0, 'Takvim kazanımı için ürün uygunluğu riske atıldı.']])
        ],
        6: [
            mission('Sayım farkı', 'Sistemde 30, rafta 27 çift görünüyor. İlk işlemin ne?',
                ['Üç çift için yeni sevkiyat kaydı var.', 'Sevkiyat fiziksel olarak ayrılmış, sistem işlemi tamamlanmamış.', 'Bu senaryoda stok düzeltmesi öncesi kayıt kontrolü gerekiyor.'], [
                    ['Sevkiyat kaydını ve ikinci sayımı doğrula; gerçek fark varsa düzelt.', 2, 'İşlem zamanlamasından kaynaklanan fark ile gerçek eksik ayrıştırılır.'],
                    ['Tekrar say, sevkiyat kaydını kontrol etmeden farkı raporla.', 1, 'Sayım doğrulanır ama farkın muhtemel nedeni araştırılmamış olur.'],
                    ['Sistemi hemen 27’ye indir.', 0, 'Bekleyen sevkiyat işlenince stok iki kez düşebilir.']]),
            mission('Tekrarlayan eksik', 'Aynı raf üç sayımda da eksik çıktı.',
                ['Giriş sayımları tutarlı.', 'Raf transferleri elle not ediliyor.', 'Eksikler çoğunlukla yoğun vardiyada oluşuyor.'], [
                    ['Transfer izini incele; kayıt akışını ve vardiya kontrolünü iyileştir.', 2, 'Farkı düzeltmekle kalmayıp tekrarını oluşturan süreç araştırılır.'],
                    ['Sayım sıklığını artır, mevcut kayıt yöntemini koru.', 1, 'Sorun daha hızlı görülür ama kök nedeni devam eder.'],
                    ['Her eksikte stok değerini düzeltip kaydı kapat.', 0, 'Belirti giderilir; izlenebilirlik sorunu ve tekrar maliyeti sürer.']]),
            mission('Raf önceliği', 'Sayım için 30 dakikan var. Nereden başlarsın?',
                ['A: yüksek hareket, son sayım 6 hafta önce.', 'B: düşük hareket, dün sayıldı ve fark yok.', 'C: orta hareket, geçen hafta sayıldı.'], [
                    ['A’yı önce say; risk ve son sayım süresine göre sırala.', 2, 'Sınırlı kaynak, fark ihtimali ve etkisi daha yüksek alana yönlendirildi.'],
                    ['Üçüne eşit süre ayır.', 1, 'Kapsama sağlanır ama riskin yoğunlaştığı rafta yeterli kontrol zamanı kalmayabilir.'],
                    ['Daha hızlı biteceği için yalnızca B’yi say.', 0, 'Kolay işlem seçilirken en yüksek risk kontrol dışı kalır.']])
        ],
        7: [
            mission('Malzeme seçimi', 'Yeni taban için iki numune geldi.',
                ['A: geri dönüştürülmüş içerik %60; dayanıklılık testi başarısız.', 'B: içerik %40; dayanıklılık ve güvenlik testleri başarılı.', 'Ürün uzun ömürlü günlük kullanım için tasarlanıyor.'], [
                    ['B ile ilerle; A’yı dayanıklılık geliştirmesi için geri gönder.', 2, 'İçerik oranı kadar güvenlik ve kullanım ömrü de tasarım kararının parçasıdır.'],
                    ['Her ikisini de yeniden test etmeden geliştirme ekibine bırak.', 1, 'Karar ertelenir; mevcut başarılı numuneden yararlanılmaz.'],
                    ['En yüksek geri dönüşüm oranı nedeniyle A’yı seç.', 0, 'Dayanıklılık şartı ihmal edildi; kısa ömür daha fazla atık yaratabilir.']]),
            mission('Prototip bütçesi', 'Üç tasarımı denemen gerekiyor; kalıp bütçesi sınırlı.',
                ['Her kalıp 10 birim maliyet.', 'Dijital prototip 1 birim, baskı numunesi 2 birim.', 'Görünüm elemesi sonrası tek tasarım fiziksel teste girecek.'], [
                    ['Önce dijital eleme, ardından seçilen tasarımın numunesi ve fiziksel testi.', 2, 'Gereksiz kalıp maliyeti azalırken fiziksel doğrulama korunur.'],
                    ['Üçünü de baskıyla dene; kalıbı sonra seç.', 1, 'Tam kalıptan ucuzdur ama dijital eleme ile daha az numune üretilebilirdi.'],
                    ['Dijital görünümü beğenip fiziksel testi atla.', 0, 'Görsel uygunluk, gerçek kullanım performansını kanıtlamaz.']]),
            mission('Sürdürülebilirlik iddiası', 'Tedarikçi malzemesini “tamamen çevreci” diye tanıtıyor.',
                ['İçerik belgesi paylaşılmadı.', 'Üretim ve dayanıklılık verisi yok.', 'Koleksiyon lansmanına 2 hafta var.'], [
                    ['Belge ve test sonuçlarını iste; doğrulanabilen özelliklerle iletişim kur.', 2, 'Tasarım ve iletişim kararı kanıtlanmış verilere dayanır.'],
                    ['Malzemeyi test et ama tanıtımda iddiayı şimdiden kullan.', 1, 'Teknik doğrulama planı var; iletişim ise kanıt öncesinde kesinleşmiş olur.'],
                    ['Lansmanı kaçırmamak için iddiayı aynen ürün etiketine yaz.', 0, 'Doğrulanmamış bir özellik müşteriye kesin bilgi olarak sunulur.']])
        ],
        8: [
            mission('Teslim sözü', 'Müşteri 2 çift istiyor; teslim sözü en geç 6 saat.',
                ['A: stok 1, teslim 2 saat.', 'B: stok 4, teslim 5 saat.', 'C: stok 20, teslim 9 saat.', 'Sipariş tek noktadan ve eksiksiz gönderilmeli.'], [
                    ['B’den gönder.', 2, 'B hem miktarı karşılıyor hem teslim sözüne uyuyor. En hızlı nokta tek başına yeterli değil.'],
                    ['C’den gönder; gecikme için müşteriyi bilgilendir.', 1, 'Miktar karşılanır ama uygun bir seçenek varken teslim sözü aşılır.'],
                    ['En hızlı olduğu için A’dan gönder.', 0, 'A’daki stok, sipariş miktarını karşılamıyor.']]),
            mission('Stok güncelliği', 'Sistemde son çift görünüyor ama mağaza ürünü bulamıyor.',
                ['Müşterinin ödemesi henüz alınmadı.', 'İkinci noktada doğrulanmış 3 çift var.', 'İkinci nokta 1 saat daha geç teslim ediyor, vaat edilen süre içinde.'], [
                    ['Stoku doğrulanmış ikinci noktayı seç; ilk noktadaki farkı kontrol ettir.', 2, 'Sipariş güvenilir stokla karşılanır; veri sorunu da takip edilir.'],
                    ['İlk noktadan kesin yanıt gelene kadar bekle.', 1, 'Hatalı stokla söz verilmez ama mevcut güvenilir alternatif geciktirilir.'],
                    ['Sistem stokunu yeterli sayıp ilk noktadan ödemeyi al.', 0, 'Fiziksel stok doğrulanmadığı için karşılanamayacak sipariş riski doğar.']]),
            mission('Kapasite kısıtı', 'İki nokta stokta uygun. Hangisini seçersin?',
                ['A: teslim tahmini 2 saat; bugün paketleme kapasitesi dolu.', 'B: teslim tahmini 4 saat; kapasite uygun.', 'Müşteri sözü 5 saat.'], [
                    ['B’yi seç; gerçek kapasiteyle teslim sözünü koru.', 2, 'Rota kararında nominal hızın yanında operasyon kapasitesi de dikkate alındı.'],
                    ['A’nın ek kapasite açmasını bekleyip ardından seç.', 1, 'Hızlı teslim mümkün olabilir ama mevcut uygun seçenek yerine belirsizlik eklenir.'],
                    ['Tahmini daha hızlı olduğu için A’ya hemen yönlendir.', 0, 'Kapasite doluyken nominal teslim süresi güvenilir değildir.']])
        ],
        9: [
            mission('Dijital vitrin', 'Ana sayfanın ilk sırasına hangi ürünü koyarsın?',
                ['A: ilgi yüksek; yalnızca tek beden stokta.', 'B: ilgi yüksek; talep gören bedenler stokta, dönüşüm iyi.', 'C: tüm bedenler var; dönüşüm çok düşük.'], [
                    ['B’yi öne al; beden bulunurluğu ve dönüşümü birlikte izle.', 2, 'Görünürlük, satın alınabilir ürünle satışa dönüşebilir.'],
                    ['A’yı öne al; yüksek ilgiden yararlan.', 1, 'Trafik gelebilir fakat beden bulunurluğu az olduğu için müşteri talebinin çoğu karşılanmaz.'],
                    ['Yalnızca stoğu fazla olduğu için C’yi ilk sıraya koy.', 0, 'Stok fazlası tek başına müşteri ilgisi veya dönüşüm kanıtı değildir.']]),
            mission('Dönüşüm kaybı', 'Ürün sayfasına giriş aynı, satın alma azaldı.',
                ['Mobil yüklenme süresi 2 saniyeden 7 saniyeye çıktı.', 'Fiyat ve stok aynı.', 'Sepete ekleme oranı da düşüyor.'], [
                    ['Mobil performansı incele; değişikliği geri al veya hız sorununu düzelt.', 2, 'Fiyatı değiştirmeden önce düşüşle eşleşen teknik etken ele alınır.'],
                    ['Ürün görsellerini yenile; performansı sonra incele.', 1, 'Sayfa iyileşebilir ama eldeki belirgin yavaşlama sinyali ertelenir.'],
                    ['Dönüşümü yükseltmek için tüm ürünlere indirim yap.', 0, 'Muhtemel teknik sorun sürerken marj kaybı eklenir.']]),
            mission('Deney sonucu', 'Yeni vitrin düzenini değerlendireceksin.',
                ['A: 10.000 ziyaret, 300 sipariş.', 'B: 500 ziyaret, 20 sipariş.', 'Deney için önceden belirlenen örneklem henüz dolmadı.'], [
                    ['Deneyi planlanan örnekleme kadar sürdür; dönüşüm ve gelir etkisini birlikte değerlendir.', 2, 'Küçük gruptaki yüksek oran, tek başına güvenilir sonuç sayılmaz.'],
                    ['B’yi biraz daha fazla ziyaretçiye aç, örneklem planını değiştirdiğini kaydet.', 1, 'Kademeli ilerleme yapılır ama deney tasarımındaki değişiklik sonucu etkileyebilir.'],
                    ['B %4 olduğu için hemen herkese yayınla.', 0, 'A %3 olsa da grupların büyüklüğü ve deney koşulları dikkate alınmadı.']])
        ],
        10: [
            mission('Pazara giriş', 'Kurgusal bir pazarda büyüme planı yapıyorsun.',
                ['Yatırım bütçesi sınırlı.', 'Güçlü, ülke çapında ağı olan yerel ortak var.', 'Marka standartları sözleşme ve denetimle korunabiliyor.'], [
                    ['Yerel ortakla franchise modelini ve kontrol koşullarını değerlendir.', 2, 'Kaynak kısıtı ve yerel ağ, ortaklı modeli destekler; marka standartları ayrıca tanımlanmalıdır.'],
                    ['Küçük bir doğrudan mağaza aç; partner görüşmesini sonraya bırak.', 1, 'Pilot öğrenme sağlar ama mevcut ağdan yararlanmaz ve doğrudan yatırım gerektirir.'],
                    ['Ülke çapında kendi mağazalarını aynı anda aç.', 0, 'Sınırlı yatırım bütçesi ve operasyon kapasitesiyle uyumsuz bir ölçek seçildi.']]),
            mission('Ortak değerlendirmesi', 'Bir aday yüksek satış sözü veriyor; sözleşme öncesi neye bakarsın?',
                ['Finansal belgeler eksik.', 'Mağaza yönetim deneyimi belirsiz.', 'Başka adayın satış hedefi daha düşük, belgeleri ve operasyon geçmişi doğrulanmış.'], [
                    ['Belgeleri, operasyon kapasitesini ve standart uyumunu doğrula; adayları aynı ölçütlerle karşılaştır.', 2, 'Büyük satış vaadi, sürdürülebilir işletme kapasitesinin yerine geçmez.'],
                    ['En yüksek hedefi verene kısa süreli pilot teklif et.', 1, 'Pilot riski sınırlar ama gerekli finansal ve operasyonel kontrol yine yapılmalı.'],
                    ['Yüksek satış sözü verenle hemen uzun vadeli anlaşma yap.', 0, 'Doğrulanmamış kapasiteye uzun vadeli yükümlülük bağlandı.']]),
            mission('Deneme alanı', 'Yeni pazarda müşteri tepkisini düşük maliyetle ölçmek istiyorsun.',
                ['Yerel büyük mağaza içinde marka alanı kiralanabiliyor.', 'Talep belirsiz; tam mağaza yatırımı yüksek.', 'Ürünleri kendi markalı alanda sergilemek gerekiyor.'], [
                    ['Corner ile pilot başlat; satış ve müşteri tepkisini ölç.', 2, 'Mevcut mağaza içinde ayrılmış alan, bu hedeflere uygun düşük ölçekli başlangıç sağlar.'],
                    ['Çok markalı noktalara toptan ürün sat.', 1, 'Yatırım düşük olur ama markaya ayrılmış alan şartı karşılanmaz.'],
                    ['Talep verisi oluşmadan tam mağaza ağı kur.', 0, 'Belirsiz talep için en yüksek yatırımı seçtin.']])
        ],
        11: [
            mission('Kampanya hedefi', 'Yeni sneaker kampanyasının başarısını nasıl ölçersin?',
                ['Amaç: ürün sayfasından satışa dönüşümü artırmak.', 'Video izlenmeleri ve satış verisi ölçülebiliyor.', 'Bütçe iki hafta ile sınırlı.'], [
                    ['Ürün dönüşümü ve sipariş maliyetini izle; izlenmeyi destekleyici ölçüt olarak kullan.', 2, 'Ölçütler kampanyanın satış hedefiyle bağlantılıdır.'],
                    ['Ürün sayfası ziyaretini hedefle, satış ölçümünü sonraya bırak.', 1, 'Huniye trafik gelir ama asıl dönüşüm hedefinin başarısı belirsiz kalır.'],
                    ['Yalnızca video izlenme sayısına göre başarılı say.', 0, 'Yüksek görünürlük, satışa dönüşümün arttığını kanıtlamaz.']]),
            mission('Brief açığı', 'Ajans iki farklı tasarım gönderdi; ikisi de beklentini karşılamıyor.',
                ['Briefte hedef kitle yok.', 'Mesaj “herkese uygun” diye tanımlandı.', 'Kanal ve tarih belirtilmiş.'], [
                    ['Hedef kitleyi, ana mesajı ve başarı ölçütünü netleştirip briefi yenile.', 2, 'Ajansın karar vermesini sağlayan eksik bilgiler tamamlanır.'],
                    ['Örnek bir görsel gönder; hedef kitleyi tanımlamadan yeniden tasarım iste.', 1, 'Görsel yön verilse de kime ve ne amaçla konuşulduğu belirsiz kalır.'],
                    ['Aynı briefle üçüncü bir tasarım talep et.', 0, 'Belirsiz gereksinim değişmediği için tekrar iş riski sürer.']]),
            mission('Kanal seçimi', 'Sınırlı bütçeyle yeni koleksiyonu tanıtacaksın.',
                ['Hedef kitle uygulama ve kısa video kanallarında aktif.', 'Geçmişte uygulamadan gelen ziyaretlerin dönüşümü daha yüksek.', 'Açık hava reklamı bütçenin çoğunu tüketiyor.'], [
                    ['Uygulama ve kısa videoyu birlikte kullan; kanal bazlı dönüşümü ölç.', 2, 'Kitle erişimi ve satış verisi bütçe kararını birlikte destekler.'],
                    ['Yalnızca uygulama kullan; yeni kitleye erişimi sonraya bırak.', 1, 'Dönüşüm güçlü olabilir ama yeni kullanıcıya erişim daralır.'],
                    ['Prestijli göründüğü için tüm bütçeyi açık havaya ayır.', 0, 'Kitle davranışı ve mevcut dönüşüm kanıtı bütçeye yansıtılmadı.']])
        ],
        12: [
            mission('İsrafın nedeni', 'Bir sipariş işi 4 saatte bitiyor ama toplamda 2 gün bekliyor.',
                ['İş üç farklı kişiden onay bekliyor.', 'İki onay aynı kontrolü tekrar ediyor.', 'Kalite kontrolü gerekli ve kaldırılmamalı.'], [
                    ['Tekrarlanan onayları sadeleştir; gerekli kontrolü ve sorumluyu koru.', 2, 'Bekleme azaltılırken değer sağlayan kontrol kaybolmaz.'],
                    ['Çalışanlardan işlemi daha hızlı yapmalarını iste.', 1, 'İşlem zamanı azalabilir ama 2 günlük ana bekleme nedeni yerinde kalır.'],
                    ['Tüm onay ve kalite kontrollerini kaldır.', 0, 'Hız kazanırken hata önleme işlevi de ortadan kalkar.']]),
            mission('Kaizen deneyi', 'Raf yerleşimi nedeniyle çalışanlar fazla yürüyor.',
                ['En sık alınan ürünler en uzak rafta.', 'Yer değişikliği küçük bir bölgede denenebilir.', 'Önce ve sonra yürüme mesafesi ölçülebiliyor.'], [
                    ['Sık kullanılanları yakına al; pilotta mesafe ve hata oranını karşılaştır.', 2, 'İyileştirme ölçülebilir ve küçük ölçekte doğrulanabilir.'],
                    ['Bütün rafları bir gecede yeniden düzenle.', 1, 'Yürüme azalabilir ama pilot olmadan iş kesintisi ve karışıklık riski büyür.'],
                    ['Yürüyüş hızını artırmayı performans hedefi yap.', 0, 'Yerleşimden kaynaklanan gereksiz hareket çözülmedi.']]),
            mission('Kalıcı iyileştirme', 'Pilot sonunda işlem süresi %20 azaldı.',
                ['Hata oranı değişmedi.', 'Çalışan geri bildirimi olumlu.', 'Yeni yöntem henüz yazılı değil.'], [
                    ['Yeni yöntemi standartlaştır; ekibi eğit ve sonuçları takip et.', 2, 'Pilot kazanımı kişiye bağlı olmaktan çıkar, sürdürülebilir hale gelir.'],
                    ['İyi sonucu duyur, herkesin yöntemi kendisi öğrenmesini bekle.', 1, 'Bilgi paylaşılır ama uygulama farkları ve eskiye dönüş önlenmez.'],
                    ['Hedef tamamlandı diye ölçümü bırak.', 0, 'İyileştirmenin korunup korunmadığı görülmez.']])
        ],
        13: [
            mission('Sprint önceliği', 'Ekip bugün yalnızca bir işi tamamlayabilecek.',
                ['Ödeme hatası siparişlerin %8’ini engelliyor.', 'Renk teması değişikliği görsel iyileştirme.', 'İki işin tahmini eforu benzer.'], [
                    ['Ödeme hatasını önceliklendir; doğrulama testiyle tamamla.', 2, 'İş etkisi ve kullanıcıyı engelleyen hata, kozmetik iyileştirmenin önüne geçer.'],
                    ['İki işi aynı anda başlat.', 1, 'Her iki ihtiyaç tanınır ama sınırlı kapasiteyle tamamlanma gecikebilir.'],
                    ['Daha görünür olduğu için renk temasını bitir.', 0, 'Sipariş kaybı yaratan kritik sorun devam eder.']]),
            mission('Yayına hazır mı?', 'Kod yazıldı ve geliştiricinin bilgisayarında çalışıyor.',
                ['Ödeme entegrasyonu değişti.', 'Mobil ve hata senaryoları test edilmedi.', 'Geri dönüş planı hazırlanmadı.'], [
                    ['Entegrasyon ve mobil testleri tamamla; geri dönüş planıyla kontrollü yayın yap.', 2, 'Kodun yazılması ile güvenilir yayın hazırlığı birbirinden ayrılır.'],
                    ['Önce küçük kullanıcı grubuna aç, testleri yayın sonrası tamamla.', 1, 'Etki alanı küçülür ama temel testlerin eksikliği sürer.'],
                    ['Yerelde çalıştığı için doğrudan herkese yayınla.', 0, 'Gerçek ortam, cihaz ve hata durumları doğrulanmadı.']]),
            mission('Kabul ölçütü', '“Arama daha hızlı olsun” görevi test aşamasında anlaşmazlık yaratıyor.',
                ['Geliştirici işi tamamlandı sayıyor.', 'Test ekibi hangi hızın kabul edileceğini bilmiyor.', 'Ölçüm için örnek sorgu ve trafik üretilebiliyor.'], [
                    ['Yanıt süresi, trafik ve sorgu koşulları için ölçülebilir kabul ölçütü belirle.', 2, 'Tamamlanma, kişisel beklenti yerine ortak ve doğrulanabilir bir hedefe bağlanır.'],
                    ['Test ekibinden önceki sürümle karşılaştırmasını iste.', 1, 'Karşılaştırma sağlar ama kabul sınırı ve koşullar hâlâ net değildir.'],
                    ['Geliştiricinin tamamlandı demesini yeterli say.', 0, 'İşin kullanıcı ve performans gereksinimini karşıladığı doğrulanamaz.']])
        ],
        14: [
            mission('AI çözüm seçimi', 'Çalışanlar güncel prosedürü bulmakta zorlanıyor.',
                ['Onaylı belgeler düzenli değişiyor.', 'Yanıtta kaynak ve güncellik önemli.', 'Yanlış yanıt için insan desteğine geçiş gerekli.'], [
                    ['Onaylı belgelere bağlı, kaynak gösteren ve gerektiğinde yönlendiren asistan tasarla.', 2, 'Çözüm, bilgi kaynağı ve doğrulama ihtiyacına göre kurulur.'],
                    ['Belgeleri modele bir kez öğret, sonraki güncellemeleri aylık yap.', 1, 'Bilgi desteği sağlanır ama sık değişen prosedürler için güncellik açığı oluşur.'],
                    ['Genel bir modele serbestçe yanıt verdir; kaynak gerekmez.', 0, 'Kurum prosedürü yerine doğrulanmamış genel yanıt üretilebilir.']]),
            mission('Pilot başarısı', 'AI aracı deneme ortamında %90 doğru yanıt verdi.',
                ['Testlerin çoğu kolay ve benzer sorular.', 'Gerçek kullanımda eksik ve hatalı yazılmış sorular var.', 'Yanlış yanıtın etkisi süreçten sürece değişiyor.'], [
                    ['Gerçekçi ve zor örneklerle test et; hata etkisini ölçüp kademeli yayınla.', 2, 'Tek doğruluk oranı yerine kullanım çeşitliliği ve hata maliyeti değerlendirilir.'],
                    ['Küçük ekibe aç, hataları kullanıcı bildirirse incele.', 1, 'Etki alanı sınırlı ama yayın öncesi bilinen test açığı giderilmedi.'],
                    ['%90 yeterli kabul edip tüm süreçlere uygula.', 0, 'Kolay örneklerdeki başarı, yüksek etkili süreçlerde güvenilirlik kanıtı değildir.']]),
            mission('Veri paylaşımı', 'Bir ekip müşteri listesini dış AI aracına yüklemek istiyor.',
                ['Dosyada isim, telefon ve alışveriş bilgisi var.', 'Bu senaryoda dış araca kişisel veri aktarımı onaysız yapılamıyor.', 'Görev, segmentlerin genel satış eğilimini yorumlamak.'], [
                    ['Onaylı araç kullan; kişisel alanları çıkartıp gerekli toplu veriyi hazırla.', 2, 'Görev için gerekmeyen kişisel veriler paylaşılmadan analiz yapılabilir.'],
                    ['Yalnızca isimleri kaldır, telefonlarla birlikte yükle.', 1, 'Bazı veri çıkarıldı ama telefon numaraları kişileri hâlâ tanımlar.'],
                    ['Hız kazanmak için ham listeyi yükle.', 0, 'Senaryonun onay ve veri sınırlaması şartı karşılanmadı.']])
        ],
        15: [
            mission('Segment aksiyonu', 'Bir müşteri grubunu geri kazanmak istiyorsun.',
                ['Geçmişte sık ve yüksek tutarlı alışveriş yapmışlar.', 'Son alışverişleri 8 ay önce.', 'İletişim izni olan müşteri alt grubu belirlenebiliyor.'], [
                    ['İzinli gruba uygun geri kazanım teklifi dene; dönüş ve çıkış oranını ölç.', 2, 'Geçmiş değer ve güncellik birlikte yorumlandı; iletişim izni korundu.'],
                    ['Sadakat puanını artır; iletişim göndermeden sonucu bekle.', 1, 'Teşvik var ama müşterinin yeniden dönüşünü destekleyen hedefli temas eksik.'],
                    ['Geçmiş harcamaları yüksek diye aktif sadık müşteri say.', 0, 'Uzun süreli hareketsizlik göz ardı edildi.']]),
            mission('Yeni müşteri', 'İlk alışverişini dün yapan bir müşteriye nasıl yaklaşılır?',
                ['Tek satın alma kaydı var.', 'Ürün tercihi biliniyor.', 'Sadakat davranışı henüz oluşmadı.'], [
                    ['Memnuniyet ve uygun ürün önerisiyle ikinci alışverişi destekle.', 2, 'Tek alışverişten sadakat sonucu çıkarmadan ilişki geliştirilebilir.'],
                    ['Yüksek tutar harcadığı için en üst sadakat segmentine al.', 1, 'Değer sinyali var ama sıklık kanıtı henüz yok.'],
                    ['Az kayıt olduğu için müşteriyi riskli segmentte değerlendir.', 0, 'Yeni müşteri ile kaybedilmekte olan müşteri aynı durum değildir.']]),
            mission('Kampanya etkisi', 'CRM kampanyası sonrası satış arttı. Artışın kampanyadan geldiğini nasıl anlarsın?',
                ['Aynı dönemde genel mağaza indirimi başladı.', 'Benzer müşterilerden bir kontrol grubu ayrılabiliyor.', 'İzin ve iletişim sınırları korunacak.'], [
                    ['Benzer kontrol grubuyla artış farkını ve maliyeti karşılaştır.', 2, 'Genel indirim etkisi ile kampanyanın ek etkisi ayrıştırılır.'],
                    ['Sadece mesajı açanların satışını önceki haftayla karşılaştır.', 1, 'Bir sinyal sağlar ama seçim ve genel indirim etkisi sonucu çarpıtabilir.'],
                    ['Toplam artışın tamamını CRM başarısı say.', 0, 'Aynı anda gerçekleşen mağaza indirimi etkisi göz ardı edildi.']])
        ],
        16: [
            mission('SWOT’tan aksiyona', 'Güçlü mağaza ağı ve büyüyen online talep aynı anda gündemde.',
                ['Mağazalarda uygun stok var.', 'Online talep artıyor.', 'Mağazadan teslim pilotu düşük yatırımla denenebiliyor.'], [
                    ['Mağaza gücünü online fırsatla birleştiren teslim pilotu kur.', 2, 'SWOT yalnızca sınıflama olarak kalmaz; güçlü yön bir fırsatı değerlendiren aksiyona dönüşür.'],
                    ['Online talebi izleyen bir rapor hazırla, pilotu ertele.', 1, 'Bilgi artar ama uygulanabilir stratejik deneme başlamaz.'],
                    ['İki bulguyu ayrı dosyalarda sakla, aksiyon çıkarma.', 0, 'Analiz iş kararına dönüşmedi.']]),
            mission('İş geliştirme kararı', 'Yeni hizmet için iki pilot seçeneğin var.',
                ['A: büyük yatırım, sonuç 12 ay sonra.', 'B: sınırlı yatırım, 6 haftada talep ve maliyet ölçümü.', 'Talep henüz doğrulanmadı.'], [
                    ['B ile varsayımları ölç; başarı eşiğine göre ölçekle.', 2, 'Belirsizlik küçük ve ölçülebilir bir denemeyle azaltılır.'],
                    ['A için ayrıntılı fizibilite hazırla ama sahada test yapma.', 1, 'Planlama riski azaltabilir fakat gerçek talep kanıtı oluşmaz.'],
                    ['Büyük görünmesi için doğrudan A’ya yatırım yap.', 0, 'Kanıtlanmamış talebe yüksek kaynak bağlandı.']]),
            mission('Büyüme kalitesi', 'Yeni kanalın cirosu yükseldi; devam kararı bekleniyor.',
                ['Ciro %30 arttı.', 'İade ve teslim maliyeti de yükseldi.', 'Katkı marjı henüz hesaplanmadı.'], [
                    ['Net katkıyı, maliyeti ve tekrar alışverişi ölç; sonra ölçek kararı ver.', 2, 'Büyümenin hacmi kadar ekonomik ve müşteri açısından sürdürülebilirliği değerlendirilir.'],
                    ['Ciro hedefini koru, maliyet incelemesini sonraki aya bırak.', 1, 'Hacim izlenir ama kârlılık riski kararın dışında kalır.'],
                    ['Ciro artışı nedeniyle bütçeyi hemen iki katına çıkar.', 0, 'Daha fazla satış, bu verilerle daha fazla değer yaratmayı garanti etmez.']])
        ],
        17: [
            mission('İlk açıklama', 'Bir ürünle ilgili şikâyet sosyal medyada yayılıyor.',
                ['Şikâyet henüz doğrulanmadı.', 'Müşteri destek kaydı açılmış.', 'Teknik ekip inceleme için 2 saat istiyor.'], [
                    ['Şikâyeti ciddiye al; inceleme süresini paylaş ve doğrulanan bilgiyi güncelle.', 2, 'Empati, zamanında bilgilendirme ve doğrulama birlikte sağlanır.'],
                    ['Teknik yanıt gelene kadar hiçbir bilgi verme.', 1, 'Yanlış bilgi yayınlanmaz ama müşteri belirsizlik içinde kalır.'],
                    ['İnceleme olmadan ürünün kesinlikle sorunsuz olduğunu açıkla.', 0, 'Doğrulanmamış kesin ifade güveni zedeleyebilir.']]),
            mission('Sürdürülebilirlik raporu', 'Bir iletişim metninde “atık tamamen sıfırlandı” yazıyor.',
                ['Ölçülen alan yalnızca pilot mağazalar.', 'Pilotlarda atık %20 azaldı.', 'Diğer mağazalara ait veri henüz yok.'], [
                    ['Pilot kapsamını ve %20 azalışı açıkça belirt.', 2, 'İddia, ölçülen veri ve kapsamla uyumlu hale gelir.'],
                    ['“Atık azaltıldı” yaz, kapsamı yalnızca rapor ekine koy.', 1, 'Kesin iddia yumuşar ama okuyucu ölçümün sınırlı kapsamını ana mesajdan anlayamaz.'],
                    ['Daha etkili göründüğü için “tamamen sıfırlandı” ifadesini koru.', 0, 'Mevcut ölçüm, bu iddiayı desteklemiyor.']]),
            mission('Tutarlı mesaj', 'Çalışanlara ve müşterilere farklı açıklamalar hazırlanmış.',
                ['İki metinde teslim takvimi farklı.', 'Operasyonun doğruladığı tek takvim var.', 'Paylaşım henüz yapılmadı.'], [
                    ['Tek doğrulanmış takvimle metinleri hizala; ilgili ekip onayını al.', 2, 'Kanallar arası tutarlılık, yanlış beklenti ve güven kaybını önler.'],
                    ['Önce çalışan metnini paylaş, müşteri metnini sonra düzelt.', 1, 'İç bilgi ulaşır ama iki farklı mesajın yayılma riski sürer.'],
                    ['Her hedef kitleye daha iyi görünen farklı tarih söyle.', 0, 'Beklenti yönetimi, doğrulanmış gerçeğin yerine geçmemeli.']])
        ],
        18: [
            mission('Bağımlılık planı', 'Mağaza açılış planında mobilya montajı başlayacak.',
                ['Zemin uygulaması tamamlanmadı.', 'Mobilya montajı zemin onayına bağlı.', 'Açılışa 10 gün kaldı.'], [
                    ['Önce zemin işini ve onayını tamamla; bağımlı takvimi güncelle.', 2, 'Ön koşul tamamlanmadan iş başlatmak tekrar iş ve hasar yaratabilir.'],
                    ['Mobilyayı sahaya getir; montajı zemin bitince başlat.', 1, 'Hazırlık yapılır ama saha depolaması ve koruma ihtiyacı ayrıca planlanmalı.'],
                    ['Tarihi kazanmak için montajı zeminle aynı alanda başlat.', 0, 'Bağımlılık göz ardı edilerek işlerin birbirini bozma riski yaratıldı.']]),
            mission('Açılış kapısı', 'Mağaza görsel olarak hazır; son kontrol bekleniyor.',
                ['Acil çıkış işareti eksik.', 'Bu senaryoda güvenlik onayı olmadan açılış yapılamaz.', 'Eksik bir günde giderilebiliyor.'], [
                    ['Eksikliği gider ve güvenlik onayından sonra aç.', 2, 'Görsel tamamlanma ile güvenli kullanıma hazır olma ayrı koşullardır.'],
                    ['Tarihi ertele ama eksik için sorumlu ve yeni kontrol saati belirleme.', 1, 'Riskli açılış önlenir fakat çözüm takvimi ve sorumluluk belirsizdir.'],
                    ['İşareti açılıştan sonra tak; mağazayı bugün aç.', 0, 'Senaryonun zorunlu güvenlik koşulu ihlal edildi.']]),
            mission('Kritik yol', 'İki iş gecikti; yalnızca birine ek kaynak verilebilir.',
                ['Tabela: 2 gün gecikme, 4 gün zaman payı var.', 'Elektrik testi: 2 gün gecikme, zaman payı yok.', 'Açılış elektrik testine bağlı.'], [
                    ['Ek kaynağı elektrik testine ver; tabela zaman payını izle.', 2, 'Açılışı doğrudan geciktiren kritik iş önceliklendirildi.'],
                    ['Kaynağı iki iş arasında eşit böl.', 1, 'İki iş desteklenir ama kritik gecikmeyi giderme kapasitesi azalabilir.'],
                    ['Müşterinin ilk göreceği iş olduğu için tabelayı seç.', 0, 'Görünürlük yerine bağımlılık ve zaman payı değerlendirilmeliydi.']])
        ],
        19: [
            mission('Kâr mı, nakit mi?', 'Satışlar iyi ama gelecek hafta ödeme açığı görünüyor.',
                ['Müşteri tahsilatı 45 gün sonra.', 'Tedarikçi ödemesi 7 gün sonra.', 'Dönem kârı pozitif.'], [
                    ['Nakit takvimini çıkar; finans ekibiyle ödeme ve tahsilat planını düzenle.', 2, 'Kâr ile eldeki nakit aynı değildir. Zaman uyumsuzluğu finans planıyla ele alınır.'],
                    ['Gelecek ayın bütçesini düşür; bu haftanın nakit açığını bekle.', 1, 'Gider kontrolü faydalı ama yakın ödeme ihtiyacını tek başına çözmez.'],
                    ['Kâr pozitif olduğu için ödeme riski yok say.', 0, 'Tahsilat gerçekleşmeden kârın nakit ihtiyacını karşılayacağı varsayıldı.']]),
            mission('Satın alma karşılaştırması', 'İki teklif arasında seçim yapılacak.',
                ['A: fiyat 100, teslim 6 hafta; kurulum dahil değil.', 'B: fiyat 115, teslim 2 hafta; kurulum dahil.', 'Ekipman 3 hafta içinde çalışır olmalı.'], [
                    ['Toplam maliyet ve teslim koşullarını değerlendir; B’nin şartlarını doğrula.', 2, 'Birim fiyat yerine ihtiyacı zamanında karşılayan toplam teklif değerlendirilir.'],
                    ['A ile süreyi kısaltmak için görüş; kesinleşmeden karar verme.', 1, 'Pazarlık denenebilir ama mevcut teklif kritik teslim şartını karşılamıyor.'],
                    ['En düşük fiyat olduğu için A’yı doğrudan seç.', 0, 'Zaman ve kurulum maliyeti karar dışında bırakıldı.']]),
            mission('Bütçe sapması', 'Bir gider kalemi bütçeyi %25 aştı.',
                ['Ürün hacmi %30 arttı.', 'Birim gider biraz düştü.', 'Rapor yalnızca toplam tutarı gösteriyor.'], [
                    ['Hacim ve birim maliyet etkilerini ayırıp sapmayı açıkla.', 2, 'Toplam artışın hacimden mi verimsizlikten mi geldiği görünür olur.'],
                    ['Toplam sapmayı raporla; hacim bilgisini ayrı notta bırak.', 1, 'Veri paylaşılır ama okuyucu neden-sonuç bağlantısını kendisi kurmak zorunda kalır.'],
                    ['Bütçe aşıldığı için ilgili ekibi doğrudan verimsiz say.', 0, 'Daha yüksek hacim ve düşen birim gider dikkate alınmadı.']])
        ],
        20: [
            mission('Sevkiyat birleştirme', 'Aynı bölgeye iki sevkiyat bekliyor.',
                ['A siparişi: bugün çıkmalı, 8 palet.', 'B siparişi: yarın çıkabilir, 4 palet.', 'Bugünkü araç kapasitesi 12 palet; B de yüklemeye hazır.'], [
                    ['İki sevkiyatı bugün birleştir; teslim ve yükleme koşullarını doğrula.', 2, 'Kapasite kullanımı artarken A’nın çıkış sözü korunur.'],
                    ['A’yı bugün, B’yi yarın ayrı araçla gönder.', 1, 'Teslim koşulları karşılanır ama birleştirme fırsatı kullanılmaz.'],
                    ['Aracı daha sonra doldurmak için A’yı yarına ertele.', 0, 'Maliyet amacıyla bugün çıkması gereken siparişin şartı ihlal edildi.']]),
            mission('Hasar kaydı', 'Teslim noktasında iki koli hasarlı bulundu.',
                ['Teslim belgesi henüz imzalanmadı.', 'Kolilerin içeriği kontrol edilebiliyor.', 'Hasar kaydı ve fotoğraf gerekli.'], [
                    ['Hasarı belgele, ilgili ekiplere bildir ve teslim kaydına işleyerek kontrol et.', 2, 'İzlenebilir kanıt, hasarın takibi ve çözümü için korunur.'],
                    ['Kolileri ayır; teslim belgesini not düşmeden imzala.', 1, 'Ürünler korunur ama kayıt eksikliği incelemeyi zorlaştırır.'],
                    ['Teslimi hızlı kapatmak için kayıtsız kabul et.', 0, 'Hasarın nerede ve nasıl fark edildiği belirsiz kalır.']]),
            mission('Rota değişikliği', 'Planlanan güzergâh kapandı; yeni rota seçilmeli.',
                ['A: 6 saat, kapasite uygun; teslim sözü 8 saat.', 'B: 4 saat, araç kapasitesi yetersiz.', 'C: 10 saat, maliyet daha düşük.'], [
                    ['A’yı seç; yeni varış bilgisini alıcı ve operasyonla paylaş.', 2, 'Kapasite ve teslim süresi aynı anda karşılanır; değişiklik görünür hale gelir.'],
                    ['C’yi seç ve gecikme bildirimi gönder.', 1, 'Maliyet düşer ama uygun alternatif varken teslim sözü aşılır.'],
                    ['En hızlı görünen B’yi seç.', 0, 'Kapasite kısıtı yok sayıldığı için sevkiyat eksiksiz taşınamaz.']])
        ]
    };
})();
