// Educational scenarios. Numeric targets are game examples, not company metrics.
const departmentGames = {
    1: {
        type: 'order', name: 'İşe Alım Yolculuğu', badge: 'İşe Alım Uzmanı',
        instruction: 'Beş görüşme adımını ilk adımdan iş teklifine kadar sırala.',
        items: ['Telefon Mülakatı', 'İK Görüşmesi', 'Departman Yöneticisi Mülakatı', 'Referans Kontrolü', 'İş Teklifi'],
        success: '✅ İşe Alım Sürecini Tamamladın!'
    },
    2: {
        type: 'match', name: 'Üründen Aksiyona', badge: 'Veri Odaklı Karar Ustası',
        instruction: 'Ürünün adından çok, yanındaki veriye bak. Beş ürünü doğru aksiyona ulaştır. İkinci yanlışta tur biter; tekrar deneyebilirsin.', unique: true,
        live: true, mistakes: 2, success: 'Ürün Yöneticisi gibi düşündün! 🎉',
        bins: ['Ek Sipariş Ver', 'Fiyat İndir/Kampanya Yap', 'Tüm Kanallara Dağıt', 'Stok Transferi Yap', 'İzlemeye Devam Et'],
        items: [
            ['Yeni Sezon Koşu Ayakkabısı', 2, 'Lansman hazır; tüm kanalları besleyecek yeterli stok var.'],
            ['İade Oranı Yüksek Model', 4, 'İade nedeni araştırılıyor; sonuç çıkmadan yeni ticari aksiyon alma.'],
            ['Trend Sneaker', 0, 'Talep güçlü, mevcut stok bir haftada tükenecek; tedarik mümkün.'],
            ['Yavaş Satan Model', 1, 'Sezon sonu; tüm mağazalarda fazla stok var.'],
            ['Sınırlı Stoklu Ürün', 3, 'Bir mağazada talep var, diğerinde elde kalan stok var.']
        ]
    },
    3: {
        type: 'sortTimed', name: 'Kategori Masası', badge: 'Kategori Analisti', seconds: 30,
        instruction: '30 saniyede beş kartı ilgili kutuya taşı. En az 4 doğruyla rozet kazan.',
        bins: ['Trend & Rakip Analizi', 'Satış & Stok Performansı', 'Ticari Planlama'],
        items: [['Küresel sneaker trendi', 0], ['Düşük performanslı model', 1], ['Rakip fiyat hareketi', 0], ['Yeni sezon bütçesi', 2], ['Çapraz ekip toplantı talebi', 2]]
    },
    4: {
        type: 'budget', name: '100 Birimlik Plan', badge: 'Planlamacı',
        instruction: '100 birimin tamamını dağıt. Hedef pay = mağazanın m² × satış hızı ağırlığı / toplam ağırlık. Hazırlığı geçmek için hedefe en az %75 yakınlık gerekiyor; %90 ve üzeri Altın. Ardından karar masasına geç.',
        stores: [
            {name: 'Merkez', area: 300, speed: 5, ideal: 30},
            {name: 'Cadde', area: 250, speed: 5, ideal: 25},
            {name: 'Sahil', area: 250, speed: 4, ideal: 20},
            {name: 'Meydan', area: 250, speed: 3, ideal: 15},
            {name: 'Kampüs', area: 250, speed: 2, ideal: 10}
        ]
    },
    5: {
        type: 'flow', name: 'Üretim Hattını Kur', badge: 'Süreç Mimarı',
        instruction: 'Numaralı slotları doğru sıraya getir. Bu örnek akışta tasarım ve kalite kontrolünü üretim, Floxo süreç onayı ve sevkiyat kaydı izler.',
        items: ['Centric PLM Tasarım Onayı', 'Numune & Kalite Kontrolü', 'Üretim & Depo', 'Floxo Süreç Onayı', 'SAP ERP Sevkiyat Kaydı']
    },
    6: {
        type: 'stock', name: 'Envanter Dedektifi', badge: 'Envanter Dedektifi', seconds: 20,
        instruction: 'Sistem ve sayım sütunlarını karşılaştır. 20 saniyede üç farkı bul; üç yanlış seçimde tur biter.',
        rows: [['Sneaker', 42, 42], ['Koşu Ayakkabısı', 30, 27], ['Bot', 18, 18], ['Sandalet', 25, 25], ['Loafer', 16, 19], ['Spor Çanta', 12, 12], ['Terlik', 50, 46], ['Çorap', 64, 64]]
    },
    7: {
        type: 'materials', name: 'Geleceğin Malzemesi', badge: 'İnovasyon Öncüsü',
        instruction: 'Her kartın senaryo bilgisine göre karar ver. En az 5 doğruyla rozet kazan.',
        items: [
            ['Zeytin çekirdeği tabanı', true, 'Atık çekirdek kullanımı ve dayanıklılık testi bu örnekte doğrulanmış.'],
            ['Geri dönüştürülmüş plastik', true, 'Geri dönüştürülmüş içerik ve kalite belgesi mevcut.'],
            ['Tek kullanımlık sentetik köpük', false, 'Bu üründe yeniden kullanım veya geri kazanım yolu yok.'],
            ['Ergonomik kumaş', true, 'Bu örnekte hem ergonomi hem uzun ömür ve sorumlu tedarik testleri başarılı.'],
            ['Yüksek karbonlu üretim yöntemi', false, 'Aynı kaliteyi sağlayan daha düşük emisyonlu seçenek mevcut.'],
            ['3D baskı prototip malzemesi', true, 'Bu örnekte tekrar kullanılabilir; numune atığını azaltıyor.']
        ]
    },
    8: {
        type: 'routing', name: 'Siparişin En Kısa Yolu', badge: 'QR Hız Ustası',
        instruction: 'Stoku olan noktalar arasından müşteriye en kısa sürede ulaşanı seç. Beş siparişin en az dördünü doğru yönlendir.',
        nodes: ['Mağaza A', 'Mağaza B', 'Depo A', 'Depo B'],
        rounds: [
            {product: '38 numara sneaker', stocks: [0, 2, 12, 0], hours: [1, 2, 8, 5], answer: 1},
            {product: '42 numara koşu ayakkabısı', stocks: [0, 0, 7, 5], hours: [2, 4, 8, 3], answer: 3},
            {product: '37 numara bot', stocks: [3, 0, 9, 2], hours: [2, 1, 6, 5], answer: 0},
            {product: '40 numara loafer', stocks: [0, 0, 4, 0], hours: [1, 2, 5, 3], answer: 2},
            {product: '39 numara sandalet', stocks: [0, 1, 6, 8], hours: [1, 6, 4, 2], answer: 3}
        ]
    },
    9: {
        type: 'ranking', name: 'Akıllı Vitrin', badge: 'Dijital Vitrin Uzmanı',
        instruction: 'En yüksek öncelikten en düşüğe sırala. Oyunun AI Sorting örneği: stok 0 ise puan 0; diğer ürünlerde 2 × satış hızı + müşteri ilgisi. Bu, gerçek bir AI modelinin çıktısı değildir.',
        items: ['Trend Sneaker', 'Koşu Pro', 'Günlük Sneaker', 'Klasik Loafer', 'Sezon Botu', 'Tükenen Model'],
        hints: ['Stok: 40 • Satış hızı: 9 • İlgi: 10', 'Stok: 32 • Satış hızı: 8 • İlgi: 8', 'Stok: 55 • Satış hızı: 6 • İlgi: 7', 'Stok: 20 • Satış hızı: 4 • İlgi: 6', 'Stok: 15 • Satış hızı: 2 • İlgi: 4', 'Stok: 0 • Satış hızı: 10 • İlgi: 10']
    },
    10: {
        type: 'markets', name: 'Dört Pazar, Dört Karar', badge: 'Global Operasyon Direktörü',
        instruction: 'Haritadan ülke seç, örnek pazar profiline uygun modeli belirle. Profiller eğitim amaçlıdır; ülkelerin gerçek pazar değerlendirmesi değildir.',
        options: ['Doğrudan Mağazacılık', 'Master Franchise', 'Toptan Satış', 'Corner'],
        countries: [
            {name: 'İspanya', x: 46, y: 31, answer: 0, profile: 'Uzun vadeli yatırım bütçesi hazır. Mağaza deneyimi ve operasyonun tamamını kendimiz yönetmek istiyoruz.'},
            {name: 'Fas', x: 45, y: 43, answer: 1, profile: 'Ülke çapında ağ kurabilecek güçlü bir yerel ortak var. Bölgesel işletme hakkını bu ortağa vermek istiyoruz.'},
            {name: 'Kazakistan', x: 67, y: 29, answer: 2, profile: 'Sınırlı yatırım isteniyor. Yerel çok markalı perakendecilere ürün satacağız; kendi satış alanımızı açmayacağız.'},
            {name: 'Hindistan', x: 70, y: 46, answer: 3, profile: 'Mevcut bir büyük mağazanın içinde küçük, markamıza ayrılmış bir satış alanıyla başlayacağız.'}
        ]
    },
    11: {
        type: 'match', name: 'Kampanya Brief Atölyesi', badge: 'Brief Tasarımcısı', unique: true, distractors: true,
        instruction: 'Gençlere yönelik yeni sneaker lansmanı için beş alanı doldur. İki çeldirici etiket artacak.',
        bins: ['Kim', 'Ne', 'Ne Zaman', 'Nerede', 'Nasıl'],
        items: [['18–25 yaş sneaker meraklıları', 0], ['Yeni sneaker koleksiyonu lansmanı', 1], ['15–30 Eylül', 2], ['Instagram ve FLO uygulaması', 3], ['Kısa video ve içerik üreticisi iş birliği', 4], ['Depo raflarının sayımı', -1], ['Personel vardiya çizelgesi', -1]],
        summary: 'Brief: 18–25 yaş sneaker meraklılarına yeni koleksiyonu, 15–30 Eylül’de Instagram ve FLO uygulamasında kısa video ve içerik üreticisi iş birliğiyle tanıt.'
    },
    12: {
        type: 'hidden', name: 'İsraf Avcısı', badge: 'Kaizen Gözlemcisi',
        instruction: 'Ofis/depo sahnesindeki beş sorunlu noktayı bul. Beş nokta toplam yedi israf türünü temsil ediyor.',
        spots: [
            {x: 15, y: 29, icon: '🕒', label: 'Onay bekleyen masa', detail: 'Bekleme: imza kuyruğundaki işler akışı durduruyor. Onay akışını sadeleştir.'},
            {x: 72, y: 25, icon: '📦', label: 'Tavana kadar kutu', detail: 'Fazla üretim + fazla stok: talebi aşan üretim depoyu dolduruyor. Talebe göre üretim planla.'},
            {x: 28, y: 70, icon: '🛒', label: 'Dolambaçlı taşıma yolu', detail: 'Gereksiz hareket + gereksiz taşıma: uzak raflar ve dolambaçlı rota hem çalışanı hem ürünü fazladan dolaştırıyor.'},
            {x: 80, y: 72, icon: '👟', label: 'Hatalı ürün masası', detail: 'Hatalı iş: yanlış etiketli ürünler yeniden işleniyor. Kaynağında kalite kontrolü kur.'},
            {x: 49, y: 47, icon: '💡', label: 'Okunmayan öneri kutusu', detail: 'Kullanılmayan yetenek: çalışanların iyileştirme fikirleri değerlendirilmiyor. Düzenli öneri döngüsü aç.'}
        ]
    },
    13: {
        type: 'kanban', name: 'Sprint Board', badge: 'Sprint Kaptanı',
        instruction: 'Altı iş kartının durumunu oku. Her kartı doğrudan Geliştirme, Test veya Canlıya Alma kutusuna yerleştir. Kartları bütün aşamalardan geçirmen gerekmiyor.',
        bins: ['Bekleyen Kartlar', 'Geliştirme', 'Test', 'Canlıya Alma'],
        tasks: [
            {title: 'Favorilere ekleme özelliği', status: 'Tasarım hazır, özelliğin kodu henüz yazılmadı.', answer: 1},
            {title: 'Sepet tutarı hatası', status: 'Hatanın nedeni bulundu; kodda düzeltme yapılması gerekiyor.', answer: 1},
            {title: 'Mobil giriş ekranı', status: 'Kodlama tamamlandı; farklı cihazlarda doğru çalıştığı doğrulanmalı.', answer: 2},
            {title: 'Arama performansı', status: 'İyileştirme kodlandı; yoğun trafik altında hız testi bekliyor.', answer: 2},
            {title: 'Sipariş bildirimleri', status: 'Testler ve kullanıcı kabulü tamamlandı; sürüm yayına çıkmaya hazır.', answer: 3},
            {title: 'Ödeme ekranı güncellemesi', status: 'Tüm kontroller geçti, yayın onayı alındı; canlı ortama aktarılmalı.', answer: 3}
        ]
    },
    14: {
        type: 'match', name: 'Doğru İşe Doğru AI', badge: 'AI Çözüm Mimarı', unique: true,
        instruction: 'Beş iş senaryosunu uygun teknolojiye taşı.',
        bins: ['Rota Optimizasyonu', 'Floscope Görüntü İşleme', 'Görsel Arama Motoru', 'Üretken Yapay Zekâ (GenAI)', 'AI Agent Chatbot'],
        items: [['Sipariş hangi depodan gönderilsin?', 0], ['Mağazada kuyruk çok mu uzun?', 1], ['Müşteri aradığı ayakkabıyı bulamıyor', 2, 'Elinde benzer ayakkabının fotoğrafı var.'], ['Yeni ürün fotoğrafı lazım', 3], ['Çalışan bir prosedürü sordu', 4]],
        summary: 'Optimizasyon kısıtlar altında rota seçer; görüntü işleme sahneyi analiz eder; görsel arama benzer ürünleri bulur; GenAI içerik üretir; chatbot ilgili prosedürü bulup yanıtlar.'
    },
    15: {
        type: 'match', name: 'Müşterini Tanı', badge: 'RFM Analisti',
        instruction: 'Güncellik, sıklık ve harcamayı birlikte değerlendir. Kartları üç segmente ayır.',
        bins: ['Sadık Müşteri', 'Potansiyel Müşteri', 'Riskli/Kaybedilen Müşteri'],
        items: [['Son bir haftada 3 kez alışveriş yaptı', 0], ['6 aydır hiç gelmedi', 2], ['Yüksek harcama, sık alışveriş; son alışveriş dün', 0], ['İlk alışverişini dün yaptı', 1], ['Eskiden her ay alırdı; 8 aydır alışveriş yok', 2], ['Yeni üye, bu ay ilk ürününü aldı', 1]],
        summary: 'Sadık: sadakat avantajı sun. Potansiyel: izinli kanalda kişiselleştirilmiş ürün öner. Riskli: geri kazanım teklifini uygun sıklıkta ilet.'
    },
    16: {
        type: 'match', name: 'SWOT Panosu', badge: 'Strateji Analisti',
        instruction: 'İç faktörleri güçlü/zayıf, dış faktörleri fırsat/tehdit olarak ayır. İfadeler örnek SWOT senaryosuna aittir.',
        bins: ['Güçlü Yönler', 'Zayıf Yönler', 'Fırsatlar', 'Tehditler'],
        items: [['Güçlü marka bilinirliği', 0], ['Sınırlı yurt dışı ayak izi', 1], ['E-ticaretin büyümesi', 2], ['Artan rekabet', 3], ['Geniş mağaza ağı', 0], ['Eski sistemler arasında veri kopukluğu', 1], ['Yeni pazarlarda artan online talep', 2], ['Dış kaynaklı tedarik maliyeti artışı', 3]]
    },
    17: {
        type: 'crisis', name: 'İtibar Masası', badge: 'İtibar Koruyucusu',
        instruction: 'Kurgusal kriz: bir haberde tedarik zinciriyle ilgili yanlış bir iddia var. Her karar sonraki durumu değiştirir. En az 75 itibar puanıyla rozet kazan.',
        nodes: {
            start: {text: 'İddia hızla yayılıyor. İlk adımın ne?', choices: [
                ['Önce gerçekleri ve kayıtları doğrula', 'verified', 25, 'Doğrulama, hatalı veya dayanaksız açıklama riskini azaltır.'],
                ['Hemen sert bir yalanlama yayınla', 'repair', 0, 'Kanıtsız tepki güveni zedeler; şimdi açıklamayı düzeltmen gerekiyor.'],
                ['Sessiz kal ve bekle', 'silence', 5, 'Bilgi boşluğu büyüdü; paydaşlara zamanında bilgi vermek gerekiyor.']
            ]},
            verified: {text: 'Kayıtlar iddianın yanlış olduğunu gösteriyor. Açıklamayı nasıl hazırlarsın?', choices: [
                ['İlgili ekiplerle kanıtlı, anlaşılır açıklama hazırla', 'publish', 25, 'Ortak kontrol ve somut kanıt, tutarlı iletişim sağlar.'],
                ['Haber kaynağını suçlayan bir metin yaz', 'tension', 0, 'Suçlayıcı dil konuyu büyütür.']
            ]},
            repair: {text: 'İlk açıklaman kanıtsız bulundu. Nasıl toparlarsın?', choices: [
                ['Kayıtları doğrula ve önceki açıklamayı şeffafça düzelt', 'publish', 20, 'Şeffaf düzeltme güveni yeniden kurmaya yardımcı olur.'],
                ['Eski paylaşımı sil, açıklama yapma', 'tension', 0, 'Açıklamasız silme şüpheyi artırır.']
            ]},
            silence: {text: 'Çalışanlar ve müşteriler bilgi bekliyor.', choices: [
                ['İnceleme takvimini paylaş, gerçekleri doğrula', 'publish', 20, 'Takvimli bilgilendirme belirsizliği azaltır.'],
                ['Soruları yanıtlamamaya devam et', 'tension', 0, 'Yanıtsız sorular söylentilerin sürmesine yol açar.']
            ]},
            publish: {text: 'Doğrulanan bilgiyi kimlerle paylaşırsın?', choices: [
                ['Çalışanları bilgilendir; aynı kanıtlı mesajı ilgili dış kanallarda paylaş', 'follow', 25, 'İç ve dış iletişimin tutarlılığı güven sağlar.'],
                ['Yalnızca kişisel hesabından paylaş', 'follow', 5, 'Resmî ve tutarlı kanalların eksikliği erişimi sınırlar.']
            ]},
            tension: {text: 'Tartışma sertleşti. Sonraki adım?', choices: [
                ['Dili sakinleştir, kanıtları doğrula ve resmî bilgi ver', 'follow', 15, 'Kanıta dönmek gerilimi düşürmeye yardımcı olur.'],
                ['Tartışmayı sürdür', 'follow', 0, 'Tartışma, asıl bilgiyi görünmez kılar.']
            ]},
            follow: {text: 'Açıklama sonrası ne yaparsın?', choices: [
                ['Soruları izle, güncelleme paylaş ve öğrenilenleri kaydet', null, 25, 'Takip ve iyileştirme iletişimin devamlılığını sağlar.'],
                ['Konuyu tamamen kapat', null, 0, 'Takipsizlik yeni bilgi ihtiyacını karşılamaz.']
            ]}
        }
    },
    18: {
        type: 'timeline', name: 'Açılışa Geri Sayım', badge: 'Şantiye Planlamacısı',
        instruction: 'Aşamaları sırala ve günleri tahmin et (±5 gün kabul edilir). Örnek plan: konsept 25 gün; uygulama 55 gün (zemin 20, mobilya 25, denetim 9, açılış 1).',
        items: ['3D Konsept Onayı', 'Zemin & Aydınlatma', 'Mobilya Montajı', 'İş Güvenliği Denetimi', 'Açılış'], days: [25, 20, 25, 9, 1]
    },
    20: {
        type: 'routing', layout: 'dispatch', name: 'Sevkiyat Yönlendirme', badge: 'Lojistik Yönlendirme Uzmanı',
        instruction: 'Sevkiyat kartını doğru sağlayıcıya sürükle veya tablodaki seçeneğe dokun. Beş senaryodan en az dördünü doğru yönlendir.',
        nodes: ['Fillo Lojistik', 'Kartur', 'Ceva Lojistik', 'Hepsijet', 'Şanlıurfa Fabrika Lojistik Merkezi'],
        routes: ['Gebze depolarından İstanbul/Kocaeli dışındaki tüm mağazalara', 'Gebze depolarından İstanbul/Kocaeli mağazalarına', 'Ankara depolarından Türkiye geneline', 'Mağazalar arası transfer (İstanbul hariç)', 'Proje hedefi: Şanlıurfa fabrikasından İstanbul’a uğramadan mağazalara ve Ortadoğu’ya direkt sevkiyat'],
        rounds: [
            {product: 'Gebze deposundan Kadıköy (İstanbul) mağazasına ürün gönderilecek', answer: 1},
            {product: 'Gebze deposundan Antalya mağazasına ürün gönderilecek', answer: 0},
            {product: 'Ankara deposundan Trabzon mağazasına sevkiyat', answer: 2},
            {product: 'Bursa mağazasında fazla stok var, Kayseri mağazasına transfer gerekiyor', answer: 3},
            {product: 'Şanlıurfa fabrikasından Ortadoğu’ya direkt sevkiyat (İstanbul’a uğramadan)', answer: 4}
        ]
    },
    19: {
        type: 'match', name: 'CFO Ekibini Yönet', badge: 'CFO Ekibi Yöneticisi', unique: true,
        instruction: 'Beş görevi doğru birime taşı. Her birime bir görev yerleştir.',
        bins: ['Bütçe ve Raporlama', 'Finans', 'Muhasebe', 'Satın Alma', 'Hukuk'],
        items: [['Yıllık bütçeyi takip et', 0], ['Finansal işlemi kaydet', 2], ['Şirketin nakit süreçlerini yönet', 1], ['Bir satın alma sürecini değerlendir', 3], ['Sözleşmenin hukuki uygunluğunu incele', 4, 'Sözleşme maddelerini, tarafların yükümlülüklerini ve hukuki riskleri değerlendir.']]
    }
};
