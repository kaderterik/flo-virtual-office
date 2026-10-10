// Interactive training boards. All quantities and targets are fictional examples.
const simulationConfigs = {
    1: {type:'hiring', name:'Aday Dosyası', instruction:'Analitik beceri ve ekip iletişimi gereken bir pozisyon için adayları görüşmeye al. Her iki yetkinliği de doğrulayıp teklif ver; sadece deneyim yılına göre karar verme.',
        candidates:[
            {name:'Deniz',experience:'1 yıl · veri analizi stajı',skills:[85,80],notes:['Veri tablosundaki stok sapmasını hesaplayıp nedeni ayırdı.','Ekip anlaşmazlığında ortak ölçüt belirledi ve sonucu paylaştı.']},
            {name:'Ece',experience:'3 yıl · mağaza raporlama',skills:[70,90],notes:['Temel hesabı doğru yaptı; ileri raporlama için desteğe ihtiyaç duyuyor.','Bir teslim sorununu ilgili ekiplerle anlaşılır bir planla çözdü.']},
            {name:'Melis',experience:'5 yıl · teknik raporlama',skills:[95,35],notes:['Karmaşık analiz görevini çok iyi tamamladı.','Ekip görüşmesini dinlemeden kendi çözümünü dayattı.']}
        ],passScore:80},
    4: {type:'allocation', name:'Dağıtım Deposu', instruction:'Depodaki 20 çifti mağazalara dağıt. Raf kapasitesini aşmadan talebi karşıla; sınırlı stokta çift başına katkısı yüksek ihtiyaçları önceliklendir. Hedef: mümkün olan katkının en az %85’i.', pool:20,passScore:85,
        stores:[{name:'Merkez',stock:2,demand:10,capacity:12,value:5},{name:'Cadde',stock:0,demand:6,capacity:8,value:4},{name:'Sahil',stock:1,demand:6,capacity:9,value:3},{name:'Meydan',stock:2,demand:5,capacity:7,value:2},{name:'Kampüs',stock:1,demand:3,capacity:6,value:1}]},
    6: {type:'audit',name:'Stok Uzlaştırma Masası',instruction:'Sayım farkını kayıtlarla açıkla. Her satır için işlem sonrası stok ve fark nedenini gir. Kayıtları doğrulamadan sistem stokunu değiştirme.',passScore:80,
        reasons:['Bekleyen satış','Bekleyen iade','Raf transferi','Fark yok'],
        rows:[{name:'Sneaker',system:30,counted:27,delta:-3,reason:0,ledger:'3 çift satışa ayrıldı; satış kaydı henüz işlenmedi.'},{name:'Bot',system:18,counted:20,delta:2,reason:1,ledger:'2 çift iade kabul edildi; giriş kaydı bekliyor.'},{name:'Loafer',system:16,counted:15,delta:-1,reason:2,ledger:'1 çift başka rafa taşındı; transfer çıkışı bekliyor.'},{name:'Sandalet',system:25,counted:25,delta:0,reason:3,ledger:'Bekleyen işlem yok; ikinci sayım da 25 çift.'}]},
    8: {type:'fulfillment',name:'Sipariş Kontrol Merkezi',instruction:'Bugünün beş siparişini tamamla. Mağaza stoğu ve paketleme kapasitesi her gönderimde azalır. Acil siparişler için hızlı noktaların kapasitesini koru. İstediğin siparişten başlayabilirsin.',passScore:80,
        nodes:[{name:'Mağaza A',stock:3,capacity:3,hours:2},{name:'Mağaza B',stock:4,capacity:4,hours:4},{name:'Merkez Depo',stock:8,capacity:8,hours:6}],
        orders:[{name:'Okul alışverişi',qty:2,promise:4},{name:'Acil sneaker',qty:1,promise:3},{name:'Takım siparişi',qty:3,promise:8},{name:'Bugün teslim',qty:2,promise:3},{name:'Aile alışverişi',qty:2,promise:6}]},
    9: {type:'vitrine',name:'Vitrin Tasarım Stüdyosu',instruction:'Üç vitrin alanını doldur. Stokta bulunan, ilgi gören ve iadesi düşük ürünleri seç. Soldaki alan daha çok görünür; sıralaman dönüşüm tahminini değiştirir. Tahmini en iyi vitrinin en az %85’ine ulaştır.',passScore:85,
        products:[{name:'Trend Sneaker',stock:40,interest:90,returns:5,color:'#82cdd4'},{name:'Koşu Pro',stock:25,interest:85,returns:8,color:'#ffac78'},{name:'Günlük Model',stock:60,interest:60,returns:12,color:'#b9a4e1'},{name:'Sezon Botu',stock:15,interest:35,returns:25,color:'#88b495'},{name:'Tükenen Favori',stock:0,interest:98,returns:2,color:'#f3cc65'},{name:'Klasik Loafer',stock:30,interest:75,returns:6,color:'#d493a0'}],weights:[1,.8,.6]},
    12: {type:'kaizen',name:'İyileştirme Atölyesi',instruction:'Beş çalışma noktasını incele. Her biri için israf türünü ve uygulanabilir iyileştirmeyi seç. Sadece nesneye tıklamak puan kazandırmaz.',passScore:80,
        categories:['Bekleme','Fazla stok','Gereksiz taşıma','Hatalı iş','Kullanılmayan yetenek'],
        stations:[
            {name:'Onay masası',prop:'clock',observation:'İşlem 15 dakika, üç imza arasında bekleme 2 gün. İki imza aynı kontrolü tekrar ediyor.',category:0,answer:1,actions:['Çalışanı daha hızlı çalıştır','Tekrarlanan onayı kaldır; gerekli kalite kontrolünü koru','Tüm kalite kontrollerini kaldır'],lesson:'Tekrarlanan onay sadeleşir; değer sağlayan kontrol korunur.'},
            {name:'Kutu rafı',prop:'box',observation:'Haftalık talep 10, depoda 200 çift var. Yeni üretim emri hâlâ haftalık 50 çift.',category:1,answer:2,actions:['Daha büyük depo kirala','Üretimi haftalık 70 çifte çıkar','Üretim planını talep ve mevcut stokla güncelle'],lesson:'Alan büyütmek yerine talebi aşan üretim ve stok birikimi çözülür.'},
            {name:'Toplama rotası',prop:'truck',observation:'En sık alınan ürünler kapıdan en uzak rafta; aynı sipariş için koridor üç kez geçiliyor.',category:2,answer:0,actions:['Sık kullanılanları yakına taşı; yeni rotayı pilotta ölç','Yürüyüş hızını performans hedefi yap','Tüm rafları etiketlemeden yer değiştir'],lesson:'Yerleşim ve rota iyileştirmesi, gereksiz mesafeyi kaynağında azaltır.'},
            {name:'Etiket istasyonu',prop:'shoe',observation:'Her 20 koliden 4’ü yanlış etiketten dolayı tekrar açılıyor. İki benzer etiket şablonu yan yana.',category:3,answer:1,actions:['Son kontrolde daha fazla kişi çalıştır','Şablonları ayrıştır ve etiket basarken doğrulama kur','Hatalı kolileri kayıt tutmadan yeniden etiketle'],lesson:'Kaynağında hata önleme, sürekli yeniden işlemeden daha kalıcıdır.'},
            {name:'Fikir panosu',prop:'bulb',observation:'Çalışanların 12 önerisi üç aydır değerlendirilmemiş; geri dönüş yapılmıyor.',category:4,answer:2,actions:['Öneri kutusunu kaldır','Sadece yönetici önerilerini kabul et','Sorumlu ve değerlendirme takvimi belirleyip geri bildirim ver'],lesson:'Fikirleri görünür bir değerlendirme döngüsüne almak ekip bilgisini işe taşır.'}
        ]},
    13: {type:'sprint',name:'Canlı Sprint',instruction:'Beş işi geliştir, test et ve yayınla. “Bir Gün İlerle” süreleri azaltır. 7 güne kadar tam puan; 8–9 günde daha düşük puan. 10. gün süre dolar.',passScore:80,deadline:10,
        tasks:[{name:'Giriş altyapısı',dev:2,test:1,deps:[]},{name:'Sepet düzeltmesi',dev:1,test:1,deps:[]},{name:'Favoriler',dev:1,test:1,deps:[0]},{name:'Sipariş bildirimi',dev:1,test:1,deps:[1]},{name:'Arama iyileştirmesi',dev:1,test:1,deps:[]}]},
    18: {type:'project',name:'Şantiye Planlayıcı',instruction:'İki ekibi kullanarak mağazayı 9. günün sonuna kadar aç. İşlerin ön koşullarına uy; aynı anda iki iş yürüyebilir. “Bir gün ilerle” takvimi ilerletir. Açılış, güvenlik kontrolünden önce başlayamaz.',passScore:80,deadline:9,crews:2,
        tasks:[{name:'Konsept onayı',days:2,deps:[]},{name:'Zemin uygulaması',days:3,deps:[0]},{name:'Elektrik işleri',days:2,deps:[0]},{name:'Mobilya montajı',days:2,deps:[1]},{name:'Güvenlik kontrolü',days:1,deps:[2,3]},{name:'Mağaza açılışı',days:1,deps:[4]}]},
    20: {type:'dispatch',name:'Yükleme Sahası',instruction:'Kolileri uygun güzergâhtaki araca yükle; kapasiteyi aşma. Yükler hazır olduğunda aracı gönder. Beş sevkiyatı 3 seferde tamamlamak tam puan, 4 seferde tamamlamak %80 verir. En fazla 5 sefer var.',passScore:80,
        vehicles:[{name:'Kartur',route:'Gebze → İstanbul/Kocaeli',capacity:6,region:'istanbul'},{name:'Fillo Lojistik',route:'Gebze → Diğer iller',capacity:6,region:'diger'},{name:'Ceva Lojistik',route:'Ankara → Türkiye',capacity:4,region:'ankara'}],
        cargos:[{name:'Kadıköy mağazası',origin:'Gebze',region:'istanbul',pallets:3},{name:'İzmit mağazası',origin:'Gebze',region:'istanbul',pallets:2},{name:'Antalya mağazası',origin:'Gebze',region:'diger',pallets:4},{name:'Bursa mağazası',origin:'Gebze',region:'diger',pallets:2},{name:'Trabzon mağazası',origin:'Ankara',region:'ankara',pallets:3}]}
};
for (const [id, simulation] of Object.entries(simulationConfigs)) {
    const original = departmentGames[id];
    departmentGames[id] = {...simulation, badge:original.badge};
    departmentsData[id].gameComponent = 'simulation';
    departmentsData[id].taskSummary = simulation.instruction;
    departmentsData[id].gameTitle = simulation.name;
}
