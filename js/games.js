const miniGames = (() => {
    let session = null;
    const escape = value => String(value).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
    const shuffled = values => {
        const result = [...values];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        if (result.length > 1 && result.every((v, i) => v === values[i])) result.push(result.shift());
        return result;
    };
    const button = (label, action, extra = '') => `<button type="button" data-action="${action}" ${extra}>${escape(label)}</button>`;
    const countCorrect = (order) => order.reduce((n, value, i) => n + Number(value === i), 0);
    const stockDifferences = c => c.rows.filter(([, recorded, counted]) => recorded !== counted).length;
    const components = {
        ordering: {type: 'order', render: ordering}, matching: {type: 'match', render: matching},
        classification: {type: 'sortTimed', render: singleCard}, budget: {type: 'budget', render: budget},
        flow: {type: 'flow', render: ordering}, stock: {type: 'stock', render: stocks},
        materials: {type: 'materials', render: singleCard}, routing: {type: 'routing', render: routing},
        ranking: {type: 'ranking', render: ordering}, mapDecision: {type: 'markets', render: markets},
        hiddenObject: {type: 'hidden', render: hidden}, kanban: {type: 'kanban', render: kanban},
        branching: {type: 'crisis', render: crisis}, timeline: {type: 'timeline', render: ordering},
        simulation: {type:'simulation', render: s=>SimulationGames.render(s)}
    };

    function stop() {
        if (!session) return;
        clearInterval(session.timer);
        clearTimeout(session.finishTimer);
        session.controller.abort();
        session = null;
    }

    function mount(id, host, onComplete) {
        stop();
        const dept = departmentsData[id];
        const component = dept && Object.hasOwn(components, dept.gameComponent) ? components[dept.gameComponent] : null;
        const config = component && departmentGames[id] ? {...departmentGames[id], type: component.type==='simulation'?departmentGames[id].type:component.type} : null;
        if (!config) {
            host.innerHTML = '<div class="mg-empty"><h2>🚧 Oyun Yakında Ekleniyor</h2><p>Bu departmanın görevi hazırlanıyor. Sohbete geri dönebilirsin.</p></div>';
            return;
        }
        const s = session = {
            id, host, config, dept, component, onComplete, controller: new AbortController(), timer: null,
            phase: 'intro', selected: null, score: 0, index: 0, feedback: '', errors: [],
            order: shuffled((config.items || []).map((_, i) => i)), assignments: {},
            values: (config.stores || config.days || []).map(() => 0),
            found: [], wrong: [], lives: config.mistakes || 3, positions: (config.tasks || []).map(() => 0),
            reaction: null, finishTimer: null,
            answers: {}, country: null, node: 'start', history: [], reviewed: false
        };
        s.missions = departmentMissions[id] || [];
        s.missionIndex = 0;
        s.decisions = [];
        s.choiceOrders = s.missions.map(m => shuffled(m.choices.map((_, i) => i)));
        s.feedbackProvider = new GameUI.GameFeedbackProvider(s);
        if(component.type==='simulation') SimulationGames.setup(s,(score,total,message)=>finish(s,score,total,message),()=>{
            const focused=document.activeElement;
            const key=focused?.dataset.action?.startsWith('sim-')?{action:focused.dataset.action,id:focused.dataset.id,value:focused.dataset.value}:null;
            render(s);
            if(key){
                const next=[...s.host.querySelectorAll('[data-action]')].find(el=>el.dataset.action===key.action&&el.dataset.id===key.id&&el.dataset.value===key.value&&!el.disabled);
                next?.focus({preventScroll:true});
            }
        });
        const options = {signal: s.controller.signal};
        host.addEventListener('click', e => click(s, e), options);
        host.addEventListener('input', e => {
            if (e.target.matches('[data-sim-input], [data-sim-reason]')) {
                SimulationGames.input(s,e.target);
                const hud=host.querySelector('[data-feedback-provider]');
                if(hud)hud.outerHTML=s.feedbackProvider.render(...scoreMetrics(s));
                return;
            }
            if (!e.target.matches('[data-slider]')) return;
            const i = Number(e.target.dataset.slider);
            s.values[i] = Number(e.target.value);
            host.querySelector(`[data-value="${i}"]`).textContent = s.values[i];
            const total = s.values.reduce((a, b) => a + b, 0);
            const meter = host.querySelector('[data-total]');
            if (meter) {
                meter.textContent = `${total} / 100 birim${total > 100 ? ' — Bütçe aşıldı' : ''}`;
                meter.classList.toggle('mg-error', total > 100);
            }
            const hud = host.querySelector('[data-feedback-provider]');
            if (hud) hud.outerHTML = s.feedbackProvider.render(...scoreMetrics(s));
        }, options);
        wirePointer(s, options);
        document.addEventListener('visibilitychange', () => {
            if (!config.seconds || s.phase !== 'play') return;
            if (document.hidden) pause(s, 'Sekme arka plana geçtiği için süre durdu.');
        }, options);
        render(s);
    }

    function start(s) {
        s.phase = 'play';
        if (s.config.seconds) {
            s.remaining = s.config.seconds * 1000;
            runClock(s);
        }
        render(s);
        s.host.closest('.room-game-view')?.scrollTo({top:0});
        const heading=s.host.querySelector('.mg-heading h2');
        heading?.setAttribute('tabindex','-1');
        heading?.focus({preventScroll:true});
    }
    function runClock(s) {
        clearInterval(s.timer);
        s.deadline = performance.now() + s.remaining;
        s.timer = setInterval(() => {
            if (s !== session || s.phase !== 'play') return;
            const remaining = Math.max(0, Math.ceil((s.deadline - performance.now()) / 1000));
            const el = s.host.querySelector('[data-clock]');
            if (el) el.textContent = `${remaining} sn`;
            if (!remaining) finishTimed(s);
        }, 100);
    }
    function finishTimed(s) {
        finish(s, s.config.type === 'stock' ? s.found.length : s.score,
            s.config.type === 'stock' ? stockDifferences(s.config) : s.config.items.length, 'Süre doldu.');
    }
    function pause(s, reason = 'Hazır olduğunda kaldığın yerden devam edebilirsin.') {
        if (!s.config.seconds || s.phase !== 'play') return;
        s.remaining = Math.max(0, s.deadline - performance.now());
        if (!s.remaining) { finishTimed(s); return; }
        clearInterval(s.timer);
        s.phase = 'paused'; s.pauseReason = reason;
        render(s);
        s.host.querySelector('[data-action="resume"]')?.focus();
    }
    function modeLabel(c) {
        if (c.seconds) return `SÜRELİ GÖREV · ${c.seconds} SN`;
        if (c.mistakes) return `GÖREV · ${c.mistakes} HATA HAKKI`;
        return c.passScore ? 'OPERASYON SİMÜLASYONU' : 'SERBEST TEMPO · TEKRAR DENE';
    }
    function render(s) {
        s.clearDrag?.();
        if (s !== session) return;
        const c = s.config;
        let body = '';
        if (s.phase === 'intro') {
            body = GameUI.TaskIntro(s.dept, c);
        } else if (s.phase === 'paused') {
            body = `<div class="mg-pause-panel"><h3>Tur duraklatıldı</h3><p>${escape(s.pauseReason)}</p><p>${Math.ceil(s.remaining / 1000)} saniyen kaldı. Kartların ve skorun korunuyor.</p>${button('Devam Et →', 'resume', 'class="mg-primary"')}</div>`;
        } else if (s.phase === 'mission') body = mission(s);
        else if (s.phase === 'result') body = result(s);
        else body = play(s);
        s.host.innerHTML = `<div class="mg-shell ${c.live ? 'mg-arcade' : ''}"><div class="mg-heading"><div><span class="mg-eyebrow">FİLLO GÖREVLERİ · ${String(s.id).padStart(2, '0')}</span><h2>${escape(c.name)}</h2></div>
            <div class="mg-session-controls"><span class="mg-status ${!c.seconds || s.phase === 'mission' ? 'mg-mode-label' : ''}">${s.phase === 'mission' ? 'KARAR MASASI · KENDİ HIZINDA' : s.phase === 'play' && c.seconds ? `<span data-clock>${Math.max(0, Math.ceil((s.deadline - performance.now()) / 1000))} sn</span>` : modeLabel(c)}</span>${s.phase === 'play' && c.seconds ? button('Ⅱ Duraklat', 'pause', 'class="mg-pause-button"') : ''}${['play', 'paused', 'mission'].includes(s.phase) ? button('↻ Yeniden Başla', 'restart', 'class="mg-pause-button mg-restart-button"') : ''}</div></div>
            ${body}</div>`;
    }
    function card(s, id, label, hint = '', extra = '') {
        const accepted = s.config.live && s.assignments[id] !== undefined;
        return `<button type="button" class="mg-card ${s.selected === id ? 'mg-selected' : ''} ${s.errors.includes(id) ? 'mg-invalid' : ''} ${accepted ? 'mg-accepted' : ''} ${s.reaction?.id === id && s.reaction.kind === 'wrong' ? 'mg-returned' : ''}"
            data-card="${id}" aria-pressed="${s.selected === id}" ${extra}><span class="mg-grip" aria-hidden="true">⠿</span><span class="mg-card-prop">${GameProps.render(({2:'shoe',3:'chart',5:'box',7:'plant',11:'megaphone',14:'robot',15:'people',16:'chart',19:'coins'})[s.id]||'clipboard',id)}</span><span>${escape(label)}${hint ? `<small>${escape(hint)}</small>` : ''}${s.errors.includes(id) ? '<small>↔ Yerini kontrol et</small>' : ''}</span></button>`;
    }
    function play(s) {
        const c = s.config;
        const content = s.component.render(s);
        const [current, total, label] = scoreMetrics(s);
        return `${s.feedbackProvider.render(current, total, label)}<p class="mg-instruction">${escape(c.instruction)}</p>
            <div class="mg-play-content ${s.reaction ? 'mg-feedback-' + s.reaction.kind : ''}">${content}</div>
            <p class="mg-feedback ${s.errors.length ? 'mg-error' : ''}">${escape(s.feedback)}</p>${s.feedbackProvider.avatar()}`;
    }
    function scoreMetrics(s) {
        const c = s.config;
        if(s.sim) return SimulationGames.metrics(s);
        if (c.type === 'budget') return [s.values.reduce((a, b) => a + b, 0), 100, 'birim'];
        if (c.type === 'crisis') return [s.score, 100, 'itibar'];
        if (c.type === 'kanban') return [c.tasks.filter((task, id) => s.positions[id] === task.answer).length, c.tasks.length, 'görev'];
        if (c.type === 'stock') return [s.found.length, stockDifferences(c), 'fark'];
        if (c.type === 'hidden') return [s.found.length, c.spots.length, 'nokta'];
        if (c.type === 'routing') return [s.score, c.rounds.length, 'doğru'];
        if (c.type === 'markets') return [c.countries.filter((v, i) => s.answers[i] === v.answer).length, c.countries.length, 'doğru'];
        if (c.type === 'match') return [c.items.filter((v, i) => v[1] >= 0 && s.assignments[i] === v[1]).length, c.items.filter(v => v[1] >= 0).length, 'doğru'];
        if (c.type === 'timeline') return [countCorrect(s.order) + c.days.filter((v, i) => Math.abs(s.values[i] - v) <= 5).length, c.items.length * 2, 'doğru'];
        if (['order', 'flow', 'ranking'].includes(c.type)) return [countCorrect(s.order), c.items.length, 'doğru'];
        return [s.score, c.items.length, 'doğru'];
    }
    function react(s, correct, message, details) {
        s.feedbackProvider[correct ? 'onCorrectDrop' : 'onWrongDrop'](message, details);
    }
    function ordering(s) {
        const c = s.config;
        return `<p class="mg-help">Kartları sürükle; dokunmatik veya klavyede ↑ / ↓ düğmelerini kullan.</p>
            <div class="mg-order ${c.type === 'flow' ? 'mg-flow' : ''}">${s.order.map((id, i) => `<div class="mg-order-row" data-drop="${i}"><span class="mg-number">${i + 1}</span>
                ${card(s, id, c.items[id], (c.hints || [])[id])}<div class="mg-movers">${button('↑', 'up', `data-id="${id}" aria-label="${escape(c.items[id])}: yukarı taşı" ${i === 0 ? 'disabled' : ''}`)}${button('↓', 'down', `data-id="${id}" aria-label="${escape(c.items[id])}: aşağı taşı" ${i === s.order.length - 1 ? 'disabled' : ''}`)}</div>
                ${c.type === 'timeline' ? `<label class="mg-days">Tahmin: <output data-value="${id}">${s.values[id]}</output> gün<input type="range" min="0" max="60" value="${s.values[id]}" data-slider="${id}" aria-label="${escape(c.items[id])} gün tahmini"></label>` : ''}</div>`).join('')}</div>
            ${button('Sıralamayı Kontrol Et', 'submit', 'class="mg-primary"')}`;
    }
    function matching(s) {
        const c = s.config;
        if (c.live) return liveMatching(s);
        const unassigned = s.order.filter(id => s.assignments[id] === undefined);
        return `<p class="mg-help">Kartı sürükle veya kartı seçip hedef kutuya dokun. Yerleştirdiğin kartı yeniden seçerek taşıyabilirsin.</p>
            <div class="mg-bank" data-drop="bank">${unassigned.map(id => card(s, id, c.items[id][0], c.items[id][2])).join('') || '<span>Tüm kartlar yerleştirildi.</span>'}
                ${button('Seçili Kartı Geri Al', 'target', `data-target="bank" ${s.selected === null || s.assignments[s.selected] === undefined ? 'disabled' : ''}`)}</div>
            <div class="mg-bins ${s.id === 16 ? 'mg-swot' : ''}">${c.bins.map((bin, i) => `<section class="mg-bin" data-drop="${i}">
                ${button(bin, 'target', `data-target="${i}" class="mg-bin-title"`)}
                ${s.order.filter(id => s.assignments[id] === i).map(id => card(s, id, c.items[id][0], c.items[id][2])).join('')}
                <span class="mg-drop-hint">${s.order.some(id => s.assignments[id] === i) ? 'Kart yerleştirildi' : c.unique ? '＋ Bir kart yerleştir' : '＋ Kartları buraya yerleştir'}</span></section>`).join('')}</div>
            ${button('Eşleştirmeleri Kontrol Et', 'submit', 'class="mg-primary"')}`;
    }
    function liveMatching(s) {
        const c = s.config;
        const remaining = s.order.filter(id => s.assignments[id] === undefined);
        return `            <p class="mg-help">Sürükle veya kartı seçip istasyona dokun. Doğru kart yerleşir, yanlış kart geri döner. <span class="mg-mobile-tip">Kartları yana kaydırabilirsin.</span></p>
            <div class="mg-arena"><section class="mg-deck"><h3>📦 Karar bekleyen ürünler <span>${remaining.length}</span></h3>
                <div class="mg-bank" data-drop="bank">${remaining.map(id => card(s, id, c.items[id][0], c.items[id][2])).join('') || '<p>✓ Tüm ürünler yerine ulaştı!</p>'}</div>
                ${button('Seçili Kartı Geri Al', 'target', `data-target="bank" class="mg-undo" ${s.selected === null || s.assignments[s.selected] === undefined ? 'disabled' : ''}`)}</section>
                <div class="mg-stations" aria-label="Aksiyon istasyonları">${c.bins.map((bin, i) => {
                    const occupant = s.order.find(id => s.assignments[id] === i);
                    const reaction = s.reaction?.bin === i ? `mg-hit-${s.reaction.kind}` : '';
                    return `<section class="mg-bin mg-station ${occupant !== undefined ? 'mg-filled' : ''} ${reaction}" data-drop="${i}">
                        ${button(`${['📈', '🏷️', '🌐', '🚚', '🔎'][i]} ${bin}`, 'target', `data-target="${i}" class="mg-bin-title"`)}
                        ${occupant !== undefined ? `<span class="mg-station-status">✓ Doğru karar</span>${card(s, occupant, c.items[occupant][0])}` : '<span class="mg-drop-hint">＋ Kartı buraya bırak<br><small>veya seçip buraya dokun</small></span>'}</section>`;
                }).join('')}</div></div>`;
    }
    function liveMove(s, id, target) {
        const c = s.config;
        if (!c.items[id]) return;
        s.reaction = null;
        if (target === 'bank') {
            delete s.assignments[id];
            s.score = Object.keys(s.assignments).length;
            s.feedback = 'Kart geri alındı. Verisini yeniden değerlendirebilirsin.';
        } else {
            const bin = Number(target);
            if (!Number.isInteger(bin) || bin < 0 || bin >= c.bins.length) return;
            if (s.assignments[id] !== undefined) {
                s.feedback = 'Bu kart doğru yerde. Taşımak istersen önce “Seçili Kartı Geri Al”a dokun.';
            } else if (c.items[id][1] === bin) {
                s.assignments[id] = bin;
                s.score = Object.keys(s.assignments).length;
                react(s, true, `Harika! ${c.items[id][0]} için doğru aksiyonu buldun. ${s.score}/${c.items.length} tamam!`, {id, bin});
            } else {
                s.lives--;
                react(s, false, `Bu aksiyon veriye uymuyor. Kartı geri aldım. ${s.lives ? 'İpucu: ' + c.items[id][2] : 'Hakların bitti; birlikte yeniden deneyebiliriz.'}`, {id, bin});
            }
        }
        s.selected = null;
        if (s.score === c.items.length || !s.lives) {
            s.phase = 'settling';
            s.finishTimer = setTimeout(() => {
                if (session === s) finish(s, s.score, c.items.length, s.lives ? '' : `${c.mistakes} hata hakkını kullandın.`);
            }, 700);
        }
        render(s);
        if (s.phase === 'play') s.host.querySelector(`[data-card="${id}"]`)?.focus({preventScroll: true});
    }
    function budget(s) {
        const total = s.values.reduce((a, b) => a + b, 0);
        return `<div class="mg-budget">${s.config.stores.map((store, i) => `<label class="mg-store"><strong>🏬 ${escape(store.name)}</strong><small>Metrekare: ${store.area} m² · Geçmiş satış hızı: ${store.speed}</small>
            <span><input type="range" min="0" max="100" value="${s.values[i]}" data-slider="${i}" aria-label="${store.name} bütçesi"><output data-value="${i}">${s.values[i]}</output></span></label>`).join('')}</div>
            <p class="mg-total ${total > 100 ? 'mg-error' : ''}" data-total aria-live="polite">${total} / 100 birim${total > 100 ? ' — Bütçe aşıldı' : ''}</p>${button('Dağılımı Gönder', 'submit', 'class="mg-primary"')}`;
    }
    function singleCard(s) {
        const c = s.config, item = c.items[s.order[s.index]];
        const bins = c.type === 'materials' ? ['Uygun Değil', 'Sürdürülebilir'] : c.bins;
        return `<p class="mg-counter">Kart ${s.index + 1} / ${c.items.length} · ${s.score} doğru</p>
            <div class="mg-single ${c.type === 'sortTimed' ? 'mg-falling' : ''}">${card(s, s.order[s.index], item[0], item[2])}</div>
            <div class="mg-choices">${bins.map((bin, i) => button(bin, 'answer', `data-answer="${i}" data-drop="${i}" ${s.reviewed ? 'disabled' : ''}`)).join('')}</div>
            ${s.reviewed ? button(s.index + 1 === c.items.length ? 'Sonucu Gör →' : 'Sonraki Kart →', 'next', 'class="mg-primary"') : ''}`;
    }
    function stocks(s) {
        return `<p class="mg-counter">${s.found.length} / ${stockDifferences(s.config)} fark · ${s.lives} can</p><div class="mg-stock-table"><div class="mg-stock-row mg-table-head"><span>Ürün</span><span>Sistem</span><span>Sayım</span></div>
            ${s.config.rows.map(([name, system, actual], i) => `<button type="button" data-action="stock" data-id="${i}" class="mg-stock-row ${s.found.includes(i) ? 'mg-correct' : ''} ${s.wrong.includes(i) ? 'mg-invalid' : ''}" ${s.found.includes(i) || s.wrong.includes(i) ? 'disabled' : ''}><span>${s.found.includes(i) ? '✓ ' : s.wrong.includes(i) ? '✕ ' : ''}${escape(name)}</span><span>${system}</span><span>${actual}</span></button>`).join('')}</div>`;
    }
    function routing(s) {
        const c = s.config, round = c.rounds[s.index];
        if (c.layout === 'dispatch') return `<p class="mg-counter">Sevkiyat ${s.index + 1} / ${c.rounds.length} · ${s.score} doğru</p>
            <div class="mg-dispatch"><h3>📋 Lojistik Yönlendirme Merkezi</h3>${card(s, s.index, round.product, 'Doğru sağlayıcıya taşı veya aşağıdan seç.')}
            <div class="mg-dispatch-head"><span>Sağlayıcı / Merkez</span><span>Güzergâh</span></div>
            ${c.nodes.map((name, i) => `<button type="button" data-action="route" data-answer="${i}" data-drop="${i}" class="mg-dispatch-row ${s.reviewed && i === round.answer ? 'mg-correct' : ''}" ${s.reviewed ? 'disabled' : ''}><strong>${escape(name)}</strong><span>${escape(c.routes[i])}</span></button>`).join('')}</div>
            ${s.reviewed ? button(s.index === c.rounds.length - 1 ? 'Sonucu Gör →' : 'Sonraki Sevkiyat →', 'next', 'class="mg-primary"') : ''}`;
        return `<p class="mg-counter">Sipariş ${s.index + 1} / ${c.rounds.length} · ${s.score} doğru</p><div class="mg-route"><div class="mg-customer">🧍 Müşteri<br><strong>${escape(round.product)}</strong><small>Bulunduğu mağazada ürün yok.</small></div>
            <div class="mg-route-nodes">${c.nodes.map((name, i) => button(`${i < 2 ? '🏬' : '📦'} ${name} · Stok ${round.stocks[i]} · ${round.hours[i]} saat`, 'route', `data-answer="${i}" ${s.reviewed ? 'disabled' : ''} class="${s.reviewed && i === round.answer ? 'mg-correct' : ''}"`)).join('')}</div></div>
            ${s.reviewed ? button(s.index === c.rounds.length - 1 ? 'Sonucu Gör →' : 'Sonraki Sipariş →', 'next', 'class="mg-primary"') : ''}`;
    }
    function markets(s) {
        const c = s.config, country = c.countries[s.country];
        return `<p class="mg-counter">${Object.keys(s.answers).length} / ${c.countries.length} pazar tamamlandı</p><div class="mg-map" aria-label="Şematik dünya haritası">
            <svg viewBox="0 0 100 60" aria-hidden="true"><path d="M6 12L18 5 31 10 34 20 24 28 18 25 11 22ZM24 29L35 33 38 41 29 57 24 43ZM43 13L51 9 60 14 65 8 87 10 96 21 84 30 73 29 69 40 61 26 54 24ZM45 26L56 25 62 36 53 51 47 40ZM79 45L90 42 97 51 87 55Z"/></svg>
            ${c.countries.map((v, i) => button(`${s.answers[i] !== undefined ? '✓ ' : '📍 '}${v.name}`, 'country', `data-id="${i}" style="left:${v.x}%;top:${v.y}%" class="mg-pin ${s.country === i ? 'mg-selected' : ''}"`)).join('')}</div>
            ${country ? `<div class="mg-profile"><h3>${escape(country.name)}</h3><p>${escape(country.profile)}</p><div class="mg-choices">${c.options.map((v, i) => button(v, 'market', `data-answer="${i}" ${s.answers[s.country] !== undefined ? 'disabled' : ''}`)).join('')}</div></div>` : '<p>Bir ülke işaretine dokun.</p>'}
            ${Object.keys(s.answers).length === c.countries.length ? button('Sonucu Gör →', 'submit', 'class="mg-primary"') : ''}`;
    }
    function hidden(s) {
        return `<p class="mg-counter">${s.found.length} / ${s.config.spots.length} nokta bulundu</p><div class="mg-office" aria-label="Ofis ve depo sahnesi"><span class="mg-office-sign">FLO · OPERASYON ALANI</span><span class="mg-decor mg-window">▥ ▥</span><span class="mg-decor mg-plant">🪴</span><span class="mg-decor mg-desk">🖥️</span>
            ${s.config.spots.map((spot, i) => button(s.found.includes(i) ? '✓' : spot.icon, 'spot', `data-id="${i}" class="mg-spot ${s.found.includes(i) ? 'mg-found' : ''}" style="left:${spot.x}%;top:${spot.y}%" aria-label="${escape(spot.label)}" ${s.found.includes(i) ? 'disabled' : ''}`)).join('')}</div>
            <div class="mg-discoveries">${s.found.map(i => `<p>✓ ${escape(s.config.spots[i].detail)}</p>`).join('')}</div>
            ${s.found.length === s.config.spots.length ? button('Sonucu Gör →', 'submit', 'class="mg-primary"') : ''}`;
    }
    function kanban(s) {
        const c = s.config;
        const cards = col => c.tasks.map((task, id) => s.positions[id] === col ? card(s, id, task.title, `${col ? '✓ Doğru aşama · ' : ''}${task.status}`) : '').join('');
        return `<p class="mg-help">İşin adına değil, altındaki durum bilgisine bak. Kartı sürükle veya seçip uygun kutunun başlığına dokun.</p>
            <section class="mg-bin mg-sprint-bank" data-drop="0"><h3>Bekleyen Kartlar · ${s.positions.filter(v => v === 0).length}</h3><div class="mg-sprint-cards">${cards(0)}</div></section>
            <div class="mg-kanban mg-sprint-targets">${c.bins.slice(1).map((bin, i) => {
                const col = i + 1;
                return `<section class="mg-bin" data-drop="${col}">${button(bin, 'target', `data-target="${col}" class="mg-bin-title"`)}
                    ${cards(col) || '<p class="mg-drop-hint">Kartı buraya bırak</p>'}</section>`;
            }).join('')}</div>`;
    }
    function crisis(s) {
        const node = s.config.nodes[s.node];
        return `<p class="mg-counter">Karar ${s.history.length + 1} · İtibar ${s.score} / 100</p><div class="mg-profile"><h3>${escape(node.text)}</h3><div class="mg-choices">${node.choices.map((v, i) => button(v[0], 'crisis', `data-answer="${i}"`)).join('')}</div></div>
            <ol class="mg-history">${s.history.map(v => `<li>${escape(v[0])}<small>${escape(v[3])}</small></li>`).join('')}</ol>`;
    }

    function move(s, id, target) {
        if (s.phase !== 'play' || !Number.isInteger(id)) return;
        if (s.config.seconds && performance.now() >= s.deadline) {
            finishTimed(s); return;
        }
        const c = s.config;
        if (c.type === 'routing' && c.layout === 'dispatch') {
            const suppressed = s.suppressClick;
            s.suppressClick = false;
            if (!s.reviewed) s.host.querySelector(`[data-action="route"][data-answer="${Number(target)}"]`)?.click();
            s.suppressClick = suppressed;
            return;
        }
        if (c.live) { liveMove(s, id, target); return; }
        s.errors = []; s.feedback = '';
        if (['order', 'flow', 'ranking', 'timeline'].includes(c.type)) {
            const index = s.order.indexOf(id), to = Number(target);
            if (index < 0 || !Number.isInteger(to) || to < 0 || to >= s.order.length) return;
            s.order.splice(index, 1); s.order.splice(to, 0, id);
            react(s, id === to, id === to ? '✓ Kart doğru sırada!' : 'Bu kartın sırasını yeniden düşün.', {id});
        } else if (c.type === 'match') {
            if (target === 'bank') delete s.assignments[id];
            else {
                const bin = Number(target);
                if (!Number.isInteger(bin) || bin < 0 || bin >= c.bins.length) return;
                if (c.unique) {
                    const occupant = Object.keys(s.assignments).find(key => Number(key) !== id && s.assignments[key] === bin);
                    if (occupant !== undefined) delete s.assignments[occupant];
                }
                s.assignments[id] = bin;
                const correct = c.items[id][1] === bin;
                s.errors = correct ? [] : [id];
                react(s, correct, correct ? '✓ Doğru eşleştirme!' : 'Bu eşleşme uygun değil. Kartı başka bir kutuya taşı.', {id, bin});
            }
        } else if (c.type === 'kanban') {
            const bin = Number(target);
            const task = c.tasks[id];
            if (!task || !Number.isInteger(bin) || bin < 0 || bin >= c.bins.length) return;
            if (s.positions[id] === task.answer) { s.selected = null; render(s); return; }
            if (bin === 0) { s.selected = null; render(s); return; }
            if (bin !== task.answer) react(s, false, `Bu iş henüz bu aşamaya uygun değil. Durumu yeniden oku: ${task.status}`, {id, bin});
            else { s.positions[id] = bin; react(s, true, `✓ ${task.title}: ${c.bins[bin]} aşamasına doğru yerleştirildi!`, {id, bin}); }
            if (c.tasks.every((task, id) => s.positions[id] === task.answer)) { finish(s, c.tasks.length, c.tasks.length, 'Bütün işleri doğru aşamaya yerleştirdin!'); return; }
        } else if (c.type === 'sortTimed' || c.type === 'materials') {
            answer(s, Number(target)); return;
        }
        s.selected = null;
        render(s);
    }
    function answer(s, choice) {
        if (s.reviewed) return;
        const c = s.config, item = c.items[s.order[s.index]];
        const expected = Number(item[1]);
        s.score += Number(choice === expected);
        s.feedback = choice === expected ? '✓ Doğru karar!' : `Bu kartın yeri: ${c.type === 'materials' ? (expected ? 'Sürdürülebilir' : 'Uygun Değil') : c.bins[expected]}.`;
        react(s, choice === expected, s.feedback);
        if (c.type === 'sortTimed') {
            s.index++;
            if (s.index === c.items.length) { finish(s, s.score, c.items.length); return; }
        } else s.reviewed = true;
        render(s);
    }
    function submit(s) {
        const c = s.config;
        if (['order', 'flow', 'ranking', 'timeline'].includes(c.type)) {
            const correct = countCorrect(s.order);
            s.errors = s.order.filter((id, i) => id !== i);
            let details = '';
            if (c.type === 'timeline') {
                const daysCorrect = c.days.filter((value, i) => Math.abs(s.values[i] - value) <= 5).length;
                s.errors = [...new Set([...s.errors, ...c.days.map((v, i) => Math.abs(s.values[i] - v) > 5 ? i : -1).filter(i => i >= 0)])];
                details = ` Süre tahmini: ${daysCorrect}/${c.days.length} doğru. Toplamın ${s.values.reduce((a, b) => a + b, 0)} gün; örnek hedef ${c.days.reduce((a, b) => a + b, 0)} gün.`;
                if (correct === c.items.length && daysCorrect === c.days.length) { finish(s, correct + daysCorrect, c.items.length + c.days.length, details); return; }
            } else if (correct === c.items.length) { finish(s, correct, c.items.length, c.success || 'Akış doğru!'); return; }
            s.feedback = `${correct}/${c.items.length} doğru konum. İşaretli kartları düzeltip tekrar gönder.${details}`;
        } else if (c.type === 'match') {
            s.errors = c.items.map((item, id) => (item[1] === -1 ? s.assignments[id] !== undefined : s.assignments[id] !== item[1]) ? id : -1).filter(i => i >= 0);
            const total = c.items.filter(item => item[1] !== -1).length;
            const correct = c.items.filter((item, id) => item[1] !== -1 && s.assignments[id] === item[1]).length;
            if (!s.errors.length) { finish(s, correct, total); return; }
            s.feedback = `${correct}/${total} doğru. İşaretli kartları tekrar yerleştir.${c.distractors ? ' Çeldiricileri kart alanına geri taşı.' : ''}`;
        } else if (c.type === 'budget') {
            if (s.values.reduce((a, b) => a + b, 0) !== 100) s.feedback = 'Bütçenin toplamı tam 100 birim olmalı.';
            else {
                const score = Math.round(100 - s.values.reduce((sum, v, i) => sum + Math.abs(v - c.stores[i].ideal), 0) / 2);
                finish(s, score, 100); return;
            }
        } else if (c.type === 'markets') {
            finish(s, c.countries.filter((v, i) => s.answers[i] === v.answer).length, c.countries.length); return;
        } else if (c.type === 'hidden') { finish(s, s.found.length, c.spots.length); return; }
        react(s, false, s.feedback);
        render(s);
    }
    function finish(s, score, total, message = '') {
        clearInterval(s.timer);
        clearTimeout(s.finishTimer);
        const c = s.config;
        s.won = s.sim ? score/total*100>=c.passScore : c.type === 'budget' ? score >= 75 : (c.type === 'crisis' ? score >= 75 : ['sortTimed', 'routing', 'materials'].includes(c.type) ? score >= Math.ceil(total * 0.8) : score === total);
        s.badge = c.type === 'budget' ? `${score >= 90 ? 'Altın' : score >= 75 ? 'Gümüş' : 'Bronz'} Planlamacı` : c.badge;
        s.primary = {score, total, message, won: s.won};
        if (s.won && s.missions.length) {
            s.phase = 'mission'; s.feedback = ''; s.reaction = null;
            officeAudio.gameCue('correct');
            render(s);
            s.host.querySelector('.mg-case-title')?.focus();
            s.host.closest('.room-game-view')?.scrollTo({top: 0});
            return;
        }
        complete(s, score, total, message);
    }
    function complete(s, score, total, message = '') {
        score = total > 0 ? Math.round(Math.max(0, Math.min(1, score / total)) * 10000) / 100 : 0;
        total = 100;
        s.phase = 'result'; s.score = score; s.total = total; s.feedback = message;
        s.onComplete(s.id, {score, total, percent: Math.round(score / total * 10000) / 100, badge: s.badge, won: s.won});
        officeAudio.gameCue(s.won ? 'win' : 'wrong');
        render(s);
        s.host.querySelector('.mg-result').focus();
    }
    function mission(s) {
        const entry = s.missions[s.missionIndex];
        const decision = s.decisions[s.missionIndex];
        const points = s.decisions.reduce((sum, row) => sum + row.points, 0);
        const target = Math.ceil(s.missions.length * 2 * 0.8);
        return `<div class="mg-case" data-mission-index="${s.missionIndex}">
            <div class="mg-stage-banner"><span>✓ 1. Hazırlık tamamlandı</span><strong>2. Karar masası</strong><span>3. Sonuç ve rozet</span></div>
            <p class="mg-case-progress"><span data-primary-score>Hazırlık: ${s.primary.score}/${s.primary.total}</span> · ${s.missionIndex + 1}/${s.missions.length} iş senaryosu · <strong>${points}/${s.missions.length * 2} karar puanı</strong></p>
            <h3 class="mg-case-title" tabindex="-1">${escape(entry.title)}</h3><p class="mg-case-brief">${escape(entry.brief)}</p>
            <section class="mg-case-evidence" aria-label="Karar için bilgiler"><h4>Masandaki bilgiler</h4><ul>${entry.evidence.map(line => `<li>${escape(line)}</li>`).join('')}</ul></section>
            <p class="mg-case-rule">Bilgileri birlikte değerlendir. Güçlü karar 2, eksik karar 1, koşulları karşılamayan karar 0 puan. Rozet için en az ${target}/${s.missions.length * 2} gerekiyor.</p>
            <div class="mg-case-options">${s.choiceOrders[s.missionIndex].map((index, position) => {
                const choice = entry.choices[index];
                return button(choice.label, 'case-choice', `data-choice="${index}" ${decision ? 'disabled' : ''} class="mg-case-option ${decision?.choice === index ? 'mg-case-picked' : ''}" aria-label="${position + 1}. ${escape(choice.label)}"`);
            }).join('')}</div>
            ${decision ? `<section class="mg-case-consequence ${decision.points === 2 ? 'mg-case-good' : 'mg-case-learn'}" role="status"><strong>${decision.points === 2 ? 'İsabetli karar' : decision.points === 1 ? 'Kararında eksik kalan bir nokta var' : 'Bu karar koşulları karşılamıyor'} · +${decision.points} puan</strong><p>${escape(decision.consequence)}</p>${decision.points < 2 ? `<p><strong>Daha güçlü yaklaşım:</strong> ${escape(entry.choices.find(choice => choice.points === 2).label)}</p>` : ''}</section>${button(s.missionIndex + 1 === s.missions.length ? 'Görev Raporunu Gör →' : 'Sonraki Senaryo →', 'case-next', 'class="mg-primary"')}` : ''}
        </div>`;
    }
    function decide(s, choiceIndex) {
        const entry = s.missions[s.missionIndex];
        const choice = entry?.choices[choiceIndex];
        if (!choice || s.decisions[s.missionIndex]) return;
        s.decisions.push({...choice, choice: choiceIndex, title: entry.title});
        officeAudio.gameCue(choice.points === 2 ? 'correct' : 'wrong');
        render(s);
        s.host.querySelector('[data-action="case-next"]')?.focus({preventScroll: true});
    }
    function nextMission(s) {
        if (!s.decisions[s.missionIndex]) return;
        s.missionIndex++;
        if (s.missionIndex < s.missions.length) {
            render(s); s.host.querySelector('.mg-case-title')?.focus();
            return;
        }
        const points = s.decisions.reduce((sum, row) => sum + row.points, 0);
        s.won = points >= Math.ceil(s.missions.length * 2 * 0.8);
        complete(s, s.primary.score + points, s.primary.total + s.missions.length * 2,
            s.won ? 'Hazırlık ve karar görevlerini tamamladın.' : 'Hazırlık tamam; karar masasında koşulları birlikte değerlendirerek yeniden dene.');
    }
    function result(s) {
        const c = s.config;
        let summary = s.sim ? SimulationGames.report(s) : '';
        if (c.type === 'match') summary = `<div class="mg-summary-grid">${c.bins.map((bin, i) => `<section><h4>${escape(bin)}</h4>${c.items.filter(item => item[1] === i).map(item => `<p>✓ ${escape(item[0])}</p>`).join('') || '<p>Bu turda görev yok.</p>'}</section>`).join('')}</div>`;
        if (['order', 'flow', 'ranking', 'timeline'].includes(c.type)) summary = `<ol class="mg-summary-order ${c.type === 'flow' ? 'mg-running' : ''}">${c.items.map((item, i) => `<li style="--step:${i}">${escape(item)}${c.type === 'timeline' ? ` · ${s.values[i]} gün (hedef ${c.days[i]})` : ''}</li>`).join('')}</ol>`;
        if (c.type === 'budget') summary = `<div class="mg-summary-grid">${c.stores.map((v, i) => `<section><h4>${v.name}</h4><p>Senin payın: ${s.values[i]} · Hedef: ${v.ideal}</p></section>`).join('')}</div>`;
        if (c.type === 'crisis') summary = `<ol class="mg-history">${s.history.map(v => `<li>${escape(v[0])}<small>${escape(v[3])}</small></li>`).join('')}</ol>`;
        if (c.type === 'markets') summary = `<div class="mg-summary-grid">${c.countries.map(v => `<section><h4>${v.name}</h4><p>${escape(c.options[v.answer])}</p></section>`).join('')}</div>`;
        if (s.decisions.length) summary = `<div class="mg-report"><h4>Görev raporun</h4><p>Hazırlık: ${s.primary.score}/${s.primary.total} · Karar masası: ${s.decisions.reduce((sum, row) => sum + row.points, 0)}/${s.missions.length * 2}</p><ol>${s.decisions.map((row, index) => `<li><strong>${escape(row.title)} · ${row.points}/2</strong><p>Seçimin: ${escape(row.label)}</p><p>${escape(row.consequence)}</p>${row.points < 2 ? `<p>Önerilen yaklaşım: ${escape(s.missions[index].choices.find(choice => choice.points === 2).label)}</p>` : ''}</li>`).join('')}</ol><details><summary>Hazırlık çözümünü incele</summary>${summary}</details></div>`;
        return s.feedbackProvider.complete(summary);
    }

    function click(s, event) {
        if (s.suppressClick) { s.suppressClick = false; return; }
        const action = event.target.closest('[data-action]');
        if (!action) {
            const el = event.target.closest('[data-card]');
            if (el && s.phase === 'play') { selectCard(s, Number(el.dataset.card)); }
            else if (event.target.closest('[data-drop="bank"]') && s.selected !== null) move(s, s.selected, 'bank');
            return;
        }
        const kind = action.dataset.action, id = Number(action.dataset.id), choice = Number(action.dataset.answer);
        if (kind === 'start') { start(s); return; }
        if (kind === 'retry') { mount(s.id, s.host, s.onComplete); return; }
        if (kind === 'restart') {
            mount(s.id, s.host, s.onComplete);
            start(session);
            session.host.querySelector('[data-action="restart"]')?.focus({preventScroll: true});
            return;
        }
        if (kind === 'back') { showDialogueView(); return; }
        if (s.phase === 'mission') {
            if (kind === 'case-choice') decide(s, Number(action.dataset.choice));
            else if (kind === 'case-next') nextMission(s);
            return;
        }
        if (kind === 'resume' && s.phase === 'paused') { s.phase = 'play'; runClock(s); render(s); s.host.querySelector('[data-action="pause"]')?.focus(); return; }
        if (kind === 'pause') { pause(s); return; }
        if (s.phase !== 'play') return;
        if (s.config.seconds && performance.now() >= s.deadline) {
            finishTimed(s); return;
        }
        if(kind.startsWith('sim-')&&s.sim){SimulationGames.handle(s,action);return;}
        if (kind === 'submit') submit(s);
        else if (kind === 'up' || kind === 'down') {
            move(s, id, s.order.indexOf(id) + (kind === 'up' ? -1 : 1));
            s.host.querySelector(`[data-action="${kind}"][data-id="${id}"]:not(:disabled)`)?.focus();
        } else if (kind === 'target') {
            if (s.selected !== null) move(s, s.selected, action.dataset.target);
            else { s.feedback = 'Önce bir kart seç.'; render(s); }
        } else if (kind === 'answer') answer(s, choice);
        else if (kind === 'next') {
            s.index++; s.reviewed = false; s.feedback = '';
            const total = s.config.type === 'routing' ? s.config.rounds.length : s.config.items.length;
            if (s.index === total) finish(s, s.score, total); else render(s);
        } else if (kind === 'stock') {
            if (s.found.includes(id) || s.wrong.includes(id)) return;
            if (s.config.rows[id][1] !== s.config.rows[id][2]) { s.found.push(id); s.feedback = '✓ Stok farkı bulundu.'; }
            else { s.wrong.push(id); s.lives--; s.feedback = 'Bu satırda fark yok. Bir can kaybettin.'; }
            react(s, s.found.includes(id), s.feedback, {id});
            if (s.found.length === stockDifferences(s.config) || !s.lives) finish(s, s.found.length, stockDifferences(s.config), !s.lives ? 'Canların bitti.' : 'Tüm farkları yakaladın!'); else render(s);
        } else if (kind === 'route') {
            if (s.reviewed) return;
            const round = s.config.rounds[s.index];
            s.score += Number(choice === round.answer); s.reviewed = true;
            s.feedback = s.config.layout === 'dispatch'
                ? `${choice === round.answer ? '✓ Doğru!' : 'Bu sevkiyat için doğru yönlendirme:'} ${s.config.nodes[round.answer]} — ${s.config.routes[round.answer]}.`
                : `${choice === round.answer ? '✓ Doğru!' : 'Bu sipariş için daha iyi bir seçenek var.'} ${s.config.nodes[round.answer]} stokta ürüne sahip ve ${round.hours[round.answer]} saatte ulaştırıyor.`;
            react(s, choice === round.answer, s.feedback);
            render(s);
        } else if (kind === 'country') { s.country = id; s.feedback = ''; render(s); }
        else if (kind === 'market') {
            if (s.answers[s.country] !== undefined) return;
            const country = s.config.countries[s.country];
            s.answers[s.country] = choice;
            s.feedback = choice === country.answer ? '✓ Profil ile model eşleşti.' : `Bu profil için model: ${s.config.options[country.answer]}.`;
            react(s, choice === country.answer, s.feedback);
            render(s);
        } else if (kind === 'spot') {
            if (!s.found.includes(id)) s.found.push(id);
            react(s, true, s.config.spots[id].detail); render(s);
        } else if (kind === 'crisis') {
            const decision = s.config.nodes[s.node].choices[choice];
            s.history.push(decision); s.score += decision[2]; s.node = decision[1];
            react(s, decision[2] >= 20, decision[3]);
            if (!s.node) finish(s, s.score, 100); else render(s);
        }
    }
    function selectCard(s, id) {
        s.selected = id;
        s.reaction = null;
        if (s.config.live) s.feedback = `${s.config.items[id][0]} seçildi. Veriye uygun istasyona dokun.`;
        render(s);
        if (s.config.live) {
            const target = s.host.querySelector(s.assignments[id] === undefined ? '[data-target="0"]' : '[data-target="bank"]');
            target?.focus({preventScroll: true});
            if (window.matchMedia('(max-width: 700px)').matches) target?.scrollIntoView({block: 'center', behavior: 'instant'});
        }
    }
    function wirePointer(s, options) {
        let drag = null;
        const clearDrag = () => {
            const previous = drag;
            drag = null;
            previous?.ghost?.remove();
            previous?.el.classList.remove('mg-dragging');
            s.host.querySelectorAll('.mg-drop-active').forEach(el => el.classList.remove('mg-drop-active'));
            if (previous?.el.hasPointerCapture(previous.pointer)) previous.el.releasePointerCapture(previous.pointer);
            return previous;
        };
        s.clearDrag = clearDrag;
        s.controller.signal.addEventListener('abort', clearDrag, {once: true});
        s.host.addEventListener('pointerdown', event => {
            s.suppressClick = false;
            const el = event.target.closest('[data-card]');
            if (!el || s.phase !== 'play' || event.button !== 0 || drag) return;
            const rect = el.getBoundingClientRect();
            drag = {id: Number(el.dataset.card), x: event.clientX, y: event.clientY, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, rect, active: false, pointer: event.pointerId, el};
            el.setPointerCapture(event.pointerId);
        }, options);
        s.host.addEventListener('pointermove', event => {
            if (!drag || event.pointerId !== drag.pointer) return;
            if (!drag.active && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 7) {
                drag.active = true;
                const ghost = document.createElement('div');
                ghost.className = 'mg-shell mg-drag-preview';
                ghost.setAttribute('aria-hidden', 'true');
                ghost.inert = true;
                const clone = drag.el.cloneNode(true);
                clone.removeAttribute('id');
                clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
                const style = getComputedStyle(drag.el);
                for (const property of ['font', 'padding', 'background', 'color', 'border', 'border-radius', 'box-shadow', 'gap', 'align-items']) clone.style.setProperty(property, style.getPropertyValue(property));
                Object.assign(clone.style, {width: '100%', height: '100%', margin: '0', transform: 'none'});
                Object.assign(ghost.style, {width: `${drag.rect.width}px`, height: `${drag.rect.height}px`});
                ghost.appendChild(clone);
                document.body.appendChild(ghost);
                drag.ghost = ghost;
                officeAudio.gameCue('pick');
            }
            if (!drag.active) return;
            drag.el.classList.add('mg-dragging');
            drag.ghost.style.transform = `translate3d(${event.clientX - drag.offsetX}px, ${event.clientY - drag.offsetY}px, 0)`;
            s.host.querySelectorAll('.mg-drop-active').forEach(el => el.classList.remove('mg-drop-active'));
            document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-drop]')?.classList.add('mg-drop-active');
        }, options);
        s.host.addEventListener('pointerup', event => {
            if (!drag || event.pointerId !== drag.pointer) return;
            const previous = clearDrag();
            if (!previous.active) {
                if (event.pointerType === 'touch') {
                    s.suppressClick = true;
                    selectCard(s, previous.id);
                }
                return;
            }
            s.suppressClick = true;
            const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-drop]');
            if (target && s.host.contains(target)) move(s, previous.id, target.dataset.drop);
            else render(s);
        }, options);
        s.host.addEventListener('pointercancel', clearDrag, options);
        s.host.addEventListener('lostpointercapture', clearDrag, options);
    }
    return {mount, stop};
})();
