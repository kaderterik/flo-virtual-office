// Departman verileri (20 Kapı için hazırlanmış altyapı)
const departmentsData = {
    1: {
        id: 1,
        code: 'ik',
        family: 'insan',
        gameComponent: 'ordering',
        taskSummary: 'İşe alım yolculuğundaki beş adımı doğru sıraya yerleştir.',
        title: 'İnsan Kaynakları (İK)',
        isAvailable: true,
        image: 'assets/rooms/oda1.webp',
        characterTitle: '👩‍💼 İK Uzmanı',
        dialogues: [
            {
                title: "Tanışma 👋",
                text: "Merhaba, ben FLO'nun İnsan Kaynakları ekibindenim! 👋 Belki düşünüyorsundur — İK sadece işe alım yapan bir yer, değil mi?"
            },
            {
                title: "İK Neler Yapar? 🏢",
                text: "Aslında hiç öyle değil! Biz bir çalışanın FLO'ya katıldığı ilk günden, kariyerindeki her adıma kadar yanındayız."
            },
            {
                title: "Geniş Çalışma Alanı 🚀",
                text: "Bordro ve özlükten eğitime, çalışma ortamının güvenliğinden kariyer gelişimine kadar çok geniş bir alanda çalışıyoruz."
            },
            {
                title: "İşe Alım Yolculuğu 📋",
                text: "Mesela işe alım 5 adımlı bir yolculuktur: Telefon mülakatı, İK görüşmesi, Departman yöneticisi mülakatı, Referans kontrolü ve İş teklifi!"
            },
            {
                title: "Genç Yetenekler 🌟",
                text: "Şu an FLO Online Staj Programı'ndasın (20 gün, 20 departman). 4. sınıfta ise 7 ay yarı zamanlı çalıştıran 'Geleceğe İz' programımız var!"
            },
            {
                title: "Görev Zamanı 🎮",
                text: "Şimdi benimle bir İK uzmanı gibi çalışıp öğrendiklerini test etmeye ne dersin?",
                isLast: true,
                btnText: "🎮 İK Oyunu / Görevine Başla →"
            }
        ],
        gameTitle: "İnsan Kaynakları Simülasyonu",
        gameDesc: "İnsan Kaynakları ekibimize hoş geldin! Yakında ilk aday mülakatını ve İK yönetim simülasyonunu burada oynayacaksın.",
        hotspots: [
            {
                id: 'bordro',
                icon: '📁',
                title: 'Özlük ve Bordro İşlemleri',
                desc: 'Çalışanların FLO\'ya giriş anından itibaren özlük dosyaları, izin takipleri, maaş bordroları ve yasal süreçleri İK ekibi tarafından yönetilir.',
                left: '21.5%', top: '31.5%'
            },
            {
                id: 'egitim',
                icon: '📚',
                title: 'Eğitim ve Gelişim',
                desc: 'FLO Akademi çatısı altında çalışanların yetkinliklerini artıracak online ve yüz yüze mesleki gelişim eğitimleri burada planlanır.',
                left: '24.5%', top: '43.5%'
            },
            {
                id: 'deneyim',
                icon: '🖼️',
                title: 'Çalışan Deneyimi & Memnuniyeti',
                desc: 'Çalışan bağlılığı anketleri, kurum içi etkinlikler, tebrikler ve FLO ailesindeki her mutlu an İK tarafından kurgulanır.',
                left: '66%', top: '38%'
            },
            {
                id: 'isg',
                icon: '🪴',
                title: 'İş Sağlığı ve Güvenliği (İSG)',
                desc: 'Tüm FLO ofis, depo ve mağazalarında ergonomik, güvenli ve sağlıklı çalışma standartlarının sürdürülmesi İK güvencesindedir.',
                left: '76.5%', top: '52%'
            },
            {
                id: 'analitik',
                icon: '💻',
                title: 'İK Analitiği & Dijital İK',
                desc: 'İşe alım performans ölçümleme, yetenek yönetimi ve dijital İK sistemleri raporlamaları bu bilgisayarlar ve yazılımlar üzerinden izlenir.',
                left: '42%', top: '58.5%'
            }
        ]
    },
    2: {
        id: 2,
        code: 'urun',
        family: 'ticari',
        gameComponent: 'matching',
        taskSummary: 'Ürün verilerini okuyup her ürün için doğru ticari aksiyonu seç.',
        title: 'Ürün Yönetimi',
        isAvailable: true,
        image: 'assets/rooms/oda2.webp',
        characterTitle: '👟 Ürün Yöneticisi',
        dialogues: [
            {
                title: "Tanışma 👋",
                text: "Merhaba! Ürün Yönetimi departmanına hoş geldin! 👋 Hiç düşündün mü, FLO’da hangi ürünün müşterilerle buluşacağına ve bu ürünlerin nasıl yönetileceğine nasıl karar veriliyor?"
            },
            {
                title: "Ürünün Yolculuğu 👟",
                text: "Bizim için süreç müşterinin ihtiyaçlarını anlamakla başlıyor. Ardından ürünleri planlıyor, tedarik sürecini takip ediyor ve mağazalar ile dijital satış kanallarına ulaştırıyoruz."
            },
            {
                title: "Verilerle Karar Veriyoruz 📊",
                text: "Ürün seçimlerini sadece kişisel görüşlerimize göre yapmıyoruz! Geçmiş satışlar, stok miktarları, müşteri davranışları, satış hızları ve iade oranları gibi birçok veriyi analiz ediyoruz."
            },
            {
                title: "Tüm Kanallar Birlikte 🌐",
                text: "FLO mağazaları, internet sitesi ve mobil uygulama gibi farklı satış kanallarının birbiriyle uyumlu çalışması bizim için çok önemli. Böylece müşterilere her kanalda daha iyi bir deneyim sunmayı hedefliyoruz."
            },
            {
                title: "Ürün Satışa Çıktı, Peki Sonra? 📈",
                text: "İşimiz ürün satışa çıktığında bitmiyor! Performansı sürekli takip ediyoruz. Başarılı ürünlerde ek sipariş verirken düşük performans gösteren ürünlerde fiyat düzenlemesi, kampanya veya stok transferi gibi aksiyonlar alabiliyoruz."
            },
            {
                title: "Sıra Sende! 🎮",
                text: "Gördüğün gibi Ürün Yönetimi; müşteri ihtiyaçlarını, veriyi, stokları ve satış performansını birlikte değerlendiriyor. Şimdi sen de bir ürün yöneticisi gibi düşünüp öğrendiklerini uygulamaya ne dersin?",
                isLast: true,
                btnText: "🎮 Ürün Yönetimi Görevine Başla →"
            }
        ],
        gameTitle: "Ürün Yönetimi Simülasyonu",
        gameDesc: "Ürün Yönetimi ekibimize hoş geldin! Yakında doğru stok, fiyatlandırma ve kanal yönetimi simülasyonunu burada oynayacaksın.",
        hotspots: [
            {
                id: 'stok_analiz',
                icon: '📊',
                title: 'Satış & Stok Analitiği',
                desc: 'Geçmiş satış hızları, mağaza stok seviyeleri ve iade oranları analiz edilerek doğru ürünün doğru yerde olması sağlanır.',
                left: '22%', top: '33%'
            },
            {
                id: 'trend_numune',
                icon: '👟',
                title: 'Numune & Koleksiyon Seçimi',
                desc: 'Müşteri trendleri ve sezon beklentilerine uygun yeni ayakkabı ve aksesuar koleksiyonları titizlikle incelenip seçilir.',
                left: '26%', top: '46%'
            },
            {
                id: 'omnichannel',
                icon: '🌐',
                title: 'Omnichannel & Kanal Yönetimi',
                desc: 'FLO fiziksel mağazaları, mobil uygulama ve web sitesi arasındaki ürün dağıtımı ve kanal uyumu koordine edilir.',
                left: '65%', top: '38%'
            },
            {
                id: 'kampanya',
                icon: '🏷️',
                title: 'Fiyat & Kampanya Stratejisi',
                desc: 'Satış performansına göre dinamik fiyatlandırma, indirim dönemleri ve özel promosyon kurguları planlanır.',
                left: '75%', top: '53%'
            },
            {
                id: 'tedarik',
                icon: '📦',
                title: 'Tedarik Zinciri & Lojistik',
                desc: 'Üretimden depoya, depodan satış kanallarına kadar tüm ürün sevkiyat ve ek sipariş süreçleri yakından takip edilir.',
                left: '42%', top: '60%'
            }
        ]
    },
    3: {
        id: 3,
        code: 'kategori',
        family: 'ticari',
        gameComponent: 'classification',
        taskSummary: 'Kategori kararlarını trend, performans ve ticari planlama başlıklarına ayır.',
        title: 'Kategori Yönetimi',
        isAvailable: true,
        image: 'assets/rooms/oda3.webp',
        characterTitle: '📊 Kategori Yöneticisi',
        dialogues: [
            {
                title: "Hoş Geldin! 👋",
                text: "Merhaba! Kategori Yönetimi departmanına hoş geldin! 👋 Bir ürünün fikir aşamasından başlayıp müşteriye ulaşana kadar nasıl bir yolculuktan geçtiğini hiç düşündün mü?"
            },
            {
                title: "Sadece Ürün Seçmiyoruz 👟",
                text: "Kategori Yönetimi sadece hangi ürünlerin satılacağına karar vermekten ibaret değil! Satın alma, planlama, lojistik, pazarlama ve mağazacılık ekipleriyle birlikte çalışarak ürünün tüm ticari sürecini yönetiyoruz."
            },
            {
                title: "Ürünün Yolculuğu 🔄",
                text: "Her şey müşteri ihtiyaçlarını anlamakla başlıyor. Ardından ürün planlama, üretim, kalite kontrol ve stok yönetimi gibi aşamalar geliyor. Ürün müşteriye ulaştıktan sonra da satış performansını takip ediyoruz."
            },
            {
                title: "Veriler Bizim İçin Önemli 📊",
                text: "Karar verirken verilerden yararlanıyoruz! Satış performansını ve stok durumunu takip ederek ürünlerle ilgili daha doğru planlamalar ve stratejik kararlar alınmasına katkı sağlıyoruz."
            },
            {
                title: "Bir Kategori Yöneticisi Nasıl Olmalı? 🧠",
                text: "Bu iş sadece rakamlardan ibaret değil! İyi bir kategori yöneticisinin analitik düşünebilmesi, güçlü iletişim kurabilmesi, problemleri çözebilmesi ve farklı ekiplerle uyum içinde çalışabilmesi gerekiyor."
            },
            {
                title: "Şimdi Sıra Sende! 🎮",
                text: "Artık Kategori Yönetiminin bir ürünü fikir aşamasından müşteriye kadar nasıl takip ettiğini biliyorsun! Şimdi öğrendiklerini kullanarak bir kategori yöneticisi gibi karar vermeye hazır mısın?",
                isLast: true,
                btnText: "🎮 Göreve Başla →"
            }
        ],
        gameTitle: "Kategori Yönetimi Simülasyonu",
        gameDesc: "Kategori Yönetimi ekibimize hoş geldin! Yakında ürün yaşam döngüsü, stok-talep dengesi ve ticari kategori kararları simülasyonunu burada oynayacaksın.",
        hotspots: [
            {
                id: 'urun_planlama',
                icon: '📋',
                title: 'Ürün & Ticari Planlama',
                desc: 'Fikir aşamasından rafa kadar ürün gamının, sezon bütçelerinin ve satış hedeflerinin planlandığı merkez.',
                left: '21%', top: '34%'
            },
            {
                id: 'fiyat_stok',
                icon: '📊',
                title: 'Satış & Stok Performansı',
                desc: 'Hangi kategoride hangi modelin ne kadar sattığı, stok devir hızları ve talep tahminleri buradan takip edilir.',
                left: '28%', top: '48%'
            },
            {
                id: 'pazar_trend',
                icon: '👟',
                title: 'Trend & Rakip Analizi',
                desc: 'Pazar dinamikleri, müşteri segmentasyonu ve küresel ayakkabı trendleri incelenerek doğru ürün karması belirlenir.',
                left: '64%', top: '37%'
            },
            {
                id: 'ekip_isbirligi',
                icon: '🤝',
                title: 'Çapraz Fonksiyonel İş Birliği',
                desc: 'Satın alma, lojistik, pazarlama ve mağazacılık ekipleriyle koordinasyon kurularak ürün süreçleri yönetilir.',
                left: '74%', top: '51%'
            },
            {
                id: 'stratejik_karar',
                icon: '🎯',
                title: 'Kategori Stratejileri',
                desc: 'Düşük performanslı veya çok satan ürünler için kampanya, fiyatlama ve stok transfer kararları alınır.',
                left: '43%', top: '61%'
            }
        ]
    },
    4: {
        id: 4,
        code: 'planlama',
        family: 'ticari',
        gameComponent: 'budget',
        taskSummary: 'Mağazaların verilerine göre 100 birimlik bütçeyi dağıt.',
        title: 'Merchandise Planning (Planlama)',
        isAvailable: true,
        image: 'assets/rooms/oda4.webp',
        characterTitle: '📈 Planlama Uzmanı',
        dialogues: [
            {
                title: "Planlamaya Hoş Geldin! 👋",
                text: "Merhaba! Merchandise Planning departmanına hoş geldin! 👋 Bir ürünün doğru zamanda, doğru mağazada ve doğru miktarda bulunmasının nasıl planlandığını hiç merak ettin mi?"
            },
            {
                title: "Sadece Stok Takibi Değil! 📦",
                text: "Planlama sadece stokları takip etmekten ibaret değil! Satış tahminleri hazırlıyor, bütçe planlamaları yapıyor ve ürünlerin doğru zamanda doğru mağazalara ulaşmasını planlıyoruz."
            },
            {
                title: "Sezon Başlamadan Önce 📅",
                text: "Planlama sürecimiz sezon başlamadan önce başlıyor. Satış tahminlerini oluşturuyor, ürünleri ve ihtiyaç duyulacak miktarları planlayarak yeni sezona hazırlanıyoruz."
            },
            {
                title: "Sezon Başladı, Planlama Bitmedi! 📊",
                text: "Sezon başladıktan sonra satışları ve stok durumlarını düzenli olarak takip ediyoruz. Gerçekleşen sonuçlara göre planlarımızı güncelliyor ve gerekli aksiyonları alıyoruz."
            },
            {
                title: "Her Mağaza Aynı Değil! 🏬",
                text: "Ürünleri mağazalara dağıtırken mağazanın kapasitesini, müşteri profilini ve satış performansını dikkate alıyoruz. Ekonomik gelişmeler ve değişen tüketici davranışları da planlarımızı etkileyebiliyor."
            },
            {
                title: "Şimdi Planlama Sende! 🎮",
                text: "Gördüğün gibi iyi bir planlama için satış, stok ve mağaza verilerini birlikte değerlendirmek gerekiyor. Satın alma, lojistik, finans ve ürün yönetimi ekipleriyle de sürekli iletişim halindeyiz. Şimdi sen de verileri inceleyip doğru planlamayı yapmaya hazır mısın?",
                isLast: true,
                btnText: "🎮 Planlama Görevine Başla →"
            }
        ],
        gameTitle: "Merchandise Planning Simülasyonu",
        gameDesc: "Merchandise Planning ekibimize hoş geldin! Yakında satış tahminleme, mağaza allokasyonu ve sezon bütçe simülasyonunu burada oynayacaksın.",
        hotspots: [
            {
                id: 'tahmin_butce',
                icon: '📊',
                title: 'Satış Tahminleme & Bütçe',
                desc: 'Geçmiş sezon verileri ve pazar dinamikleri analiz edilerek kategori ve mağaza bazlı bütçe hedefleri oluşturulur.',
                left: '21%', top: '34%'
            },
            {
                id: 'magaza_dagitim',
                icon: '🏬',
                title: 'Mağaza Dağıtımı & Allokasyon',
                desc: 'Mağaza metrekareleri, müşteri profilleri ve satış hızlarına göre her noktaya doğru ürün miktarı tahsis edilir.',
                left: '27%', top: '48%'
            },
            {
                id: 'sezon_takip',
                icon: '📅',
                title: 'Sezon İçi Performans & Revizyon',
                desc: 'Sezon devam ederken gerçekleşen satışlar izlenir; hedefin gerisinde veya ilerisinde kalan ürünler için planlar revize edilir.',
                left: '65%', top: '37%'
            },
            {
                id: 'stok_otb',
                icon: '📦',
                title: 'Stok Devir Hızı & OTB Yönetimi',
                desc: 'Depo ve mağaza stok seviyeleri dengelenerek nakit akışını ve açık satın alma (OTB) bütçelerini optimize eden kararlar alınır.',
                left: '75%', top: '52%'
            },
            {
                id: 'ekip_koordinasyon',
                icon: '🔄',
                title: 'Çapraz Ekip Koordinasyonu',
                desc: 'Satın alma, lojistik, finans ve kategori ekipleriyle kesintisiz iletişim kurularak tedarik akışı güvenceye alınır.',
                left: '43%', top: '61%'
            }
        ]
    },
    5: {
        id: 5,
        code: 'tedarik_surec',
        family: 'analitik',
        gameComponent: 'flow',
        taskSummary: 'Tasarım onayından sevkiyata uzanan tedarik akışını kur.',
        title: 'Tedarik Operasyonları ve Süreç Geliştirme',
        isAvailable: true,
        image: 'assets/rooms/oda5.webp',
        characterTitle: '⚙️ Süreç Geliştirme Uzmanı',
        dialogues: [
            {
                title: "Tedarik Operasyonlarına Hoş Geldin! 👋",
                text: "Merhaba! Tedarik Operasyonları ve Süreç Geliştirme birimine hoş geldin! 👋 Bir ürünün tasarımdan başlayıp müşteriye ulaşana kadar hangi aşamalardan geçtiğini hiç düşündün mü?"
            },
            {
                title: "Ürünün Uzun Bir Yolculuğu Var! 👟",
                text: "Bir ürünün yolculuğu tasarımla başlıyor; üretim, kalite kontrol, depo ve sevkiyat aşamalarıyla devam ediyor. Ürün müşteriye ulaştıktan sonra ise satış sonrası süreçler devreye giriyor."
            },
            {
                title: "Süreçleri Nasıl Geliştiriyoruz? ⚙️",
                text: "Süreç Geliştirme olarak bu adımları analiz ediyoruz. Amacımız süreçlerin daha hızlı, verimli ve kaliteli ilerlemesini sağlamak ve geliştirebileceğimiz noktaları belirlemek."
            },
            {
                title: "Teknoloji Her Aşamada! 💻",
                text: "Bu süreçlerde birçok dijital sistemden yararlanıyoruz! Ürün geliştirmede Centric PLM, süreç yönetiminde Floxo, kurumsal kaynak planlamasında SAP ve raporlamada Power BI gibi teknolojiler kullanılıyor."
            },
            {
                title: "Yapay Zekâ da İş Başında! 🤖",
                text: "Yapay zekâ karar süreçlerinde bize destek olabiliyor. Örneğin benzer ürünleri karşılaştırarak öneriler sunan algoritmalardan yararlanılıyor. IDES sistemi ise iade edilen ürünün fotoğrafını analiz ederek problemin üretim veya müşteri kaynaklı olup olmadığına yönelik değerlendirme yapabiliyor."
            },
            {
                title: "Süreci İyileştirme Sırası Sende! 🎮",
                text: "Gördüğün gibi tedarik operasyonlarında ürün, veri ve teknoloji bir arada ilerliyor. Şimdi süreçteki adımları inceleyip daha hızlı ve verimli hale getirebileceğin noktaları bulmaya hazır mısın?",
                isLast: true,
                btnText: "⚙️ Süreç Geliştirme Görevine Başla →"
            }
        ],
        gameTitle: "Tedarik & Süreç Geliştirme Simülasyonu",
        gameDesc: "Tedarik Operasyonları ve Süreç Geliştirme ekibimize hoş geldin! Yakında dijital sistemler (Centric PLM, SAP, IDES AI) ve süreç optimizasyonu simülasyonunu burada oynayacaksın.",
        hotspots: [
            {
                id: 'centric_plm',
                icon: '💻',
                title: 'Centric PLM & Ürün Yaşam Döngüsü',
                desc: 'Tasarım aşamasından numune onayına kadar ürün geliştirme verilerinin yönetildiği merkezi platform.',
                left: '21%', top: '34%'
            },
            {
                id: 'ides_ai',
                icon: '🤖',
                title: 'IDES Yapay Zekâ & İade Analizi',
                desc: 'İade edilen ürün fotoğraflarını yapay zekâ ile inceleyerek sorunun üretim mi yoksa kullanım kaynaklı mı olduğunu analiz eden sistem.',
                left: '27%', top: '48%'
            },
            {
                id: 'floxo_surec',
                icon: '⚙️',
                title: 'Floxo Süreç Yönetimi',
                desc: 'Departmanlar arası iş akışlarını, onay mekanizmalarını ve süreç verimliliğini dijitalleştiren altyapı.',
                left: '65%', top: '37%'
            },
            {
                id: 'sap_powerbi',
                icon: '📊',
                title: 'SAP ERP & Power BI Raporlama',
                desc: 'Tüm kurumsal kaynakların planlanması, depo-stok akışları ve anlık süreç KPI panelleri buradan izlenir.',
                left: '75%', top: '52%'
            },
            {
                id: 'kalite_lojistik',
                icon: '🏭',
                title: 'Üretim, Depo & Kalite Kontrol',
                desc: 'Üretim bantlarından çıkan ayakkabıların kalite standartları denetlenir ve depolar arası sevkiyat planlanır.',
                left: '43%', top: '61%'
            }
        ]
    },
    6: {
        id: 6,
        code: 'perakende_operasyon',
        family: 'analitik',
        gameComponent: 'stock',
        taskSummary: 'Sistem stoklarıyla depo sayımını karşılaştırıp üç farkı bul.',
        title: 'Perakende Operasyonları',
        isAvailable: true,
        image: 'assets/rooms/oda6.webp',
        characterTitle: '🏬 Perakende Operasyon Uzmanı',
        dialogues: [
            {
                title: "Hoş Geldin! 👋",
                text: "Merhaba! Perakende Operasyonlarına hoş geldin! 👋 Mağazalarda her şeyin düzenli şekilde ilerlemesini sağlayan büyük bir operasyon sistemi olduğunu biliyor muydun?"
            },
            {
                title: "Mağazaların Arka Planındayız! 🏬",
                text: "Biz sadece satışla ilgilenmiyoruz! Stok ve envanter yönetimi, gider kontrolü, mağaza varlıkları, operasyon standartları ve merkez-mağaza koordinasyonu gibi birçok sürecin düzenli ilerlemesini sağlıyoruz."
            },
            {
                title: "Kaydî Stok = Fiilî Stok 📦",
                text: "Stok yönetimindeki en önemli hedeflerimizden biri sistemde görünen kaydî stok ile mağazada gerçekten bulunan fiilî stokun eşleşmesi. Bunun için fiziksel sayım sonuçlarını sistem kayıtlarıyla karşılaştırıyor ve farklılıkları inceliyoruz."
            },
            {
                title: "Sistemler ve Veriler İş Başında! 💻",
                text: "Mağazalardaki stok süreçleri yalnızca fiziksel olarak yürütülmüyor. ERP/SAP gibi kurumsal sistemlerden yararlanıyor; stok, gider ve performans verilerini analiz ederek operasyonlarımızı takip ediyoruz."
            },
            {
                title: "Ölç, Analiz Et, Geliştir! 📊",
                text: "Bir sorun veya yüksek gider tespit edildiğinde önce nedenini analiz ediyor, ardından gerekli aksiyonu alıyoruz. Sonuçları izleyip raporlayarak süreçlerimizi sürekli geliştirmeyi hedefliyoruz."
            },
            {
                title: "Şimdi Operasyon Sende! 🎮",
                text: "Gördüğün gibi başarılı bir mağaza operasyonu; doğru stok, doğru veri ve güçlü merkez-mağaza koordinasyonuna dayanıyor. Şimdi sen de verileri inceleyip mağazadaki operasyonel problemi çözmeye hazır mısın?",
                isLast: true,
                btnText: "🎮 Operasyon Görevine Başla →"
            }
        ],
        gameTitle: "Perakende Operasyonları Simülasyonu",
        gameDesc: "Perakende Operasyonları ekibimize hoş geldin! Yakında kaydî-fiilî stok eşleştirme, mağaza gider kontrolü ve operasyonel verimlilik simülasyonunu burada oynayacaksın.",
        hotspots: [
            {
                id: 'kaydi_fiili_stok',
                icon: '📦',
                title: 'Kaydî & Fiilî Stok Eşleme',
                desc: 'Fiziksel sayım sonuçları sistem kayıtlarıyla karşılaştırılarak stok farkları ve fire oranları analiz edilir.',
                left: '21%', top: '34%'
            },
            {
                id: 'magaza_standart',
                icon: '🏬',
                title: 'Mağaza Varlık & Standart Yönetimi',
                desc: 'Tüm FLO mağazalarının fiziksel operasyon standartları, demirbaş varlıkları ve düzeni denetlenir.',
                left: '27%', top: '48%'
            },
            {
                id: 'erp_envanter',
                icon: '💻',
                title: 'ERP/SAP Envanter Sistemleri',
                desc: 'Mağaza içi ürün hareketleri, transferler ve anlık stok durumları merkezi ERP yazılımlarıyla takip edilir.',
                left: '65%', top: '37%'
            },
            {
                id: 'gider_kontrol',
                icon: '📊',
                title: 'Gider & Maliyet Kontrolü',
                desc: 'Mağazaların kira, personel, lojistik ve operasyonel giderleri incelenerek tasarruf ve verimlilik alanları belirlenir.',
                left: '75%', top: '52%'
            },
            {
                id: 'merkez_koordinasyon',
                icon: '🤝',
                title: 'Merkez - Mağaza Koordinasyonu',
                desc: 'Genel merkez stratejilerinin yüzlerce mağazada eksiksiz uygulanması için sürekli iletişim ve destek sağlanır.',
                left: '43%', top: '61%'
            }
        ]
    },
    7: {
        id: 7,
        code: 'tasarim_merkezi',
        family: 'yaratıcı',
        gameComponent: 'materials',
        taskSummary: 'Malzemeleri inceleyip sürdürülebilir tasarım kararları ver.',
        title: 'Tasarım Merkezi',
        isAvailable: true,
        image: 'assets/rooms/oda7.webp',
        characterTitle: '🎨 Tasarım & İnovasyon Lideri',
        dialogues: [
            {
                title: "Tasarım Merkezine Hoş Geldin! 👋",
                text: "Merhaba! FLO Tasarım Merkezine hoş geldin! 👋 Burada bir tasarımın sadece güzel görünmesi değil; kullanıcı ihtiyacına cevap vermesi, işlevsel ve yenilikçi olması da bizim için önemli."
            },
            {
                title: "Her Şey Bir Fikirle Başlıyor! 💡",
                text: "Yeni projelerimiz bir fikrin ortaya çıkmasıyla başlıyor. Fikirleri değerlendiriyor, uygun olanları planlıyor ve tasarım-geliştirme aşamalarından geçirerek sistemli bir proje süreci yürütüyoruz."
            },
            {
                title: "Tasarımın Ötesindeyiz! 👟",
                text: "Çalışmalarımız yalnızca ayakkabının görünümünü tasarlamakla sınırlı değil! Kullanıcı ihtiyaçları, ürünün işlevselliği, yenilikçi malzemeler ve sürdürülebilirlik gibi birçok unsuru birlikte değerlendiriyoruz."
            },
            {
                title: "Fikirlerimizi Koruyoruz! 🧠",
                text: "Geliştirilen yenilikçi fikirler patent ve tasarım tescil çalışmalarına da dönüşebiliyor. Mıknatıslı bağcık, üç işlevli ayakkabı ve zeytin çekirdeğinden ayakkabı gibi birbirinden farklı projeler geliştirdik!"
            },
            {
                title: "Tasarım + Teknoloji 🤖",
                text: "FLO'da inovasyon teknolojiyle de destekleniyor! Teknoloji Ar-Ge tarafında mikroservis altyapısı, omnichannel uygulamalar, tedarik zincirine yönelik yapay zekâ ve dijital müşteri deneyimini geliştiren AI çözümleri üzerinde çalışılıyor."
            },
            {
                title: "Şimdi Tasarım Sırası Sende! 🎮",
                text: "Gördüğün gibi iyi bir ürün; fikir, kullanıcı ihtiyacı, işlevsellik, inovasyon ve sürdürülebilirliğin bir araya gelmesiyle ortaya çıkıyor. Üniversitelerle yapılan iş birlikleri de yeni fikirlerin geliştirilmesine katkı sağlıyor. Şimdi sen de yenilikçi bir ürün fikri geliştirmeye hazır mısın?",
                isLast: true,
                btnText: "💡 Tasarım Görevine Başla →"
            }
        ],
        gameTitle: "Tasarım & İnovasyon Simülasyonu",
        gameDesc: "FLO Tasarım Merkezine hoş geldin! Yakında yenilikçi malzeme seçimi, patentlenebilir ürün tasarımı ve prototipleme simülasyonunu burada oynayacaksın.",
        hotspots: [
            {
                id: 'fikir_konsept',
                icon: '💡',
                title: 'Fikir & Konsept Geliştirme',
                desc: 'Tüketici içgörüleri ve pazar araştırmaları doğrultusunda yeni ürün konseptleri ve eskizleri çizilir.',
                left: '21%', top: '34%'
            },
            {
                id: 'surdurulebilir_malzeme',
                icon: '👟',
                title: 'İnovatif & Sürdürülebilir Malzemeler',
                desc: 'Zeytin çekirdeği, geri dönüştürülmüş tabanlar ve ergonomik kumaşlar gibi çevre dostu ve yenilikçi materyaller test edilir.',
                left: '27%', top: '48%'
            },
            {
                id: 'patent_tescil',
                icon: '🧠',
                title: 'Patent & Tasarım Tescili',
                desc: 'Mıknatıslı bağcık, çok işlevli taban gibi özgün buluşların patentleme ve yasal fikri mülkiyet süreçleri yürütülür.',
                left: '65%', top: '37%'
            },
            {
                id: 'ar_ge_teknoloji',
                icon: '🤖',
                title: 'Teknoloji Ar-Ge & Yapay Zekâ',
                desc: 'Müşteri deneyimini dijitalleştiren AI çözümleri, 3D modelleme ve akıllı tedarik zinciri teknolojileri geliştirilir.',
                left: '75%', top: '52%'
            },
            {
                id: 'universite_isbirligi',
                icon: '🎓',
                title: 'Üniversite & Sanayi İş Birliği',
                desc: 'Akademik kurumlar ve genç tasarımcılarla ortak projeler yürütülerek yenilikçi vizyonlar şirkete kazandırılır.',
                left: '43%', top: '61%'
            }
        ]
    },
    8: {
        id: 8,
        code: 'perakende_satis',
        family: 'ticari',
        gameComponent: 'routing',
        taskSummary: 'Siparişleri stok ve teslim süresine göre doğru noktaya yönlendir.',
        title: 'Perakende Satış & Markalar',
        isAvailable: true,
        image: 'assets/rooms/oda8.webp',
        characterTitle: '🛍️ Perakende Satış Lideri',
        dialogues: [
            {
                title: "Perakende Satışa Hoş Geldin! 👋",
                text: "Merhaba! In Street, Nine West, Lumberjack ve Reebok TR Perakende Satış dünyasına hoş geldin! 👋 Burada mağazaların satış performansından operasyon süreçlerine ve müşteri deneyimine kadar birçok süreci birlikte yönetiyoruz."
            },
            {
                title: "Veriler Bize Yol Gösteriyor! 📊",
                text: "Mağazalardan gelen satış ve operasyon verilerini sürekli takip ediyoruz. Bu verileri analiz ederek raporlara dönüştürüyor ve yöneticilerin karar süreçlerini destekliyoruz."
            },
            {
                title: "Ürün Bu Mağazada Yoksa? 👟",
                text: "Müşteri istediği ürünü mağazada bulamadığında satışın bitmesi gerekmiyor! ISO ve OMS sayesinde ürünün diğer mağaza ve depo stoklarını kontrol ederek uygun noktadan müşteriye ulaştırabiliyoruz."
            },
            {
                title: "Mağaza Artık Mobil! 📱",
                text: "FLO Dijital ile mağaza çalışanları stok ve fiyat sorgulama, etiket basımı, müşteri şikâyet yönetimi, depodan ürün talebi ve anlık satış takibi gibi birçok işlemi mobil cihazlarından gerçekleştirebiliyor."
            },
            {
                title: "Depoda Ürün Aramaya Son! 📦",
                text: "Depolardaki ürünleri QR etiketli konumlara yerleştiriyoruz. Böylece çalışanlar talep edilen ürünün nerede olduğunu daha hızlı bulabiliyor ve müşterinin bekleme süresi azaltılabiliyor."
            },
            {
                title: "Müşteri Ne Düşünüyor? ⭐",
                text: "Teknoloji yalnızca stok ve satış için kullanılmıyor! NPS ile müşterilerin bizi tavsiye etme eğilimini ölçüyor, sonuçları mağaza ve bölge bazında takip ediyoruz. Düşük puanların nedenlerini inceleyerek geliştirilmesi gereken alanları belirliyoruz."
            },
            {
                title: "Şimdi Sıra Sende! 🎮",
                text: "Gördüğün gibi modern perakendede mağaza + veri + yazılım + müşteri deneyimi birlikte çalışıyor. Şimdi bir müşterinin siparişini doğru sistemleri kullanarak tamamlamaya hazır mısın?",
                isLast: true,
                btnText: "🛍️ Siparişi Yönet →"
            }
        ],
        gameTitle: "Perakende Satış & Müşteri Deneyimi Simülasyonu",
        gameDesc: "In Street, Nine West, Lumberjack & Reebok TR dünyasına hoş geldin! Yakında ISO/OMS sipariş yönetimi, FLO Dijital mobil operasyonlar ve NPS müşteri deneyimi simülasyonunu burada oynayacaksın.",
        hotspots: [
            {
                id: 'iso_oms',
                icon: '👟',
                title: 'ISO & OMS Sipariş Yönetimi',
                desc: 'Mağazada tükenen ürünün diğer şube veya depolardan sorgulanıp müşterinin adresine yönlendirildiği omnichannel sipariş sistemi.',
                left: '21%', top: '34%'
            },
            {
                id: 'flo_dijital',
                icon: '📱',
                title: 'FLO Dijital Mobil Mağazacılık',
                desc: 'Mobil cihazlardan anlık stok/fiyat sorgulama, etiket basımı ve satış takibi yapılan operasyonel mağaza uygulaması.',
                left: '27%', top: '48%'
            },
            {
                id: 'qr_depo',
                icon: '📦',
                title: 'QR Kodlu Depo & Hızlı Teslimat',
                desc: 'Depolardaki konumlandırılmış QR etiketleme ile aranan ayakkabı modelinin saniyeler içinde raftan bulunmasını sağlayan altyapı.',
                left: '65%', top: '37%'
            },
            {
                id: 'nps_deneyim',
                icon: '⭐',
                title: 'NPS & Müşteri Memnuniyeti',
                desc: 'Müşteri geri bildirimleri ve tavsiye skorlarının mağaza-bölge bazında analiz edilip aksiyona dönüştürüldüğü sistem.',
                left: '75%', top: '52%'
            },
            {
                id: 'satis_kpi',
                icon: '📊',
                title: 'Mağaza Satış & KPI Performansı',
                desc: 'In Street, Nine West, Lumberjack ve Reebok TR mağazalarının anlık ciro, sepet ortalaması ve dönüşüm oranları takip edilir.',
                left: '43%', top: '61%'
            }
        ]
    },
    9: {
        id: 9,
        code: 'e_ticaret',
        family: 'ticari',
        gameComponent: 'ranking',
        taskSummary: 'Ürünleri stok, satış hızı ve müşteri ilgisine göre vitrinde sırala.',
        title: 'E-Ticaret ve Alternatif Satış Kanalları',
        isAvailable: true,
        image: 'assets/rooms/oda9.webp',
        characterTitle: '🛒 E-Ticaret & Marketplace Lideri',
        dialogues: [
            {
                title: "E-Ticaret Dünyasına Hoş Geldin! 🛒",
                text: "Merhaba! E-Ticaret ve Alternatif Satış Kanallarına hoş geldin! 👋 FLO'da müşterilerimize yalnızca mağazalardan değil; web siteleri, mobil uygulamalar ve farklı dijital satış kanalları üzerinden de ulaşıyoruz."
            },
            {
                title: "E-Ticaret Sadece Web Sitesi Değil! 🌐",
                text: "Bir ürünün internette satışa çıkmasının arkasında büyük bir ekip var! Kategori yönetimi, platform yönetimi, ürün planlama, marketplace ve performans takibi gibi birçok birim birlikte çalışıyor."
            },
            {
                title: "Ne Satıyoruz, Nasıl Satıyoruz? 👟",
                text: "Kategori Yönetimi ürün seçimi, sipariş, stok ve satış performansıyla ilgilenirken; Platform Yönetimi kampanyaları, satış metriklerini, web sitesini ve kullanıcı deneyimini yönetiyor. Kısacası biri “Ne satıyoruz?”, diğeri “Nasıl daha iyi satıyoruz?” sorusuna odaklanıyor."
            },
            {
                title: "Her Yerde Müşterinin Yanındayız! 📱",
                text: "FLO'nun kendi dijital kanallarının yanında farklı pazaryerleri de satış ağımızın bir parçası. Bu nedenle farklı kanallardaki ürün, fiyat ve stok bilgilerinin birlikte ve tutarlı şekilde yönetilmesi büyük önem taşıyor."
            },
            {
                title: "Yapay Zekâ Vitrini Düzenliyor! 🤖",
                text: "Dijital mağazalarda ürünlerin hangi sırayla gösterildiği bile önemli! AI Sorting ile ürün sıralamaları yapay zekâ desteğiyle optimize edilebiliyor. Satış metrikleri ve KPI'lar da analiz edilerek platform performansı sürekli takip ediliyor."
            },
            {
                title: "Her Müşteriye Aynı Deneyim Değil! 🎯",
                text: "Müşteri davranışları ve ihtiyaçları birbirinden farklı. Bu nedenle kişiselleştirme sayesinde farklı müşteri gruplarına uygun ürünler, içerikler ve kampanyalar sunmak dijital perakendenin önemli parçalarından biri."
            },
            {
                title: "Dijital Mağaza Artık Sende! 🎮",
                text: "Gördüğün gibi e-ticaret; ürün, stok, yazılım, veri, yapay zekâ, pazarlama ve lojistiğin birlikte çalıştığı büyük bir sistem. Şimdi sen de dijital mağazayı yönetip doğru ürünü doğru müşteriye ulaştırmaya hazır mısın?",
                isLast: true,
                btnText: "🛒 Dijital Mağazayı Yönet →"
            }
        ],
        gameTitle: "E-Ticaret & Pazaryeri Simülasyonu",
        gameDesc: "E-Ticaret ve Alternatif Satış Kanalları dünyasına hoş geldin! Yakında AI Sorting ürün sıralama, çok kanallı stok-fiyat yönetimi ve kişiselleştirilmiş kampanya kurgularını burada oynayacaksın.",
        hotspots: [
            {
                id: 'ai_sorting',
                icon: '🤖',
                title: 'AI Sorting & Akıllı Ürün Sıralama',
                desc: 'Yapay zekâ algoritmaları ile müşteri ilgisi, stok durumu ve satış hızına göre ürünlerin dijital vitrindeki sıralaması optimize edilir.',
                left: '21%', top: '34%'
            },
            {
                id: 'marketplace_yonetimi',
                icon: '🌐',
                title: 'Marketplace & Pazaryeri Entegrasyonu',
                desc: 'Farklı e-ticaret pazaryerlerindeki mağazalarımız, fiyat tutarlılığı ve anlık stok senkronizasyonu tek merkezden yönetilir.',
                left: '27%', top: '48%'
            },
            {
                id: 'kisisellestirme',
                icon: '🎯',
                title: 'Kişiselleştirme & Müşteri Deneyimi',
                desc: 'Kullanıcı alışkanlıklarına ve geçmiş tercihlerine göre özel kampanya kurguları, bannerlar ve ürün önerileri sunulur.',
                left: '65%', top: '37%'
            },
            {
                id: 'dijital_metrikler',
                icon: '📊',
                title: 'Dijital Satış Metrikleri & KPI Takibi',
                desc: 'Ziyaretçi trafiği, dönüşüm oranı (CR), sepet terk oranları ve anlık ciro performans panelleri üzerinden takip edilir.',
                left: '75%', top: '52%'
            },
            {
                id: 'platform_ux',
                icon: '📱',
                title: 'Web & Mobil UX/UI Platform Yönetimi',
                desc: 'FLO mobil uygulaması ve web sitelerinde sorunsuz, hızlı ve kullanıcı dostu bir alışveriş deneyimi kurgulanır.',
                left: '43%', top: '61%'
            }
        ]
    },
    10: {
        id: 10,
        code: 'yurtdisi_operasyon',
        family: 'ticari',
        gameComponent: 'mapDecision',
        taskSummary: 'Dört örnek pazar için uygun giriş modelini seç.',
        title: 'Yurt Dışı Satış Operasyonları',
        isAvailable: true,
        image: 'assets/rooms/oda10.webp',
        characterTitle: '🌍 Global Operasyon Direktörü',
        dialogues: [
            {
                title: "Dünyaya Açılıyoruz! 🌍",
                text: "Merhaba! Yurt Dışı Satış Operasyonlarına hoş geldin! 👋 FLO’nun farklı ülkelerdeki satış ve mağazacılık faaliyetlerinin nasıl yönetildiğini keşfetmeye hazır mısın?"
            },
            {
                title: "Her Pazarda Aynı Model Yok! 🏬",
                text: "Yurt dışındaki operasyonlarımız tek bir satış modelinden oluşmuyor. Doğrudan mağazacılık, franchise, B2B/toptan satış ve farklı ülke operasyonları ile birçok pazarda faaliyet gösteriyoruz."
            },
            {
                title: "Başarıyı Verilerle Ölçüyoruz! 📊",
                text: "Her operasyonun hedefi farklı olduğu için kullandığımız performans göstergeleri de değişiyor. Ciro, pazar payı, metrekare verimliliği, hacimsel büyüme ve operasyonel verimlilik gibi KPI’larla sonuçları takip ediyoruz."
            },
            {
                title: "Mağazayı Yönetmek Bir Ekip İşi! ⚙️",
                text: "Başarılı bir mağaza yalnızca satış yapmaktan ibaret değil! Stok yönetimi, görsel mağazacılık, çalışan performansı ve müşteri hizmetleri birlikte yönetilerek mağazanın genel performansı oluşturuluyor."
            },
            {
                title: "Stokta Teknoloji Devrede! 📦💻",
                text: "Stok kayıplarını azaltmak ve sistemdeki stok bilgisini doğru tutmak bizim için önemli. Bu süreçlerde SAP/Fiori gibi dijital sistemlerden yararlanarak stok operasyonlarını ve mağaza süreçlerini destekliyoruz."
            },
            {
                title: "Müşteriyi de Dinliyoruz! ⭐",
                text: "Başarı sadece satış rakamıyla ölçülmüyor. NPS ve müşteri geri bildirimleri sayesinde müşteri deneyimini takip ediyor, elde ettiğimiz verilerle geliştirilmesi gereken noktaları belirliyoruz."
            },
            {
                title: "Uluslararası Operasyon Sende! 🎮",
                text: "Gördüğün gibi farklı ülkelerde başarılı olmak için doğru satış modeli, doğru stok, güçlü müşteri deneyimi ve veriye dayalı kararlar gerekiyor. Şimdi uluslararası bir operasyonu yönetmeye hazır mısın?",
                isLast: true,
                btnText: "🌍 Global Operasyonu Yönet →"
            }
        ],
        gameTitle: "Yurt Dışı Satış & Global Operasyon Simülasyonu",
        gameDesc: "Yurt Dışı Satış Operasyonları dünyasına hoş geldin! Yakında küresel pazar girişi, franchise yönetimi, metrekare verimliliği ve uluslararası stok dağıtım simülasyonunu burada oynayacaksın.",
        hotspots: [
            {
                id: 'global_modeller',
                icon: '🏬',
                title: 'Global Satış Modelleri & Franchise',
                desc: 'Farklı ülkelerdeki doğrudan mağazacılık, master franchise, toptan satış ve corner operasyonları yönetilir.',
                left: '21%', top: '34%'
            },
            {
                id: 'uluslararasi_kpi',
                icon: '📊',
                title: 'Uluslararası KPI & Metrekare Verimliliği',
                desc: 'Ülke bazlı pazar payı, metrekare başına satış verimliliği ve hacimsel büyüme hedefleri takip edilir.',
                left: '27%', top: '48%'
            },
            {
                id: 'sap_fiori_stok',
                icon: '📦',
                title: 'SAP/Fiori & Küresel Stok Yönetimi',
                desc: 'Uluslararası mağaza stokları, depo sevkiyatları ve fire önleme süreçleri SAP/Fiori üzerinden yürütülür.',
                left: '65%', top: '37%'
            },
            {
                id: 'global_nps',
                icon: '⭐',
                title: 'Global NPS & Müşteri Deneyimi',
                desc: 'Farklı kültürlerdeki müşteri beklentileri ve memnuniyet skorları ölçülerek yerel aksiyonlar alınır.',
                left: '75%', top: '52%'
            },
            {
                id: 'gorsel_magaza',
                icon: '🌍',
                title: 'Görsel Mağazacılık & Bölge Yönetimi',
                desc: 'Yurt dışı mağazalarında FLO marka standartlarına uygun vitrin, reyon düzeni ve operasyonel disiplin sağlanır.',
                left: '43%', top: '61%'
            }
        ]
    },
    11: {
        id: 11,
        code: 'marka_pazarlama',
        family: 'yaratıcı',
        gameComponent: 'matching',
        taskSummary: 'Hedef kitle, ürün, tarih, kanal ve yöntemle kampanya briefi kur.',
        title: 'Marka Pazarlama',
        isAvailable: true,
        image: 'assets/rooms/oda11.webp',
        characterTitle: '🎯 Marka Pazarlama Lideri',
        dialogues: [
            {
                title: "Marka Pazarlamaya Hoş Geldin! 🎯",
                text: "Merhaba! Marka Pazarlama odasına hoş geldin! 👋 Burada bir markanın sadece nasıl göründüğünü değil, insanların zihninde nasıl bir yer edindiğini planlıyoruz. Hazırsan başlayalım!"
            },
            {
                title: "Önce Markayı Tanıyoruz! 🧩",
                text: "Her şey marka stratejisiyle başlıyor. Hedef kitle, müşteri içgörüsü, marka değerleri, kişilik, rasyonel ve duygusal fayda bir araya gelerek markanın kim olduğunu oluşturuyor."
            },
            {
                title: "Peki Kiminle Konuşuyoruz? 👥",
                text: "Bir marka herkese aynı şekilde seslenemez! Önce hedef kitleyi belirliyor, ardından araştırmalar ve satın alma davranışlarıyla müşterinin gerçek ihtiyacını anlamaya çalışıyoruz."
            },
            {
                title: "“Sokak senİN” 👟",
                text: "Mesela IN Street! Markanın özü “Sokak senİN”. Kendini tarzıyla ifade eden ve spor giyim trendlerini takip eden gençlere ulaşmayı hedefliyor. Marka stratejisi de bu kitlenin beklentilerine göre şekilleniyor."
            },
            {
                title: "Şimdi Brief Zamanı! 📝",
                text: "Markayı ve müşteriyi tanıdık. Peki kampanyayı nasıl oluşturacağız? Bunun için bir brief hazırlıyoruz: Kim? → Ne? → Ne zaman? → Nerede? → Nasıl? Bu sorular kampanyanın hedef kitlesini, mesajını, zamanını, kanalını ve yaratıcı fikrini belirliyor."
            },
            {
                title: "Bir Kampanya, Bir Hikâye! 📸",
                text: "Moda çekimleri aslında görsel bir hikâye yaratımıdır. Persona, saç-makyaj, mekân, poz ve styling gibi detaylar markanın kimliğine uygun şekilde planlanır. Hiçbir detay rastgele seçilmez!"
            },
            {
                title: "Yaratıcılık Yetmez, Ölçmeliyiz! 📊",
                text: "Kampanya yayınlandıktan sonra iş bitmiyor! CRM, KPI ve performans verileriyle sonuçları takip ediyoruz. Amaç müşteriyi bilinirlikten → ziyarete → alışverişe → markayı daha sık tercih etmeye taşımak."
            },
            {
                title: "Şimdi Sıra Sende! 🚀",
                text: "Artık bir markanın nasıl oluşturulduğunu ve kampanyaya dönüştüğünü biliyorsun. Hedef kitleni seç, mesajını belirle ve kendi kampanyanı oluştur!",
                isLast: true,
                btnText: "🎨 Kampanyayı Oluştur →"
            }
        ],
        gameTitle: "Marka Pazarlama & Kampanya Simülasyonu",
        gameDesc: "Marka Pazarlama dünyasına hoş geldin! Yakında hedef kitle persona seçimi, yaratıcı brief hazırlama, moda çekim kurgusu ve kampanya KPI ölçüm simülasyonunu burada oynayacaksın.",
        hotspots: [
            {
                id: 'marka_strateji',
                icon: '🧩',
                title: 'Marka Stratejisi & Konumlandırma',
                desc: 'Marka değerleri, kişilik, rasyonel ve duygusal faydalar haritalanarak tüketicinin zihnindeki algı oluşturulur.',
                left: '21%', top: '34%'
            },
            {
                id: 'yaratici_brief',
                icon: '📝',
                title: 'Yaratıcı Brief & Kampanya Kurgusu',
                desc: 'Kim, Ne, Ne Zaman, Nerede ve Nasıl sorularına yanıt veren 360 derece pazarlama briefleri hazırlanır.',
                left: '27%', top: '48%'
            },
            {
                id: 'moda_cekimi',
                icon: '📸',
                title: 'Moda Çekimi & Görsel Hikâye',
                desc: 'Model, styling, saç-makyaj ve çekim konsepti markanın kimliğiyle kusursuz bir görsel uyum içinde planlanır.',
                left: '65%', top: '37%'
            },
            {
                id: 'crm_kpi',
                icon: '📊',
                title: 'CRM & Kampanya Performans Analizi',
                desc: 'Bilinirlik, mağaza trafiği ve satış dönüşüm metrikleri CRM verileri ve KPI göstergeleriyle ölçülür.',
                left: '75%', top: '52%'
            },
            {
                id: 'hedef_kitle',
                icon: '👥',
                title: 'Hedef Kitle & Tüketici İçgörüsü',
                desc: 'IN Street gibi markaların genç ve dinamik tüketici segmentleri, davranış ve trend araştırmalarıyla incelenir.',
                left: '43%', top: '61%'
            }
        ]
    },
    12: {
        id: 12,
        code: 'yalin_dijital_donusum',
        family: 'teknoloji',
        gameComponent: 'hiddenObject',
        taskSummary: 'Ofis ve depo sahnesindeki israf noktalarını keşfet.',
        title: 'Dijital ve Yalın Dönüşüm',
        isAvailable: true,
        image: 'assets/rooms/oda12.webp',
        characterTitle: '⚙️ Yalın Dönüşüm Lideri',
        dialogues: [
            {
                title: "Dönüşüme Hoş Geldin! ⚙️",
                text: "Merhaba! Dijital ve Yalın Dönüşüm odasına hoş geldin! 👋 Burada süreçlerin daha hızlı, verimli ve sürdürülebilir hale gelmesi için çalışıyoruz."
            },
            {
                title: "Önce Süreci Anlıyoruz! 🔍",
                text: "Bir süreci hemen dijitalleştirmiyoruz. Önce mevcut işleyişi analiz ediyor, zaman kaybettiren veya müşteriye değer katmayan adımları belirliyoruz."
            },
            {
                title: "Veri Olmadan İyileştirme Olmaz! 📊",
                text: "Bir sürecin gerçekten gelişip gelişmediğini anlayabilmek için önce ölçmek gerekir. Bu yüzden kararlarımızı veriler, KPI'lar ve performans sonuçları üzerinden destekliyoruz."
            },
            {
                title: "Yalın Düşünce Nedir? ♻️",
                text: "Yalın düşüncenin amacı daha az kaynakla daha fazla değer üretmek. Gereksiz işlemleri, hataları ve zaman kayıplarını azaltarak müşteriye gerçekten değer sağlayan adımlara odaklanıyoruz."
            },
            {
                title: "Teknoloji Doğru Yerde Kullanılmalı! 💻",
                text: "Dijital dönüşüm yalnızca yeni bir yazılım kullanmak değildir! Önce süreci iyileştiriyor, ardından teknolojiyi iş süreçleriyle entegre ederek daha güçlü ve sürdürülebilir bir yapı oluşturuyoruz."
            },
            {
                title: "Sürekli İyileştirme 🔄",
                text: "İyileştirme tek seferlik bir çalışma değil. Yalın Dönüşüm ekibi çalışanlardan gelen fikirleri değerlendiriyor, dönüşüm projelerini yönetiyor ve DMAIC gibi metodolojilerle süreçleri sistemli şekilde geliştiriyor."
            },
            {
                title: "Üç Ekip, Tek Hedef! 🚀",
                text: "Strateji ekibi hedefi belirliyor, İş Geliştirme ekibi yeni fırsatları buluyor, Yalın ve Dijital Dönüşüm ekibi ise bu hedeflere ulaşmayı sağlayacak sistemleri kuruyor. Hepsinin ortak amacı FLO'nun sürdürülebilir büyümesini desteklemek."
            },
            {
                title: "Şimdi Süreci Sen İyileştir! 🎮",
                text: "Artık mantığı biliyorsun: Analiz et → Ölç → İsrafı azalt → İyileştir → Teknolojiyle destekle. Şimdi sana verilen süreçteki gereksiz adımları bulmaya hazır mısın?",
                isLast: true,
                btnText: "⚙️ Süreci İyileştir →"
            }
        ],
        gameTitle: "Dijital & Yalın Dönüşüm Simülasyonu",
        gameDesc: "Dijital ve Yalın Dönüşüm dünyasına hoş geldin! Yakında değer akış haritalama (VSM), israf eliminasyonu, DMAIC metodolojisi ve dijital süreç optimizasyonu simülasyonunu burada oynayacaksın.",
        hotspots: [
            {
                id: 'surec_analizi',
                icon: '🔍',
                title: 'Süreç Analizi & Değer Akışı',
                desc: 'Mevcut operasyonel işleyiş haritalanarak değer katmayan gereksiz adımlar ve bekleme süreleri tespit edilir.',
                left: '21%', top: '34%'
            },
            {
                id: 'yalin_dusunce',
                icon: '♻️',
                title: 'Yalın Düşünce & İsraf (Muda) Önleme',
                desc: 'Daha az kaynakla daha fazla müşteri değeri yaratmak için 7 temel israf türü süreçlerden ayıklanır.',
                left: '27%', top: '48%'
            },
            {
                id: 'dmaic_kaizen',
                icon: '🔄',
                title: 'DMAIC & Sürekli İyileştirme (Kaizen)',
                desc: 'Tanımla, Ölç, Analiz Et, İyileştir ve Kontrol Et adımlarıyla sistemli ve köklü süreç dönüşümü sağlanır.',
                left: '65%', top: '37%'
            },
            {
                id: 'dijital_entegrasyon',
                icon: '💻',
                title: 'Dijital Entegrasyon & Otomasyon',
                desc: 'Yalınlaştırılan süreçler doğru yazılım, robotik süreç otomasyonu (RPA) ve dijital araçlarla güçlendirilir.',
                left: '75%', top: '52%'
            },
            {
                id: 'kpi_performans',
                icon: '📊',
                title: 'KPI & Performans Göstergeleri',
                desc: 'Süreç iyileştirmelerinin verimlilik ve maliyet tasarrufu etkileri anlık veri panelleriyle ölçülür.',
                left: '43%', top: '61%'
            }
        ]
    },
    13: {
        id: 13,
        code: 'flo_teknoloji',
        family: 'teknoloji',
        gameComponent: 'kanban',
        taskSummary: 'Altı iş kartını durumuna göre Geliştirme, Test veya Canlıya Alma kutusuna yerleştir.',
        title: 'FLO Teknoloji',
        isAvailable: true,
        image: 'assets/rooms/oda13.webp',
        characterTitle: '💻 Teknoloji & Yazılım Lideri',
        dialogues: [
            {
                title: "FLO Teknoloji'ye Hoş Geldin! 💻",
                text: "Merhaba! FLO Teknoloji odasına hoş geldin! 👋 Burada yazılım, veri, bulut sistemleri ve siber güvenlik gibi teknolojiler FLO’nun iş süreçleriyle buluşuyor."
            },
            {
                title: "Teknolojinin Arkasında Büyük Bir Ekip Var! 👥",
                text: "Teknoloji organizasyonu; Kurumsal Çözümler, E-Ticaret ve Network & Security olmak üzere üç ana direktörlük altında çalışıyor. Her ekip farklı sistemlerin geliştirilmesi ve sürdürülebilirliğinde görev alıyor."
            },
            {
                title: "Bir Yazılım Nasıl Canlıya Çıkıyor? 🚀",
                text: "Her şey bir ihtiyaç veya taleple başlıyor! Talep değerlendiriliyor, geliştirme planına alınıyor ve sprint içerisinde kodlanıyor. Ardından test ve kullanıcı kabul süreçlerinden geçerek canlı ortama aktarılıyor."
            },
            {
                title: "FLO'nun Teknoloji Ekosistemi 🌐",
                text: "FLO’nun teknoloji altyapısında SAP, Power BI, Microsoft Fabric, Google Cloud ve Microsoft Azure gibi teknolojilerin yanında FLOXO, e-ticaret platformları ve mobil uygulamalar gibi şirket içerisinde geliştirilen sistemler de bulunuyor."
            },
            {
                title: "Veriden Karara! 📊",
                text: "Toplanan veriler yalnızca saklanmıyor; analiz edilerek iş kararlarında kullanılıyor. Veri ve iş zekâsı çözümleri sayesinde farklı süreçlerin performansı takip edilebiliyor ve daha doğru kararlar alınabiliyor."
            },
            {
                title: "Yapay Zekâ da İş Başında! 🤖",
                text: "Yapay zekâ; talep tahmini, fiyat ve indirim önerileri, müşteri kaybı tahmini, ürün benzerliği ve mağaza optimizasyonu gibi problemlerin çözümünde kullanılıyor. Böylece büyük miktardaki veri anlamlı sonuçlara dönüştürülebiliyor."
            },
            {
                title: "Sistemleri Korumayı Unutma! 🛡️",
                text: "Teknoloji yalnızca yazılım geliştirmekten ibaret değil! Network & Security tarafında ağ altyapısının güvenli ve kesintisiz çalışması ile şirket sistemlerinin siber tehditlere karşı korunması da önemli görevler arasında."
            },
            {
                title: "Koddan Çok Daha Fazlası! 🧑‍💻",
                text: "Bilgisayar mühendisliği burada birçok alanda karşımıza çıkıyor: yazılım geliştirme, sistem mimarisi, yapay zekâ, büyük veri, bulut teknolojileri ve siber güvenlik. Geliştirilen her teknoloji çözümü gerçek bir iş ihtiyacını çözmek için kullanılıyor."
            },
            {
                title: "Son Kutu — Sistemi Canlıya Almaya Hazır mısın? 🎮",
                text: "Altı farklı iş seni bekliyor! Her kartın durumunu oku ve Geliştirme, Test veya Canlıya Alma kutusuna yerleştir. Kimi işin kodu yazılacak, kimi test bekliyor, kimi ise yayına hazır.",
                isLast: true,
                btnText: "💻 Geliştirmeye Başla →"
            }
        ],
        gameTitle: "Yazılım Geliştirme & Canlıya Alma Simülasyonu",
        gameDesc: "FLO Teknoloji dünyasına hoş geldin! Yakında sprint planlama, kodlama, test, bulut dağıtımı ve siber güvenlik onay süreçleri simülasyonunu burada oynayacaksın.",
        hotspots: [
            {
                id: 'cevik_sprint',
                icon: '🚀',
                title: 'Çevik Sprint & Canlıya Alma',
                desc: 'Talep analizi, sprint planlama, kod geliştirme, test ve canlıya alma (deployment) adımları koordine edilir.',
                left: '21%', top: '34%'
            },
            {
                id: 'bulut_devops',
                icon: '🌐',
                title: 'Bulut Mimarisi (Azure & GCP)',
                desc: 'Mikroservis altyapıları, konteyner sistemleri ve kesintisiz çalışan yüksek erişilebilirlikli bulut sunucuları.',
                left: '27%', top: '48%'
            },
            {
                id: 'ai_makine_ogrenimi',
                icon: '🤖',
                title: 'Yapay Zekâ & Makine Öğrenimi',
                desc: 'Talep tahmini, dinamik fiyatlandırma, churn tahmini ve ürün benzerlik modelleri geliştiren veri bilimi ekosistemi.',
                left: '65%', top: '37%'
            },
            {
                id: 'siber_guvenlik',
                icon: '🛡️',
                title: 'Network & Siber Güvenlik',
                desc: 'Kurumsal ağ altyapısının güvenliği, veri gizliliği ve 7/24 siber tehdit izleme & savunma sistemleri.',
                left: '75%', top: '52%'
            },
            {
                id: 'fabric_powerbi',
                icon: '📊',
                title: 'Büyük Veri, Fabric & Power BI',
                desc: 'Milyonlarca verinin depolandığı, işlendiği ve yöneticiler için anlık karar panellerine dönüştürüldüğü veri ambarı.',
                left: '43%', top: '61%'
            }
        ]
    },
    14: {
        id: 14,
        code: 'flo_ai',
        family: 'teknoloji',
        gameComponent: 'matching',
        taskSummary: 'İş senaryolarını uygun yapay zekâ teknolojileriyle eşleştir.',
        title: 'FLO Yapay Zekâ',
        isAvailable: true,
        image: 'assets/rooms/oda14.webp',
        characterTitle: '🤖 AI & Veri Bilimi Lideri',
        dialogues: [
            {
                title: "Yapay Zekâ Odasına Hoş Geldin! 🤖",
                text: "Merhaba! FLO Yapay Zekâ odasına hoş geldin. 👋 Burada yapay zekâ sadece deney yapmak için değil, gerçek iş problemlerini çözmek için kullanılıyor."
            },
            {
                title: "AI Tek Bir Şey Değil! 🧠",
                text: "FLO AI çalışmalarında Data Science, Machine Learning, Optimization, NLP, Image Processing ve Continuous Engineering gibi birçok alan bir arada kullanılıyor."
            },
            {
                title: "Bir Sipariş Nereye Gitmeli? 📦",
                text: "E-ticaret siparişleri için yapay zekâ ve optimizasyon devreye giriyor! Sipariş Atama Algoritması; kargo maliyeti, mesafe ve ürün kırıklığı gibi kriterleri değerlendirerek siparişlerin depo ve mağazalar arasında daha verimli dağıtılmasına yardımcı oluyor."
            },
            {
                title: "Dokümanları Tek Tek Aramana Gerek Yok! 💬",
                text: "Internal Chatbot, çalışanların kurum içi dokümanlar hakkında doğal dilde soru sorabilmesini sağlıyor. Böylece uzun dokümanlarda bilgi aramak yerine sorunu doğrudan yapay zekâya sorabiliyorsun."
            },
            {
                title: "Yapay Zekânın Gözü: Floscope 👁️",
                text: "Floscope, görüntü işleme kullanarak mağazalardaki anlık kuyruk uzunluğunu ve bekleme süresini takip ediyor. Yoğunluk oluştuğunda yöneticilerin müdahale edebilmesi için uyarı mekanizması devreye girebiliyor."
            },
            {
                title: "Bu Ayakkabının Benzerini Bulabilir misin? 👟",
                text: "Akıllı Benzerlik Motoru, ürünlerin stil ve desen özelliklerini analiz ediyor. Kullanıcılar fotoğraf, metin veya ürün kodu kullanarak benzer ürünleri bulabiliyor."
            },
            {
                title: "AI Karar Vermeye Yardımcı Oluyor! 🔍",
                text: "IDES AI sisteminde ürün görselleri yapay zekâ tarafından incelenerek Onay / Red karar süreci destekleniyor. Böylece yapay zekâ gerçek bir iş sürecinde karar destek sistemi olarak görev alıyor."
            },
            {
                title: "Yapay Zekâ Tasarımcı da Olabilir mi? 🎨",
                text: "Üretken yapay zekâ ile mankenli ürün görselleri ve farklı ayakkabı tasarım fikirleri oluşturulabiliyor. Böylece AI yalnızca verileri analiz etmiyor, yaratıcı süreçlerde de ekiplere destek oluyor."
            },
            {
                title: "Peki Yazılım Geliştirirken? 💻",
                text: "Yapay zekâ; analiz ve tasarım, kod üretimi, birim testleri, kod inceleme ve teknik dokümantasyon aşamalarında geliştiricilere yardımcı olabiliyor."
            },
            {
                title: "AI Agent'lar Devreye Giriyor! 🚀",
                text: "Bir başka yaklaşım ise Vibe Coding. İhtiyaç belirlendikten sonra prompt ile mimari ve planlama yapılabiliyor, AI Agent ile uygulama geliştirilebiliyor, hızlı prototip hazırlanıp test ve yayın aşamasına geçilebiliyor."
            },
            {
                title: "Son Kutu — AI Görevine Hazır mısın? 🎮",
                text: "FLO'da yapay zekânın birçok kullanım alanını gördün. Şimdi öğrendiklerini kullanma zamanı!",
                isLast: true,
                btnText: "🤖 AI Görevini Başlat →"
            }
        ],
        gameTitle: "Yapay Zekâ & Karar Destek Simülasyonu",
        gameDesc: "FLO Yapay Zekâ dünyasına hoş geldin! Yakında sipariş atama optimizasyonu, görüntü işleme (Floscope), benzerlik motoru ve GenAI tasarım kurguları simülasyonunu burada oynayacaksın.",
        hotspots: [
            {
                id: 'siparis_optimizasyon',
                icon: '📦',
                title: 'Sipariş Atama & Rota Optimizasyonu',
                desc: 'Kargo maliyeti, mesafe ve stok kırıklığını analiz ederek e-ticaret siparişlerini en uygun depo veya mağazaya atayan algoritma.',
                left: '21%', top: '34%'
            },
            {
                id: 'floscope_goruntu',
                icon: '👁️',
                title: 'Floscope & Görüntü İşleme',
                desc: 'Mağazalardaki kamera görüntülerini gerçek zamanlı işleyerek kasa kuyruk yoğunluğunu ve müşteri bekleme sürelerini ölçen sistem.',
                left: '27%', top: '48%'
            },
            {
                id: 'benzerlik_motoru',
                icon: '👟',
                title: 'Akıllı Benzerlik & Görsel Arama',
                desc: 'Fotoğraf, desen ve stil vektörlerini analiz ederek kullanıcının aradığı ayakkabıya en yakın alternatif modelleri bulan AI motoru.',
                left: '65%', top: '37%'
            },
            {
                id: 'gen_ai_tasarim',
                icon: '🎨',
                title: 'Üretken Yapay Zekâ (GenAI) & Tasarım',
                desc: 'Mankenli ürün fotoğrafları üretme, yaratıcı ayakkabı eskizleri ve sentetik pazarlama içerikleri oluşturan üretken modeller.',
                left: '75%', top: '52%'
            },
            {
                id: 'ai_agent_chatbot',
                icon: '🚀',
                title: 'AI Agent & Kurum İçi Chatbot',
                desc: 'Şirket dokümanları üzerinde RAG tabanlı doğal dil sorgulaması yapan ve otonom iş akışları yürüten AI Agent mimarisi.',
                left: '43%', top: '61%'
            }
        ]
    },
    15: {
        id: 15,
        code: 'crm_buyume',
        family: 'analitik',
        gameComponent: 'matching',
        taskSummary: 'Alışveriş davranışlarına göre müşterileri segmentlere ayır.',
        title: 'CRM ve Büyüme',
        isAvailable: true,
        image: 'assets/rooms/oda15.webp',
        characterTitle: '📱 CRM & Büyüme Lideri',
        dialogues: [
            {
                title: "CRM ve Büyüme'ye Hoş Geldin! 📱",
                text: "Merhaba! 👋 Hiç “Sepetinizde ürün kaldı” bildiriminin neden tam sana ve doğru zamanda geldiğini düşündün mü? Burada bunun arkasındaki veri ve müşteri yolculuğunu keşfedeceğiz!"
            },
            {
                title: "Müşteriyi Getirmek Yetmez! 🎯",
                text: "Dijital Pazarlama yeni müşterilere ulaşmaya odaklanırken, CRM kazanılan müşteriyi tanımaya ve onunla uzun süreli bir ilişki kurmaya çalışır. Kısacası: Doğru kişiyi getir, gelen müşteriyi elde tut!"
            },
            {
                title: "Her Müşteri Aynı Değil! 👥",
                text: "Müşterileri daha iyi tanımak için RFM analizi kullanılabilir: Recency (En son ne zaman?), Frequency (Ne sıklıkla?), Monetary (Ne kadar harcıyor?). Böylece müşteriler farklı segmentlere ayrılabiliyor."
            },
            {
                title: "Müşterinin 360° Görünümü 🔄",
                text: "Müşteri mağazada, web sitesinde ve mobil uygulamada farklı izler bırakabilir. Customer 360 ve CDP, bu farklı kanallardan gelen verileri bir araya getirerek tek bir müşteri profili oluşturmayı amaçlar."
            },
            {
                title: "4 Doğru Kuralı! 🎁",
                text: "CRM'in temelinde dört önemli karar var: Doğru Müşteri + Doğru Zaman + Doğru Kanal + Doğru Teklif. Herkese aynı kampanyayı göndermek yerine müşterinin davranışına uygun iletişim oluşturuyoruz."
            },
            {
                title: "Sistem 7/24 Çalışıyor! ⚡",
                text: "CRM otomasyonları müşteri davranışlarına göre e-posta, SMS ve push bildirimlerini otomatik olarak gönderebiliyor. Mesela müşteri sepetini terk ettiğinde sistem belirli bir süre sonra hatırlatma yapabiliyor!"
            },
            {
                title: "Veri Geleceği Tahmin Edebilir mi? 🧠",
                text: "Veriler yalnızca geçmişi anlamak için kullanılmıyor! Churn tahmini ile kaybedilme riski olan müşteriler belirlenebilir, öneri motorları ile kişiye uygun ürünler sunulabilir ve A/B testleriyle hangi kampanyanın daha başarılı olduğu ölçülebilir."
            },
            {
                title: "Veriden Aksiyona! 💻",
                text: "Bu sistemlerin arkasında güçlü bir teknoloji altyapısı var. Python, SQL, BigQuery/Snowflake ve Power BI gibi araçlarla veriler işleniyor, analiz ediliyor ve sonuçlar müşteri aksiyonlarına dönüştürülüyor: Veri → İşleme → Analiz → Karar → Aksiyon."
            },
            {
                title: "Son Kutu — Müşteriyi Geri Kazanabilir misin? 🎮",
                text: "Bir müşterimiz ürününü sepete ekledi ama alışverişi tamamlamadan çıktı! 🛒 Doğru müşteriye, doğru zamanda ve doğru kanaldan ulaşarak onu geri kazanmaya hazır mısın?",
                isLast: true,
                btnText: "📱 CRM Yolculuğunu Başlat →"
            }
        ],
        gameTitle: "Müşteri Sadakati & CRM Otomasyonu Simülasyonu",
        gameDesc: "CRM ve Büyüme dünyasına hoş geldin! Yakında RFM segmentasyonu, Customer 360, terk edilmiş sepet otomasyonu ve churn önleme simülasyonunu burada oynayacaksın.",
        hotspots: [
            {
                id: 'rfm_segmentasyon',
                icon: '👥',
                title: 'RFM Segmentasyonu & Davranış Analizi',
                desc: 'Alışveriş sıklığı, harcama tutarı ve son ziyaret tarihine göre müşteriler sadık, potansiyel ve riskli gruplara ayrılır.',
                left: '21%', top: '34%'
            },
            {
                id: 'customer_360_cdp',
                icon: '🔄',
                title: 'Customer 360 & CDP Platformu',
                desc: 'Mağaza, mobil uygulama ve web sitesindeki tüm müşteri ayak izleri tek bir tekil profilde birleştirilir.',
                left: '27%', top: '48%'
            },
            {
                id: 'crm_otomasyon',
                icon: '⚡',
                title: '7/24 Otomasyon & Terk Sepet Senaryoları',
                desc: 'Sepette ürün unutan veya belirli süre alışveriş yapmayan müşterilere anlık kişiselleştirilmiş push/SMS tetiklenir.',
                left: '65%', top: '37%'
            },
            {
                id: 'churn_oneri',
                icon: '🧠',
                title: 'Churn Tahmini & Öneri Algoritmaları',
                desc: 'Kaybedilme ihtimali olan müşteriler makine öğrenimiyle önceden tespit edilir ve özel geri kazanım teklifleri sunulur.',
                left: '75%', top: '52%'
            },
            {
                id: 'veri_ambari_sql',
                icon: '📊',
                title: 'BigQuery, SQL & Büyüme Panelleri',
                desc: 'Milyonlarca üyenin verisi işlenerek kampanya dönüşüm oranları (CR), yaşam boyu değer (CLV) ve büyüme metrikleri izlenir.',
                left: '43%', top: '61%'
            }
        ]
    },
    16: {
        id: 16,
        code: 'strateji',
        family: 'analitik',
        gameComponent: 'matching',
        taskSummary: 'İç ve dış faktörleri değerlendirerek SWOT tablosunu kur.',
        title: 'Strateji ve İş Geliştirme',
        isAvailable: true,
        image: 'assets/rooms/oda16.webp',
        characterTitle: '🧭 Strateji & Dönüşüm Direktörü',
        dialogues: [
            {
                title: "Strateji Odasına Hoş Geldin! 🧭",
                text: "Merhaba! 👋 Bir şirket büyümek istediğinde sadece hedef belirlemesi yeterli değildir. Önce nerede olduğunu, sonra nereye gitmek istediğini ve en önemlisi oraya nasıl ulaşacağını belirlemesi gerekir. İşte Strateji ekibi tam olarak bunun üzerinde çalışıyor!"
            },
            {
                title: "Strateji Departmanı Ne Yapar? 🎯",
                text: "Strateji ekibinin çalışmaları üç temel alanda ilerliyor:\n\n📌 Stratejik Planlama: Hedefleri belirler.\n🤝 Stratejik Hizalanma: Ekipleri ortak hedeflerde buluşturur.\n📊 Stratejik PMO: Stratejik projeleri takip eder ve raporlar.\n\nBöylece strateji yalnızca bir plan olarak kalmaz, gerçek projelere dönüşür."
            },
            {
                title: "Vizyon, Strateji ve Hedef Aynı Şey mi? 🔭",
                text: "Aslında üçü farklı sorulara cevap verir: Vizyon (Gelecekte nerede olmak istiyoruz?), Hedef (Neyi başarmamız gerekiyor?), Strateji (Bu hedefe nasıl ulaşacağız?). Doğru bir yol haritası oluşturmak için üçünün de birbiriyle uyumlu olması gerekir."
            },
            {
                title: "Önce Neredeyiz? 🔎",
                text: "Strateji oluşturmadan önce şirketin mevcut durumunu anlamamız gerekiyor. Bunun için SWOT analizi ile güçlü ve zayıf yönlerin yanında dış dünyadaki fırsat ve tehditler değerlendirilir. Ekonomik koşullar, rakipler ve yapay zekâ bu analizin bir parçasıdır."
            },
            {
                title: "FLO Bugün Nerede? 🌍",
                text: "FLO kendisini çok kanallı, çok markalı ve dijital odaklı güçlü bir ekosistem olarak değerlendiriyor. Bu yapının içerisinde mağazacılıktan e-ticarete, ürün geliştirmeden tedarik zincirine kadar birçok yetkinlik birlikte çalışıyor."
            },
            {
                title: "Peki Nasıl İlerleyeceğiz? 🚀",
                text: "FLO'nun değer odaklı iş modeli şu sütunlara dayanır: Değer Odaklı Ürün/Marka Yönetimi, Çevik Tedarik Zinciri, Dayanıklı Satış Platformları, Müşteri Odaklılık, Kurumsal Dönüşüm ve Etkin Finansal Yönetim."
            },
            {
                title: "Teknoloji Stratejinin Neresinde? 🤖",
                text: "Teknoloji yalnızca IT departmanının konusu değil! Veri, dijital yetkinlikler ve yapay zekâ destekli içgörüler, daha hızlı karar almak ve şirketin çevikliğini artırmak için kurumsal stratejinin merkezinde yer alıyor."
            },
            {
                title: "Strateji Bir Ev Gibidir! 🏠",
                text: "FLO stratejisi bir ev modeli gibidir:\n\n🏠 Çatı: Vizyon\n📈 Üst kat: Finansal hedefler\n🏛️ Kolonlar: Stratejik öncelikler\n🧱 Temel: Kurumsal Operasyon Modeli\n\nTemel sağlam değilse kolonlar, kolonlar sağlam değilse çatı ayakta kalamaz!"
            },
            {
                title: "Son Kutu — Stratejiyi Sen Oluştur! 🧩",
                text: "Şimdi sıra sende! Sana Vizyon, SWOT, Hedef ve Stratejik Aksiyon kartları vereceğim. Doğru parçaları doğru sıraya yerleştirerek şirketin yol haritasını oluşturabilir misin?",
                isLast: true,
                btnText: "🧭 Stratejiyi Oluştur →"
            }
        ],
        gameTitle: "Stratejik Planlama & Yol Haritası Simülasyonu",
        gameDesc: "Strateji ve İş Geliştirme dünyasına hoş geldin! Yakında SWOT analizi, strateji evi modelleme, stratejik PMO ve vizyoner yol haritası kurguları simülasyonunu burada oynayacaksın.",
        hotspots: [
            {
                id: 'strateji_evi',
                icon: '🏠',
                title: 'Strateji Evi (Vizyon, Kolonlar, Temel)',
                desc: 'Şirketin vizyonunu çatıya, operasyonel modeli temele alan ve stratejik öncelikleri kolonlarla taşıyan kurumsal mimari.',
                left: '21%', top: '34%'
            },
            {
                id: 'swot_analizi',
                icon: '🔎',
                title: 'SWOT & Dış Pazar Analizi',
                desc: 'Küresel trendler, makroekonomik dinamikler, rakip adımları ve şirket içi yetkinliklerin değerlendirildiği analiz merkezi.',
                left: '27%', top: '48%'
            },
            {
                id: 'stratejik_pmo',
                icon: '📊',
                title: 'Stratejik PMO & Portföy Yönetimi',
                desc: 'Stratejik inisiyatiflerin bütçe, takvim ve KPI çıktılarıyla üst yönetime raporlandığı proje yönetim ofisi.',
                left: '65%', top: '37%'
            },
            {
                id: 'stratejik_hizalanma',
                icon: '🤝',
                title: 'Stratejik Hizalanma & Hedefler',
                desc: 'Genel merkezden mağazalara kadar tüm birimlerin tek bir ortak şirket vizyonunda ve hedeflerde buluşması sağlanır.',
                left: '75%', top: '52%'
            },
            {
                id: 'ekosistem_buyume',
                icon: '🌍',
                title: 'FLO Ekosistemi & Değer Odaklılık',
                desc: 'Çok markalı ve çok kanallı perakende ekosisteminde sürdürülebilir kârlılık ve küresel büyüme planları kurgulanır.',
                left: '43%', top: '61%'
            }
        ]
    },
    17: {
        id: 17,
        code: 'kurumsal_iletisim_surdurulebilirlik',
        family: 'insan',
        gameComponent: 'branching',
        taskSummary: 'Bir kriz karşısında bilgiyi doğrulayıp güven veren iletişim kararları al.',
        title: 'Kurumsal İletişim & Sürdürülebilirlik',
        isAvailable: true,
        image: 'assets/rooms/oda17.webp',
        characterTitle: '🌱 İletişim & Sürdürülebilirlik Lideri',
        dialogues: [
            {
                title: "İletişim ve Etki Odasına Hoş Geldin! 🌱",
                text: "Merhaba! 👋 Bir şirket yalnızca ürünleriyle değil; çalışanlarıyla, toplumla ve çevreyle kurduğu ilişkiyle de değer yaratır. Bu odada FLO’nun iletişimden sürdürülebilirliğe uzanan çalışmalarını keşfedeceğiz!"
            },
            {
                title: "Burada Neler Yapılıyor? 🧩",
                text: "Ekibimiz dört temel alanda çalışıyor:\n\n📣 Kurumsal İletişim\n👥 İşveren Markası & İç İletişim\n🌱 Sürdürülebilirlik\n🤝 Kurumsal Sosyal Sorumluluk\n\nFarklı görünseler de hepsinin ortak noktası güçlü ve sürdürülebilir bir değer oluşturmak!"
            },
            {
                title: "Kurumsal İletişim 📣",
                text: "FLO’nun çalışanlar, medya, iş ortakları ve diğer paydaşlarla kurduğu iletişim stratejik olarak yönetiliyor. Amaç: Kurumsal itibarı güçlendirmek, tutarlı ve şeffaf iletişim kurmak, şirketin çalışmalarını doğru şekilde anlatmak."
            },
            {
                title: "İşveren Markası Nedir? 👥",
                text: "Bir şirket müşterileri için bir marka olduğu kadar çalışanları için de bir markadır! FLO’nun şirket kültürü ve çalışan deneyimi hem mevcut çalışanlara hem de adaylara aktarılıyor. FLOConnect gibi iç iletişim platformlarıyla da çalışan bağlılığı destekleniyor."
            },
            {
                title: "Sürdürülebilirlik Sadece Çevre mi? 🌍",
                text: "Hayır! 🌱 FLO sürdürülebilirliği çevresel, sosyal ve yönetişim (ESG) boyutlarıyla ele alıyor. ESG performansı takip ediliyor, çevresel hesaplamalar yapılıyor ve sürdürülebilirlik raporları hazırlanıyor."
            },
            {
                title: "İlk Sürdürülebilirlik Raporu! 📗",
                text: "FLO Group sürdürülebilirlik çalışmalarını bir araya getirerek ilk sürdürülebilirlik raporunu yayımladı. Farklı çalışma grupları Yönetim Komitesi etrafında entegre şekilde çalışıyor."
            },
            {
                title: "Sosyal Sorumluluk Nasıl Oluşuyor? 🤝",
                text: "Bir sosyal sorumluluk projesi sadece 'bir etkinlik yapalım' demek değildir. Sosyal etki alanı belirlenir, proje geliştirilir, iş birlikleri kurulur, hayata geçirilir ve oluşturduğu etki ölçülür."
            },
            {
                title: "Gönüllülük de Bunun Bir Parçası! 🧡",
                text: "Sosyal sorumluluk çalışmalarında farklı kurumlarla iş birlikleri kuruluyor ve gönüllülük faaliyetleri gerçekleştiriliyor: Çevre çalışmaları, toplumsal destekler ve çalışan gönüllülüğü projeleri."
            },
            {
                title: "Son Kutu — Etkiyi Birlikte Oluşturalım! 🌎",
                text: "Artık ekibin neler yaptığını biliyorsun! Şimdi çalışmaları doğru alanla eşleştirerek (Kurumsal İletişim, İşveren Markası, Sürdürülebilirlik, Sosyal Sorumluluk) FLO’nun Etki Haritasını tamamla!",
                isLast: true,
                btnText: "🌱 Etki Haritasını Başlat →"
            }
        ],
        gameTitle: "Kurumsal İletişim & Sürdürülebilirlik Simülasyonu",
        gameDesc: "İletişim ve Sürdürülebilirlik dünyasına hoş geldin! Yakında ESG raporlama, işveren markası, iç iletişim (FLOConnect) ve sosyal sorumluluk etki haritası simülasyonunu burada oynayacaksın.",
        hotspots: [
            {
                id: 'kurumsal_iletisim',
                icon: '📣',
                title: 'Kurumsal İletişim & İtibar Yönetimi',
                desc: 'Medya ilişkileri, kurumsal duyurular ve şirket itibarını güçlendiren stratejik iletişim çalışmaları yürütülür.',
                left: '21%', top: '34%'
            },
            {
                id: 'isveren_markasi',
                icon: '👥',
                title: 'İşveren Markası & FLOConnect',
                desc: 'Şirket kültürü, aday deneyimi ve FLOConnect platformu üzerinden kurum içi çalışan bağlılığı geliştirilir.',
                left: '27%', top: '48%'
            },
            {
                id: 'esg_surdurulebilirlik',
                icon: '🌱',
                title: 'ESG & Sürdürülebilirlik Raporlaması',
                desc: 'Karbon ayak izi hesaplamaları, atık yönetimi ve FLO sürdürülebilirlik raporunun hazırlanması koordine edilir.',
                left: '65%', top: '37%'
            },
            {
                id: 'sosyal_sorumluluk',
                icon: '🤝',
                title: 'Sosyal Sorumluluk & Etki Analizi',
                desc: 'Toplumsal fayda yaratan uzun vadeli sosyal projeler kurgulanır ve sağlanan fayda ölçülür.',
                left: '75%', top: '52%'
            },
            {
                id: 'calisan_gonulluluk',
                icon: '🧡',
                title: 'Çalışan Gönüllülüğü & Sivil Toplum',
                desc: 'STK iş birlikleri, çevre temizliği ve eğitim destekleri gibi saha gönüllülük faaliyetleri organize edilir.',
                left: '43%', top: '61%'
            }
        ]
    },
    18: {
        id: 18,
        code: 'mimari_proje_uygulama',
        family: 'yaratıcı',
        gameComponent: 'timeline',
        taskSummary: 'Mağaza açılış aşamalarını sırala ve sürelerini planla.',
        title: 'Mimari Proje ve Uygulama',
        isAvailable: true,
        image: 'assets/rooms/oda18.webp',
        characterTitle: '🏗️ Mimari & Konsept Direktörü',
        dialogues: [
            {
                title: "Mimari Departmana Hoş Geldin! 🏗️",
                text: "Merhaba! 👋 Bir FLO mağazasının nasıl ortaya çıktığını hiç düşündün mü? Burada bir mağazanın ilk projesinden açılışına, hatta sonrasındaki bakım ve tadilatına kadar uzanan mimari süreci yönetiyoruz."
            },
            {
                title: "Üç Ekip, Bir Mağaza! 🏢",
                text: "Mimari süreçte üç temel ekip birlikte çalışıyor:\n\n📐 Mimari Proje ve Konsept → Tasarlar ve projelendirir.\n👷 Mimari Uygulama, Süreç ve Bütçe → Projeyi sahada hayata geçirir.\n🔧 Bakım Onarım ve Teknik Hizmet → Mağazanın teknik ihtiyaçlarını yönetir.\n\nYani işimiz mağazayı çizmekle bitmiyor!"
            },
            {
                title: "Her Şey Bir Mağaza Bilgisiyle Başlıyor! 📍",
                text: "Yeni mağaza süreci Kiralama Departmanından gelen bilgiyle başlıyor. Ardından mağazanın konsepti, yerleşimi ve kapasitesi planlanıyor; gerekli proje ve onay süreçleri tamamlanıyor. Bu projelendirme süreci yaklaşık 25 iş günü sürebiliyor!"
            },
            {
                title: "Çizimden Gerçek Mağazaya! 👷",
                text: "Proje onaylandı, şimdi sıra uygulamada! Mağaza teslim alınıyor → şantiye başlıyor → gerekli siparişler planlanıyor → saha kontrolleri yapılıyor → mağaza operasyona teslim ediliyor. Bu uygulama süreci yaklaşık 47–55 gün sürüyor ve sonunda mağaza açılıyor! 🎉"
            },
            {
                title: "Her Marka Aynı Görünmez! 🎨",
                text: "FLO Group'taki her markanın kendine özgü bir mağaza kimliği var:\n\n🌿 Lumberjack → Nature\n👟 InStreet → V1, V2, V2.5\n🟠 FLO → Yüksek Beyaz, City, V2\n✨ Nine West → Yeni Konsept\n🔺 Reebok → Motion, FitHub 2.0, FitHub 3.0\n\nKonseptler zamanla geliştirilip yenilenebiliyor."
            },
            {
                title: "Mağaza Açıldı, İşimiz Bitti mi? 🔧",
                text: "Tabii ki hayır! Mevcut mağazalarda tadilat, mobilya, elektrik, mekanik, aydınlatma ve diğer teknik ihtiyaçlar oluşabiliyor. Mağazadan bir ticket açılıyor, talep değerlendiriliyor, maliyet ve onay süreçlerinden sonra ilgili teknik ekip yönlendiriliyor."
            },
            {
                title: "Tasarım + Bütçe + Operasyon 🤝",
                text: "Bir mağaza tasarlarken yalnızca güzel görünmesine bakmıyoruz. Konsept, yerleşim, kapasite, maliyet, bütçe, teknik gereksinimler ve operasyon ihtiyaçları birlikte değerlendiriliyor. Bu yüzden Mimari Departman birçok farklı ekiple koordineli çalışıyor."
            },
            {
                title: "Son Kutu — Mağazayı Açabilir misin? 🎮",
                text: "Şimdi boş bir mağazayı sana teslim ediyoruz! 🔑\n\nProjelendirme → Konsept → Yerleşim → Onay → Şantiye → Operasyona Teslim → Açılış\n\nadımlarını doğru sıraya getir ve mağazayı müşteriler için hazırla!",
                isLast: true,
                btnText: "🏗️ Mağazayı Tasarla →"
            }
        ],
        gameTitle: "Mağaza Mimari Tasarım & Şantiye Simülasyonu",
        gameDesc: "Mimari Departman dünyasına hoş geldin! Yakında mağaza projelendirme (25 gün), şantiye uygulaması (55 gün), marka konsept seçimi ve teknik servis süreçleri simülasyonunu burada oynayacaksın.",
        hotspots: [
            {
                id: 'mimari_proje',
                icon: '📐',
                title: 'Mimari Proje & 3D Konsept Çizimi',
                desc: 'Mağaza metrekareleri, tavan yükseklikleri ve ürün yerleşim planları mimari CAD/3D yazılımlarıyla projelendirilir.',
                left: '21%', top: '34%'
            },
            {
                id: 'santiye_uygulama',
                icon: '👷',
                title: 'Şantiye & Saha Uygulama Yönetimi',
                desc: 'Yaklaşık 50 günlük şantiye sürecinde zemin, aydınlatma, mobilya montajı ve iş güvenliği denetimleri yürütülür.',
                left: '27%', top: '48%'
            },
            {
                id: 'marka_konseptleri',
                icon: '🎨',
                title: 'Marka Konseptleri (FLO, InStreet, Reebok)',
                desc: 'Lumberjack Nature, InStreet V2, Nine West ve Reebok FitHub gibi her markaya özgü görsel mağaza kimlikleri tasarlanır.',
                left: '65%', top: '37%'
            },
            {
                id: 'bakim_teknik',
                icon: '🔧',
                title: 'Bakım, Onarım & Teknik Hizmetler',
                desc: 'Açık mağazalardan gelen aydınlatma, iklimlendirme ve mobilya ticket talepleri teknik ekiplerce hızla çözülür.',
                left: '75%', top: '52%'
            },
            {
                id: 'butce_kapasite',
                icon: '📊',
                title: 'Maliyet, Bütçe & Metrekare Planlama',
                desc: 'Şantiye metrekare maliyetleri, mobilya satın alma bütçeleri ve kiralama onay süreçleri koordine edilir.',
                left: '43%', top: '61%'
            }
        ]
    },
    19: {
        id: 19,
        code: 'mali_isler',
        family: 'analitik',
        gameComponent: 'matching',
        taskSummary: 'Beş görevi CFO ekibindeki doğru birimlere yönlendir.',
        title: 'Mali İşler ve Finans',
        isAvailable: true,
        image: 'assets/rooms/oda19.webp',
        characterTitle: '💰 CFO & Mali İşler Direktörü',
        dialogues: [
            {
                title: "Mali İşler Odasına Hoş Geldin! 💰",
                text: "Merhaba! 👋 Binlerce ürünün satıldığı, mağazaların ve e-ticaretin aynı anda çalıştığı büyük bir perakende şirketinde bütün finansal süreçlerin nasıl yönetildiğini hiç düşündün mü? Bu odada Mali İşler dünyasını keşfedeceğiz!"
            },
            {
                title: "Perakende Sadece Mağaza Değil! 🛍️",
                text: "Günümüzde perakende yalnızca mağazada ürün satmaktan oluşmuyor. Depo ve lojistik, e-ticaret, iade süreçleri, veri ve analitik, mobil ticaret gibi birçok alan aynı ekosistemin parçası. Bu büyüklük, finansal süreçlerin de dikkatli şekilde yönetilmesini gerektiriyor."
            },
            {
                title: "Perakende Sürekli Değişiyor! 🔄",
                text: "Teknoloji, e-ticaret, sürdürülebilirlik ve değişen müşteri beklentileri perakendenin çalışma biçimini değiştiriyor. Bu değişimler aynı zamanda şirketlerin yatırım, maliyet ve bütçe kararlarını da etkiliyor. Yani sektördeki değişimi Mali İşler de yakından takip etmek zorunda!"
            },
            {
                title: "CFO'nun Ekibini Tanıyalım! 🧩",
                text: "FLO Group'ta CFO'ya bağlı farklı uzmanlık alanları bulunuyor:\n\n📊 Bütçe ve Raporlama\n🏦 Finans\n⚖️ Hukuk\n🧾 Muhasebe\n🛒 Satın Alma ve Destek Hizmetleri\n🤝 Yatırımcı İlişkileri"
            },
            {
                title: "Bütçe mi, Gerçekleşen mi? 📊",
                text: "Bütçe ve Raporlama tarafında şirketin finansal planları oluşturuluyor ve sonuçlar takip ediliyor. Planlanan değerlerle gerçekleşen sonuçlar karşılaştırılarak şirketin performansı değerlendirilebiliyor: Planla → Takip Et → Karşılaştır → Raporla!"
            },
            {
                title: "Para Akışı Nasıl Yönetiliyor? 🏦",
                text: "Satışlardan para geliyor ama aynı anda tedarikçi ödemeleri, mağaza giderleri ve birçok farklı finansal işlem gerçekleşiyor. Finans tarafı şirketin bu finansal operasyonlarının yönetilmesinde önemli rol oynuyor. Para akışının doğru planlanması kritik!"
            },
            {
                title: "Her İşlem Kayıt Altında! 🧾",
                text: "Muhasebe tarafında şirketin mali hareketlerinin düzenli şekilde kayıt altında tutulması gerekiyor. Satışlar, faturalar, giderler ve diğer finansal işlemler doğru kayıtlarla takip ediliyor. Çünkü doğru veri olmadan doğru finansal karar vermek de mümkün değil!"
            },
            {
                title: "Teknoloji Mali İşlerde de Var! 💻",
                text: "Milyonlarca işlemin bulunduğu bir şirkette finansal süreçlerin yalnızca elle takip edilmesi düşünülemez. Finansal verilerin toplanması, raporlanması ve analiz edilmesi, büyük ölçekli bilgi sistemlerinin önemli kullanım alanlarından biri."
            },
            {
                title: "Son Kutu — CFO'nun Ekibini Yönet! 🎮",
                text: "Şimdi beş görev sana geliyor!\n\n“Yıllık bütçeyi takip et”\n“Finansal işlemi kaydet”\n“Şirketin nakit süreçlerini yönet”\n“Bir satın alma sürecini değerlendir”\n“Sözleşmenin hukuki uygunluğunu incele”\n\nHer görevi doğru Mali İşler birimine yönlendirebilir misin?",
                isLast: true,
                btnText: "💰 Finans Görevini Başlat →"
            }
        ],
        gameTitle: "Mali İşler & CFO Ekibi Simülasyonu",
        gameDesc: "Mali İşler ve Finans dünyasına hoş geldin! Yakında bütçe planlama vs. gerçekleşen analizi, nakit akışı yönetimi, fatura/muhasebe kayıtları ve satın alma onay simülasyonunu burada oynayacaksın.",
        hotspots: [
            {
                id: 'butce_raporlama',
                icon: '📊',
                title: 'Bütçe & Finansal Raporlama',
                desc: 'Yıllık bütçe hedefleri, çeyreklik gerçekleşen karşılaştırmaları ve şirketin kârlılık performans göstergeleri analiz edilir.',
                left: '21%', top: '34%'
            },
            {
                id: 'hazine_nakit',
                icon: '🏦',
                title: 'Finans & Hazine Yönetimi',
                desc: 'Banka ilişkileri, nakit akış tabloları, kur riskleri ve şirket içi fonlama operasyonları yönetilir.',
                left: '27%', top: '48%'
            },
            {
                id: 'muhasebe_kayit',
                icon: '🧾',
                title: 'Genel Muhasebe & Vergi',
                desc: 'Tüm mağaza ve e-ticaret satışları, faturalar, vergi beyannameleri ve yasal mali tablolar kayıt altına alınır.',
                left: '65%', top: '37%'
            },
            {
                id: 'satin_alma_destek',
                icon: '🛒',
                title: 'Kurumsal Satın Alma & İdari İşler',
                desc: 'Tedarikçi sözleşmeleri, genel merkez/mağaza alımları ve operasyonel destek hizmetleri koordine edilir.',
                left: '75%', top: '52%'
            },
            {
                id: 'hukuk_yatirimci',
                icon: '⚖️',
                title: 'Hukuk & Yatırımcı İlişkileri',
                desc: 'Kurumsal sözleşmeler, yasal uyumluluk ve paydaş/yatırımcı bilgilendirme süreçleri takip edilir.',
                left: '43%', top: '61%'
            }
        ]
    },
    0: {
        id: 0,
        code: 'lounge',
        title: 'Ortak Çalışma Alanı (Lounge)',
        isAvailable: false,
        comingSoonText: 'FLO çalışanlarının kahve molası verip fikir alışverişinde bulunduğu ortak alan. Çok yakında burada sohbet edebileceksin!'
    }
};

departmentsData[20] = {
    id: 20, code: 'lojistik', family: 'analitik', gameComponent: 'routing',
    title: 'Lojistik Direktörlüğü', isAvailable: true,
    image: 'assets/rooms/oda20.webp', characterTitle: '🚚 Lojistik Direktörü',
    taskSummary: 'Beş sevkiyat senaryosunun her birini doğru depo/nakliye sağlayıcısına yönlendir.',
    gameTitle: 'Sevkiyat Yönlendirme',
    gameDesc: 'Sevkiyat masasındaki güzergâhları incele ve beş sevkiyattan en az dördünü doğru yönlendir.',
    dialogues: [
        {title: 'Lojistik Dünyasına Hoş Geldin! 📦', text: 'Merhaba! 👋\n\nBir ayakkabının depodan çıkıp doğru mağazaya, doğru zamanda nasıl ulaştığını hiç düşündün mü?\n\nBurada milyonlarca ürünün depolanması, hazırlanması, taşınması ve teslim edilmesi için büyük bir operasyon yürütülüyor!'},
        {title: 'Lojistik Sadece Nakliye Değil! 🚚', text: 'Lojistik Direktörlüğünde üç temel operasyon alanı bulunuyor:\n\n📦 Sezon Depo Operasyonları\n↩️ İade Depo Operasyonları\n🚛 Nakliye Operasyonları\n\nYani ürünün depoya girişinden mağazaya ulaşmasına, hatta geri dönmesine kadar tüm yolculuk yönetiliyor.'},
        {title: 'Milyonlarca Ürün, Büyük Bir Operasyon! 🏭', text: 'Sezon depolarında yılda 79 milyondan fazla ürün hareketi gerçekleşiyor!\n\nOperasyon; 4 depo, yaklaşık 420 personel ve 36 bin m² depo alanıyla yürütülüyor.\n\nBu ölçekte doğru stok ve depo yönetimi kritik önem taşıyor.'},
        {title: 'Ürün Geri Gelirse Ne Oluyor? ↩️', text: 'Lojistik yolculuğu her zaman mağazada bitmiyor!\n\nİade operasyonlarında yılda 7 milyondan fazla ürün hareketi ayrı bir depo sistemi içerisinde yönetiliyor.\n\nBöylece geri dönen ürünler de kontrollü bir lojistik sürecinden geçiyor.'},
        {title: 'Şimdi Yola Çıkıyoruz! 🚛', text: 'Nakliye tarafında 5.400 teslimat noktası, 30 aktarma noktası ve farklı lojistik iş ortakları bulunuyor.\n\nYılda 47 milyondan fazla ürün hareketinin gerçekleştiği bu yapıda ürünlerin doğru noktaya verimli şekilde ulaştırılması gerekiyor.'},
        {title: 'En İyi Rotayı Bul! 🗺️', text: "Lojistikte sadece ürünü ulaştırmak değil, nasıl ulaştırdığın da önemli.\n\nRota optimizasyonu, direkt gönderim ve farklı depo modelleriyle gereksiz taşıma azaltılabilir.\n\nŞanlıurfa Fabrika Lojistik Merkezi projesinde de bazı ürünlerin İstanbul'a gitmeden doğrudan mağazalara ve Ortadoğu sevkiyatlarına yönlendirilmesi hedefleniyor."},
        {title: 'Lojistik + Yazılım = FLO Kargom 💻📦', text: 'Lojistik süreçleri teknolojiyle de destekleniyor!\n\nFLO Kargom, IT ile birlikte geliştirilen web tabanlı bir sistem projesi. Kargo firmalarıyla entegrasyon ve test süreçlerinin ardından lojistik operasyonlarının daha:\n\nKontrol edilebilir • İzlenebilir • Raporlanabilir • Geliştirilebilir\n\nhale getirilmesi amaçlanıyor.'},
        {title: 'Lojistikte Veri Konuşur! 📊', text: "Bir operasyonun iyi çalışıp çalışmadığını nasıl anlayacağız?\n\nKPI'larla!\n\nMal kabul süresi, sipariş hazırlama, mal çıkış performansı, koli doluluk oranı, stok doğruluğu ve depo kapasitesi gibi göstergeler düzenli olarak takip ediliyor."},
        {title: 'Sürekli Daha İyisi! ⚙️', text: 'Lojistik ekipleri günlük operasyonların yanında süreç geliştirme projeleri de yürütüyor.\n\nSunumda 34 proje bulunuyor:\n\n10 tamamlandı ✅ • 18 devam ediyor 🔄 • 6 planlanıyor 📝\n\nProjeler; verimlilik, maliyet tasarrufu ve dijital dönüşüm alanlarında gerçekleştiriliyor. Bilinen toplam maliyet tasarrufu ise yaklaşık 263 milyon TL olarak gösterilmiş.'},
        {title: 'Son Kutu — Sevkiyatı Sen Yönet! 🎮', text: 'Bir mağazanın acil ürün ihtiyacı var! 🚨\n\nÜrünü doğru depodan çıkar, en uygun rotayı belirle ve mağazaya zamanında ulaştır.\n\nAma dikkat: gereksiz aktarma = daha fazla süre ve maliyet!', isLast: true, btnText: '🚚 Sevkiyatı Başlat →'}
    ],
    hotspots: [
        {id: 'sezon_depo', icon: '📦', title: 'Sezon Depo Operasyonları', desc: 'Ürünlerin depolanması, sipariş hazırlama ve mal çıkış süreçleri yönetilir.', left: '21%', top: '34%'},
        {id: 'iade_depo', icon: '↩️', title: 'İade Depo Operasyonları', desc: 'Geri dönen ürünler ayrı bir depo sistemi içinde kontrollü olarak işlenir.', left: '27%', top: '48%'},
        {id: 'nakliye', icon: '🚛', title: 'Nakliye Operasyonları', desc: 'Depo ve mağazalar arasındaki sevkiyatlar doğru lojistik iş ortağına yönlendirilir.', left: '65%', top: '37%'},
        {id: 'flo_kargom', icon: '💻', title: 'FLO Kargom', desc: 'IT ile geliştirilen web tabanlı proje, lojistik süreçlerinin izlenmesini ve raporlanmasını desteklemeyi amaçlar.', left: '75%', top: '52%'},
        {id: 'lojistik_kpi', icon: '📊', title: 'Lojistik Performansı', desc: 'Stok doğruluğu, depo kapasitesi ve koli doluluk oranı gibi KPI’lar takip edilir.', left: '43%', top: '61%'}
    ]
};
