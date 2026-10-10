// Six short, authored dialogue cards per department; full reference material remains in hotspots.
(() => {
    const lessons = {
        1: ['İK, işe alımın yanında eğitim ve çalışan deneyimini de yönetir.', 'Adayları aynı ölçütlerle değerlendir; ilk izlenim tek başına yeterli değildir.', 'Analitik beceri ve ekip uyumunu görüşmede somut örneklerle araştır.'],
        2: ['Ürün yönetimi; tasarım, fiyat ve satış kararlarını birleştirir.', 'Her ürün için müşterinin ihtiyacına uygun bir aksiyon seç.', 'Satış, stok ve kârlılık verilerini birlikte değerlendir.'],
        3: ['Kategori ekibi, doğru ürünleri doğru müşteriyle buluşturur.', 'Ürünleri özelliklerine göre uygun gruplara ayır.', 'Süreyi takip et; hızlı karar verirken ürün özelliklerini atlama.'],
        4: ['Mağazaların ihtiyacı ve raf kapasitesi birbirinden farklıdır.', 'Sınırlı stoğu, ihtiyacı ve çift başına katkıyı birlikte düşünerek dağıt.', 'Rafı doldurmak tek hedef değil; talebi karşılayan dağıtım önemlidir.'],
        5: ['Tedarik zinciri, tasarım onayından sevkiyata uzanır.', 'Bir aşama tamamlanmadan ona bağlı aşama başlayamaz.', 'Üretim akışındaki adımları doğru sıraya koy.'],
        6: ['Sistem stoğu, satış ve transfer kayıtlarıyla değişir.', 'Sayım farkını düzeltmeden önce işlemlerin nedenini araştır.', 'Her satırda doğru stok miktarını ve farkın nedenini seç.'],
        7: ['Malzeme seçimi ürünün dayanıklılığını ve çevresel etkisini değiştirir.', 'Etiketleri incele; sürdürülebilirlik iddiasını kanıtlarla değerlendir.', 'Malzemeyi kullanım ihtiyacına göre seç.'],
        8: ['Her siparişin teslim sözü ve ihtiyaç duyduğu stok farklıdır.', 'Gönderdiğin ürünler, seçilen noktanın stok ve paketleme hakkını azaltır.', 'Acil siparişler için hızlı noktaların kapasitesini koru.'],
        9: ['Vitrindeki alanlar aynı görünürlüğe sahip değildir.', 'Stok, müşteri ilgisi ve iade oranını birlikte değerlendir.', 'Üç farklı ürünü seç; en güçlü ürüne daha görünür alanı ver.'],
        10: ['Her pazarın müşterisi ve beklentileri farklıdır.', 'Aynı ürün veya kampanya her ülkede aynı sonucu vermez.', 'Verilen ülke bilgilerine göre yerel kararlar al.'],
        11: ['İyi kampanya, hedef kitleye uygun mesajla başlar.', 'Kanalı ve mesajı kampanya amacıyla eşleştir.', 'Başarıyı yalnızca görünürlükle değil, hedeflenen sonuçla değerlendir.'],
        12: ['İyileştirme, iş akışındaki israfı kanıtlarla bulmakla başlar.', 'Her çalışma noktasını incele; israf türünü seç.', 'Sorunun nedenine uygun çözümü uygula. Sadece tıklamak puan getirmez.'],
        13: ['Sprint, küçük yazılım işlerini geliştirip test ederek yayınlama planıdır.', 'Akış: İş listesi → Geliştirme → Test → Yayında.', 'İki iş geliştirilebilir, bir iş test edilebilir. Gün düğmesi süreleri ilerletir.'],
        14: ['Yapay zekâ aracı, görev ve veri ihtiyacına göre seçilir.', 'Her problem aynı model veya otomasyonla çözülmez.', 'Gizlilik, doğrulama ve insan kontrolünü kararına dahil et.'],
        15: ['Müşteri deneyimi, müşterinin ihtiyacını anlamakla başlar.', 'Davranış ve geri bildirimleri birlikte değerlendir.', 'Müşteri profiline uygun iletişim ve hizmet yaklaşımını seç.'],
        16: ['SWOT, güçlü ve zayıf yönlerle fırsat ve tehditleri ayırır.', 'Güçlü ve zayıf yönler kurum içinden; fırsat ve tehditler dışarıdan gelir.', 'Kartları kaynağına ve etkisine göre sınıflandır.'],
        17: ['Kurumsal iletişimde doğru bilgi ve zamanlama birlikte önemlidir.', 'Krizde doğrulanmamış bilgi paylaşma; etkilenen kişileri düşün.', 'Şeffaf ve uygulanabilir iletişim kararları al.'],
        18: ['Mağaza açılışı, birbirine bağlı şantiye işlerinden oluşur.', 'İki ekibi planla; uygun işleri paralel yürüt.', 'Güvenlik kontrolünü tamamlamadan açılışa geçemezsin.'],
        19: ['Finans ekibi, kaynakları önceliklere göre planlar.', 'Bütçe toplamını korurken ekiplerin ihtiyacını değerlendir.', 'Dağılımını senaryoda verilen hedeflerle karşılaştır.'],
        20: ['Her araç belirli çıkış noktası ve güzergâhta çalışır.', 'Kolileri uygun araca yükle; palet kapasitesini aşma.', 'Aynı güzergâhtaki yükleri birleştirerek sefer sayısını azalt.']
    };
    for (const [id, texts] of Object.entries(lessons)) {
        const dept = departmentsData[id];
        const points = [['22%','29%'],['29%','53%'],['76%','38%'],['83%','65%'],['43%','76%']];
        dept.hotspots.forEach((spot,i)=>{spot.left=points[i][0];spot.top=points[i][1];});
        dept.image = `assets/rooms/cozy/oda${id}.webp`;
        dept.dialogues = [
            {title:'Hoş geldin!', text:`${dept.title} odasındasın. Birlikte ekibin işini keşfedelim.`},
            ...texts.map((text, i) => ({title:['Ekibin işi','Neye dikkat etmeli?','Birlikte deneyelim'][i],text})),
            {title:'Odayı keşfet',text:'Nesnelere dokunarak kısa bilgi kartlarını açabilirsin. Keşfet düğmesi tüm noktaları listeler.'},
            {title:'Görev zamanı',text:dept.taskSummary,isLast:true,btnText:'🎮 Oyuna Başla →'}
        ];
    }
})();
