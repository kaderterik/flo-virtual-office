const journey = (() => {
    const dialog = document.getElementById('journey-dialog');
    const content = document.getElementById('journey-content');
    const title = document.getElementById('journey-title');
    const families = {insan: 'İnsan ve iletişim', ticari: 'Ticari', teknoloji: 'Teknoloji', yaratıcı: 'Yaratıcı', analitik: 'Analitik'};
    const escape = value => String(value).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
    let completed = [], certificate = null, returnFocus = null;
    const total = () => Object.keys(departmentGames).length;
    function refresh(ids) {
        completed = [...new Set(ids)].filter(id => departmentGames[id]);
        document.querySelectorAll('[data-journey="recommendation"]').forEach(button => { button.hidden = completed.length < 5; });
    }
    function open(view) {
        dialog.classList.toggle('is-certificate', view === 'certificate');
        if (!dialog.open) returnFocus = document.activeElement;
        title.textContent = view === 'settings' ? 'Yolculuğu Sıfırla' : view === 'notes' ? 'Staj Defterim' : view === 'certificate' ? 'Yolculuk Sertifikam' : "Fillo'nun Önerisi";
        content.replaceChildren();
        if (view === 'settings') {
            content.innerHTML = `<p>Bu tarayıcıdaki ${completed.length} rozet, görev skorları ve staj defteri notları silinecek. Bu işlem geri alınamaz.</p><div class="mg-choices"><button type="button" data-reset-progress class="mg-primary">Evet, Yolculuğu Sıfırla</button><button type="button" data-journey="notes">Vazgeç</button></div><p id="reset-status" role="status"></p>`;
        } else if (view === 'notes') showNotes();
        else if (view === 'certificate') showCertificate();
        else showRecommendation();
        if (!dialog.open) dialog.showModal();
        dialog.scrollTop = 0;
        document.getElementById('journey-close').focus();
    }
    function showRecommendation() {
        const result = journeyData.recommendation(completed);
        if (!result.ready) {
            content.innerHTML = `<div class="journey-ending"><div>${GameArt.elephant('idle')}</div><section><p class="mg-eyebrow">Keşif devam ediyor</p><h3>Henüz yeterli veri yok.</h3>
                <p>Birkaç oda daha keşfet! Öneri için en az 5 tamamlanmış departmanın skoru gerekiyor. Şu an ${result.count}/5 kayıtlı sonuç var.</p>
                ${completed.length > result.count ? '<p>Eski rozetlerin korundu. Skoru bulunmayan görevleri yeniden oynayarak öneriye ekleyebilirsin.</p>' : ''}</section></div>`;
            return;
        }
        const top = departmentsData[result.strongest];
        content.innerHTML = `<div class="journey-ending"><div>${GameArt.elephant('happy')}</div><section><p class="mg-eyebrow">${completed.length === total() ? 'Yolculuk tamamlandı' : 'Yolculuğundan ilk izler'}</p>
            <h3>Fillo, senin oyun profiline göre ${escape(families[result.winner.family])} departmanlarında çok mutlu olurdu!</h3>
            <p><strong>En güçlü olduğun alan: ${escape(top.title)}</strong></p>
            <p>${result.count} tamamlanmış görevin en iyi kayıtlı sonuçları karşılaştırıldı. Keşfettikçe önerin değişebilir.</p>
            ${result.tiedFamilies.length > 1 ? `<p class="journey-tie">Aynı ortalamaya sahip alanlar: ${result.tiedFamilies.map(v => escape(families[v.family])).join(', ')}. Eşitlikte daha çok tamamlanan görevi olan alan önce gösterilir.</p>` : ''}
            ${result.tiedDepartments.length > 1 ? `<p>${result.tiedDepartments.length} departmanda aynı en yüksek yüzdeye ulaştın; ilk sıradaki departman gösteriliyor.</p>` : ''}</section></div>
            <div class="mg-summary-grid">${result.families.map(v => `<section><h4>${escape(families[v.family])}</h4><p class="journey-percent">%${v.average.toFixed(1)}</p><p>${v.count} görev ortalaması</p></section>`).join('')}</div>
            <details class="journey-caption"><summary>Bu yüzdeler nasıl hesaplanıyor?</summary>
                <p>Görev yüzdesi = alınan puan ÷ toplam puan × 100. Hazırlık oyununun puanına, tamamlandığında karar senaryolarının puanları eklenir. Her senaryo 0, 1 veya 2 puan getirir.</p>
                <p>Her alanın oranı, o alandaki tamamlanmış ve skor kaydı bulunan görevlerin en iyi yüzdelerinin eşit ağırlıklı ortalamasıdır. Oynanmayan görevler ortalamaya girmez; tekrar oynadığında en yüksek sonuç korunur. Görev sayısı tüm denemelerin sayısı değildir.</p>
                <p>Örnek: beş görev %100 ve bir görev %84 ise (100 + 100 + 100 + 100 + 100 + 84) ÷ 6 = %97,3. Görev yüzdesi iki, alan ortalaması bir ondalık basamakla gösterilir.</p>
                <p>Alan eşleştirmeleri ve başarı eşikleri oyun tasarımında belirlenmiştir. Bu oranlar mesleki yetkinlik, işe uygunluk veya gerçek şirket performansı ölçümü değil, oyun başarısının özetidir.</p>
            </details>
            <button type="button" class="mg-primary" data-journey="certificate">Sertifikamı Gör →</button>`;
    }
    function showNotes() {
        const notes = roomExplore.notes();
        const scores = journeyData.scores();
        content.innerHTML = `<div class="notes-welcome"><span class="notes-book" aria-hidden="true">${GameProps.render('books')}</span><div><p class="mg-eyebrow">Keşfettikçe defterin doluyor</p><h3>${completed.length}/${total()} görev tamamlandı</h3><p>Okuduğun bilgi noktaları ve kazandığın rozetler burada birikiyor.</p></div></div><details class="journey-caption notes-explanation"><summary>Skorlar ve kayıtların hakkında</summary><p>En iyi sonuç, tüm denemelerindeki en yüksek kayıtlı yüzdedir: puan ÷ toplam puan × 100. Örneğin 5/5 = %100; 84/100 = %84. Hazırlık ve tamamlanan karar aşaması birlikte hesaplanır. İlerlemen bu cihazdaki tarayıcıda saklanır. Tarayıcı verilerini temizlersen kayıtların silinir.</p></details><button type="button" data-journey="settings">Yolculuğu Sıfırla</button>
            <div class="mg-summary-grid journey-notes">${Object.keys(departmentGames).map(Number).map(id => {
                const dept = departmentsData[id], seen = notes[id];
                const done = completed.includes(id), explored = seen !== undefined || done;
                const spots = (dept.hotspots || []).filter(spot => seen?.includes(spot.id));
                return `<section class="${explored ? done ? 'note-completed' : 'note-explored' : 'journey-unvisited'}" data-note-dept="${id}"><h4>${escape(dept.title)}</h4><p class="note-status">${done ? '✓ Görev tamamlandı' : explored ? '✦ Keşif sürüyor' : '○ Keşfedilmeyi bekliyor'} · ${spots.length}/${dept.hotspots.length} bilgi</p>
                    ${!explored ? '<p>Henüz keşfedilmedi.</p>' : spots.length ? spots.map(spot => `<div><strong>${escape(spot.title)}</strong><p>${escape(spot.desc.length > 150 ? spot.desc.slice(0, 147) + '…' : spot.desc)}</p>${spot.desc.length > 150 ? `<details><summary>Bilginin tamamını oku</summary><p>${escape(spot.desc)}</p></details>` : ''}</div>`).join('') : '<p>Henüz bir bilgi noktası okunmadı.</p>'}
                    ${done ? `<p class="journey-note-badge">✓ ${escape(departmentGames[id].badge)}</p><p>Görev: ${escape(dept.taskSummary)}</p>${scores[id] ? `<p class="note-score">En iyi sonuç: ${scores[id].score}/${scores[id].total} · %${scores[id].percent}</p>` : '<p>Bu eski rozetin skor kaydı bulunmuyor.</p>'}` : '<p>Görev henüz tamamlanmadı.</p>'}</section>`;
            }).join('')}</div>`;
    }
    function drawCertificate() {
        return CertificateArt.render(CertificateArt.model(completed, journeyData.scores(), departmentsData, departmentGames));
    }
    function showCertificate() {
        certificate = drawCertificate();
        content.innerHTML = '<p>Sertifikan; rozetlerini, departman puanlarını ve alan yüzdelerini birlikte gösterir. PNG olarak indirip paylaşabilirsin.</p>';
        if (!certificate) { content.innerHTML += '<p>Tarayıcı görsel oluşturamadı. Lütfen yeniden dene.</p>'; return; }
        certificate.className = 'journey-certificate';
        certificate.setAttribute('role', 'img');
        certificate.setAttribute('aria-label', `${completed.length}/${total()} departman tamamlandı. Rozetler: ${completed.map(id => departmentGames[id].badge).join(', ') || 'Henüz rozet yok'}`);
        const preview = document.createElement('div');
        preview.className = 'certificate-preview';
        preview.appendChild(certificate);
        content.appendChild(preview);
        const link = document.createElement('a');
        link.className = 'journey-download'; link.textContent = '📥 Sertifikamı İndir';
        link.download = `fillo-yolculugum-${completed.length}-${total()}.png`;
        link.href = certificate.toDataURL('image/png');
        content.appendChild(link);
        const data = JSON.parse(certificate.dataset.certificateSummary);
        const readable = document.createElement('details');
        readable.className = 'certificate-text-summary';
        readable.innerHTML = `<summary>Puanları ve yüzdeleri metin olarak oku</summary><p>${data.average === null ? 'Henüz kayıtlı oyun skoru yok.' : `Genel oyun ortalaması: %${data.average.toFixed(1)} · ${data.count} skor kaydı.`}</p><ul>${data.groups.map(group => `<li>${escape(group.label)}: ${group.percent === null ? 'Skor kaydı yok' : `%${group.percent.toFixed(1)} · ${group.count} görev`}</li>`).join('')}</ul><ul>${data.rows.map(row => `<li>${escape(row.title)}: ${row.score ? `${row.score.score}/${row.score.total} puan · %${row.score.percent} · ${escape(row.badge)}` : row.done ? `${escape(row.badge)} · skor kaydı yok` : 'Henüz tamamlanmadı'}</li>`).join('')}</ul>`;
        content.appendChild(readable);
    }
    document.addEventListener('click', event => {
        if (event.target.closest('[data-reset-progress]')) {
            try {
                ['flo-game-badges', 'flo-game-scores', 'flo-room-notes'].forEach(key => localStorage.removeItem(key));
                window.location.reload();
            } catch (_) { document.getElementById('reset-status').textContent = 'Tarayıcı kayıtlarını değiştiremedik. Lütfen tarayıcı izinlerini kontrol et.'; }
            return;
        }
        const button = event.target.closest('[data-journey]');
        if (button) open(button.dataset.journey);
    });
    document.getElementById('journey-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
    dialog.addEventListener('close', () => {
        certificate = null;
        if (returnFocus?.isConnected && !dialog.contains(returnFocus)) returnFocus.focus({preventScroll: true});
    });
    return {open, refresh, drawCertificate};
})();
