const SimulationGames = (() => {
    const esc = value => String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const btn = (text, action, id = '', extra = '') => `<button type="button" data-action="sim-${action}" data-id="${id}" ${extra}>${esc(text)}</button>`;
    const prop = type => `<span class="sim-prop">${GameProps.render(type)}</span>`;
    const stat = (name, value) => `<div class="sim-stat"><small>${esc(name)}</small><strong>${esc(value)}</strong></div>`;
    const valid = (rows, id) => Number.isInteger(id) && id >= 0 && id < rows.length;
    const empty = n => Array(n).fill(null);
    function setup(s, finish, redraw) {
        s.simFinish = finish; s.simRedraw = redraw;
        const c = s.config;
        s.sim = {day:0, events:[], report:[], selected:0};
        const v = s.sim;
        if(c.type==='hiring') v.interviews=c.candidates.map(()=>[false,false]);
        if(c.type==='allocation') v.allocations=c.stores.map(()=>0);
        if(c.type==='audit') {v.counts=c.rows.map(row=>row.system);v.reasons=empty(c.rows.length);}
        if(c.type==='fulfillment') {v.stock=c.nodes.map(n=>n.stock);v.capacity=c.nodes.map(n=>n.capacity);v.delivered=empty(c.orders.length);}
        if(c.type==='vitrine') v.slots=empty(c.weights.length);
        if(c.type==='kaizen') {v.categories=empty(c.stations.length);v.actions=empty(c.stations.length);v.resolved=empty(c.stations.length);}
        if(c.type==='sprint') v.tasks=c.tasks.map(()=>({stage:0,left:0}));
        if(c.type==='project') v.tasks=c.tasks.map(()=>({stage:0,left:0}));
        if(c.type==='dispatch') {v.loads=empty(c.cargos.length);v.delivered=c.cargos.map(()=>false);v.trips=0;}
    }
    function message(s, text, success = false) {
        s.feedbackProvider[success?'onCorrectDrop':'onWrongDrop'](text);
        s.sim.events.push(text);
    }
    function end(s, score, report) {
        s.sim.report = report;
        s.simFinish(Math.max(0,Math.min(100,Math.round(score))),100,report.join(' '));
    }
    function optimalAllocation(c) {
        let pool=c.pool, value=0;
        for(const store of [...c.stores].sort((a,b)=>b.value-a.value)) {
            const units=Math.min(pool,Math.max(0,store.demand-store.stock),Math.max(0,store.capacity-store.stock));
            value+=units*store.value;pool-=units;
        }
        return value;
    }
    const yieldFor = p => p.stock ? p.interest*(1-p.returns/100) : 0;
    const vitrineValue = (c, slots) => slots.reduce((sum,id,i)=>sum+(id===null?0:yieldFor(c.products[id])*c.weights[i]),0);
    function metrics(s) {
        const c=s.config,v=s.sim;
        if(c.type==='hiring') return [v.interviews.flat().filter(Boolean).length,c.candidates.length*2,'görüşme'];
        if(c.type==='allocation') return [v.allocations.reduce((a,b)=>a+b,0),c.pool,'çift dağıtıldı'];
        if(c.type==='audit') return [v.reasons.filter(x=>x!==null).length,c.rows.length,'kayıt incelendi'];
        if(c.type==='fulfillment') return [v.delivered.filter(x=>x!==null).length,c.orders.length,'sipariş'];
        if(c.type==='vitrine') return [v.slots.filter(x=>x!==null).length,c.weights.length,'vitrin alanı'];
        if(c.type==='kaizen') return [v.resolved.filter(x=>x!==null).length,c.stations.length,'iyileştirme'];
        if(c.type==='sprint') return [v.tasks.filter(t=>t.stage===3).length,c.tasks.length,'yayınlandı'];
        if(c.type==='project') return [v.tasks.filter(t=>t.stage===2).length,c.tasks.length,'iş tamamlandı'];
        return [v.delivered.filter(Boolean).length,c.cargos.length,'sevkiyat'];
    }
    function render(s) {
        const renderer={hiring,allocation,audit,fulfillment,vitrine,kaizen,sprint,project,dispatch}[s.config.type];
        return `<div class="sim-board sim-${s.config.type}">${renderer(s)}${s.sim.events.length?`<details class="sim-log"><summary>Operasyon günlüğü · ${s.sim.events.length} kayıt</summary>${s.sim.events.slice(-5).map(text=>`<p>${esc(text)}</p>`).join('')}</details>`:''}</div>`;
    }
    function hiring(s) {
        const c=s.config,v=s.sim;
        return `<div class="sim-grid">${c.candidates.map((candidate,id)=>`<article class="sim-card"><img class="sim-candidate-portrait" src="assets/characters/hiring/${['deniz','ece','melis'][id]}.webp" alt="${esc(candidate.name)} adlı adayın portresi"><h3>${esc(candidate.name)}</h3><p>${esc(candidate.experience)}</p><div class="sim-question-list">${['Analitik uygulama','Ekip görüşmesi'].map((title,skill)=>`${btn(v.interviews[id][skill]?'✓ '+title:title,'interview',id,`data-value="${skill}" ${v.interviews[id][skill]?'disabled':''}`)}${v.interviews[id][skill]?`<p>${esc(candidate.notes[skill])}</p><strong>${candidate.skills[skill]}/100</strong>`:''}`).join('')}</div>${btn('İş Teklifi Ver','hire',id,'class="mg-primary"')}</article>`).join('')}</div><p class="sim-rule">Her iki yetkinlik en az 70/100 olmalı. Görüşmeleri tamamlanmamış adaya teklif verilemez.</p>`;
    }
    function allocation(s) {
        const c=s.config,v=s.sim,used=v.allocations.reduce((a,b)=>a+b,0);
        const value=c.stores.reduce((sum,store,i)=>sum+Math.min(v.allocations[i],Math.max(0,store.demand-store.stock))*store.value,0);
        return `<div class="sim-stats">${stat('Depoda kalan',`${c.pool-used} çift`)}${stat('Korunan katkı',`${value} birim`)}${stat('Dağıtılan',`${used}/${c.pool}`)}</div><div class="sim-grid">${c.stores.map((store,id)=>`<article class="sim-card">${prop('box')}<h3>${esc(store.name)}</h3><p>Mevcut: ${store.stock} · Talep: ${store.demand}<br>Raf kapasitesi: ${store.capacity}<br>Satılan çift başına katkı: ${store.value}</p><div class="sim-shelf" aria-hidden="true">${Array.from({length:store.capacity},(_,i)=>`<i class="${i<store.stock?'sim-existing':i<store.stock+v.allocations[id]?'sim-added':''}"></i>`).join('')}</div><div class="sim-stepper">${btn('−','allocate',id,`data-value="-1" aria-label="${esc(store.name)}: bir çift azalt" ${!v.allocations[id]?'disabled':''}`)}<output>${v.allocations[id]} çift</output>${btn('+','allocate',id,`data-value="1" aria-label="${esc(store.name)}: bir çift ekle" ${used===c.pool||store.stock+v.allocations[id]>=store.capacity?'disabled':''}`)}</div><small>Karşılanmayan talep: ${Math.max(0,store.demand-store.stock-v.allocations[id])}</small></article>`).join('')}</div>${btn('Dağıtımı Gönder','allocation-submit','','class="mg-primary"')}`;
    }
    function audit(s) {
        const c=s.config,v=s.sim;
        return `<div class="sim-grid">${c.rows.map((row,id)=>`<article class="sim-card">${prop('magnifier')}<h3>${esc(row.name)}</h3><div class="sim-stats">${stat('Sistem',row.system)}${stat('Fiziksel sayım',row.counted)}</div><p class="sim-evidence">${esc(row.ledger)}</p><label>İşlem sonrası stok<input type="number" min="0" max="999" step="1" data-sim-input="${id}" value="${v.counts[id]}"></label><label>Farkın nedeni<select data-sim-reason="${id}"><option value="">Nedeni seç</option>${c.reasons.map((reason,i)=>`<option value="${i}" ${v.reasons[id]===i?'selected':''}>${esc(reason)}</option>`).join('')}</select></label></article>`).join('')}</div>${btn('Kayıtları Uzlaştır','audit-submit','','class="mg-primary"')}`;
    }
    function fulfillment(s) {
        const c=s.config,v=s.sim,order=c.orders[v.selected];
        return `<div class="sim-order-queue" aria-label="Sipariş kuyruğu">${c.orders.map((order,id)=>btn(`${v.delivered[id]!==null?'✓ ':''}${order.name} · ${order.qty} çift · ${order.promise} saatte`,'order',id,`class="${v.selected===id?'sim-selected':''}" ${v.delivered[id]!==null?'disabled':''}`)).join('')}</div><div class="sim-selected-order">${prop('shoe')}<div><h3>${esc(order.name)}</h3><p>${order.qty} çift · Teslim sözü ${order.promise} saat</p></div></div><div class="sim-grid">${c.nodes.map((node,id)=>`<article class="sim-card">${prop(id<2?'box':'truck')}<h3>${esc(node.name)}</h3><p>Stok: ${v.stock[id]} çift<br>Kalan paketleme: ${v.capacity[id]} çift<br>Teslim: ${node.hours} saat</p>${btn('Buradan Gönder','ship',id,`${v.delivered[v.selected]!==null?'disabled':''}`)}</article>`).join('')}</div>${btn('Bu Siparişi Beklemeye Al','backorder','','class="sim-secondary"')}`;
    }
    function vitrine(s) {
        const c=s.config,v=s.sim;
        return `<div class="sim-storefront"><div class="sim-shop-sign">FİLLO / YENİ SEZON</div><div class="sim-display-slots">${v.slots.map((id,slot)=>btn(id===null?`${slot+1}. Alanı Seç`:`${slot+1}. ${c.products[id].name}`,'slot',slot,`class="sim-display ${v.selected===slot?'sim-selected':''}"`)).join('')}</div><p>Soldan sağa görünürlük: %100 · %80 · %60</p></div><div class="sim-stats">${stat('Dönüşüm endeksi',vitrineValue(c,v.slots).toFixed(1))}${stat('Seçili alan',v.selected+1)}</div><div class="sim-grid sim-product-grid">${c.products.map((product,id)=>`<article class="sim-card" style="--product-accent:${product.color}">${prop('shoe')}<h3>${esc(product.name)}</h3><p>Stok: ${product.stock}<br>Müşteri ilgisi: ${product.interest}/100<br>İade oranı: %${product.returns}</p>${btn(product.stock?'Vitrine Yerleştir':'Stok Yok','product',id,`${!product.stock?'disabled':''}`)}</article>`).join('')}</div><p class="sim-rule">Dönüşüm endeksi = ilgi × (1 − iade oranı) × alan görünürlüğü. Aynı ürün iki alana yerleştirilemez.</p>${btn('Vitrini Yayınla','vitrine-submit','','class="mg-primary"')}`;
    }
    function kaizen(s) {
        const c=s.config,v=s.sim,id=v.selected,station=c.stations[id];
        return `<div class="sim-workshop" aria-label="Çalışma noktaları">${c.stations.map((station,i)=>`<button type="button" data-action="sim-station" data-id="${i}" class="sim-station ${v.selected===i?'sim-selected':''} ${v.resolved[i]!==null?'sim-done':''}">${GameProps.render(station.prop)}<strong>${esc(station.name)}</strong><small>${v.resolved[i]!==null?'İncelendi':'İncele'}</small></button>`).join('')}</div><article class="sim-card sim-observation"><h3>${esc(station.name)}</h3><p class="sim-evidence">${esc(station.observation)}</p>${v.resolved[id]!==null?`<p>${esc(station.lesson)}</p><strong>${v.resolved[id]}/2 puan</strong>`:`<h4>İsraf türü</h4><div class="sim-choice-row">${c.categories.map((text,i)=>btn(text,'diagnose',i,`class="${v.categories[id]===i?'sim-selected':''}" aria-pressed="${v.categories[id]===i}"`)).join('')}</div><h4>İyileştirme</h4><div class="sim-question-list">${station.actions.map((text,i)=>btn(text,'remedy',i,`class="${v.actions[id]===i?'sim-selected':''}" aria-pressed="${v.actions[id]===i}"`)).join('')}</div>${btn('İyileştirmeyi Uygula','kaizen-commit','','class="mg-primary"')}`}</article>${v.resolved.every(x=>x!==null)?btn('Atölye Raporunu Gör','kaizen-submit','','class="mg-primary"'):''}`;
    }
    function sprint(s) {
        const c=s.config,v=s.sim,labels=['İş listesi','Geliştirme · 2 yer','Test · 1 yer','Yayında'];
        const ready=v.tasks.findIndex(t=>[1,2].includes(t.stage)&&t.left===0);
        const next=ready>=0?`${c.tasks[ready].name} için “${v.tasks[ready].stage===1?'Teste Gönder':'Yayına Al'}” düğmesini kullan.`:v.tasks.some(t=>[1,2].includes(t.stage))?'Çalışan işler var. “Bir Gün İlerle” ile kalan süreyi azalt.':'Önce Giriş altyapısı ve Sepet düzeltmesi için “Geliştirmeyi Başlat”a bas.';
        return `<aside class="sim-sprint-guide"><strong>Sıradaki adım</strong><p role="status">${esc(next)}</p><details><summary>Nasıl oynanır? · 6 kısa adım</summary><ol><li>İş listesinde bir kartın geliştirmesini başlat.</li><li>Aynı anda en fazla iki iş geliştirebilirsin.</li><li>“Bir Gün İlerle” düğmesine bas; çalışma günleri azalır.</li><li>Kalan süre sıfır olunca “Teste Gönder”e bas. Testte tek yer var.</li><li>Test günlerini ilerlet; sıfır olunca “Yayına Al”a bas.</li><li>Ön koşulu yayınlanan işler açılır. Beş kartı da Yayında sütununa taşı.</li></ol><p>Örnek: Sepet 1 gün geliştirme + 1 gün test ister. Başlat → gün ilerlet → teste gönder → gün ilerlet → yayına al.</p></details></aside><div class="sim-stats">${stat('Sprint günü',`${v.day}/${c.deadline}`)}${stat('Geliştirmede',`${v.tasks.filter(t=>t.stage===1).length}/2`)}${stat('Testte',`${v.tasks.filter(t=>t.stage===2).length}/1`)}</div><div class="sim-pipeline">${labels.map((label,stage)=>`<section class="sim-lane"><h3>${label}</h3>${c.tasks.map((task,id)=>v.tasks[id].stage===stage?`<article class="sim-card">${prop('terminal')}<h4>${esc(task.name)}</h4><p>${stage===0?`Kod: ${task.dev} gün · Test: ${task.test} gün`:stage===3?'Yayınlandı':v.tasks[id].left?`${v.tasks[id].left} gün çalışma kaldı`:'Bu aşama tamamlandı'}</p>${task.deps.length?`<small>Ön koşul: ${task.deps.map(i=>esc(c.tasks[i].name)).join(', ')} yayında olmalı.</small>`:''}${stage<3?btn(stage===0?'Geliştirmeyi Başlat':stage===1?'Teste Gönder':'Yayına Al','task-next',id):''}</article>`:'').join('')}</section>`).join('')}</div>${btn('Bir Gün İlerle','sprint-tick','','class="mg-primary"')}`;
    }
    function project(s) {
        const c=s.config,v=s.sim;
        return `<div class="sim-stats">${stat('Takvim',`${v.day}. gün / ${c.deadline}`)}${stat('Sahadaki ekip',`${v.tasks.filter(t=>t.stage===1).length}/${c.crews}`)}</div><div class="sim-grid">${c.tasks.map((task,id)=>`<article class="sim-card ${v.tasks[id].stage===2?'sim-done':''}">${prop(id===5?'award':'crane')}<h3>${esc(task.name)}</h3><p>Süre: ${task.days} gün<br>${task.deps.length?'Önce: '+task.deps.map(i=>esc(c.tasks[i].name)).join(', '):'Ön koşul yok'}</p>${v.tasks[id].stage===0?btn('Ekibi Ata','project-start',id):`<strong>${v.tasks[id].stage===2?'✓ Tamamlandı':v.tasks[id].left+' gün kaldı'}</strong>`}</article>`).join('')}</div>${btn('Bir Gün İlerle','project-tick','','class="mg-primary"')}`;
    }
    function dispatch(s) {
        const c=s.config,v=s.sim;
        return `<div class="sim-stats">${stat('Sefer',`${v.trips}/5`)}${stat('Hedef','3 sefer')}${stat('Teslim edilen',`${v.delivered.filter(Boolean).length}/${c.cargos.length}`)}</div><div class="sim-cargo-yard">${c.cargos.map((cargo,id)=>!v.delivered[id]&&v.loads[id]===null?`<button type="button" data-action="sim-cargo" data-id="${id}" class="sim-cargo ${v.selected===id?'sim-selected':''}">${GameProps.render('box')}<strong>${esc(cargo.name)}</strong><small>${esc(cargo.origin)} · ${cargo.pallets} palet</small></button>`:'').join('')||'<p>Tüm koliler araçlarda veya teslim edildi.</p>'}</div><div class="sim-grid">${c.vehicles.map((vehicle,id)=> {
            const loaded=c.cargos.map((cargo,i)=>v.loads[i]===id&&!v.delivered[i]?i:-1).filter(i=>i>=0);
            const used=loaded.reduce((sum,i)=>sum+c.cargos[i].pallets,0);
            return `<article class="sim-card">${prop('truck')}<h3>${esc(vehicle.name)}</h3><p>${esc(vehicle.route)}</p><progress value="${used}" max="${vehicle.capacity}" aria-label="${esc(vehicle.name)} palet yükü"></progress><strong>${used}/${vehicle.capacity} palet</strong><div class="sim-manifest">${loaded.map(i=>`<p>${esc(c.cargos[i].name)} · ${c.cargos[i].pallets} palet ${btn('Çıkar','unload',i)}</p>`).join('')}</div>${btn('Seçili Koliyi Yükle','load',id)}${btn('Aracı Gönder','depart',id,`${!loaded.length?'disabled':''}`)}</article>`;
        }).join('')}</div>`;
    }
    function input(s, element) {
        if(s.config.type!=='audit') return;
        const id=Number(element.dataset.simInput??element.dataset.simReason);
        if(!valid(s.config.rows,id)) return;
        if(element.dataset.simInput!==undefined) {
            const count=element.value.trim()===''?NaN:Number(element.value);
            s.sim.counts[id]=Number.isInteger(count)&&count>=0&&count<=999?count:null;
        } else s.sim.reasons[id]=element.value===''?null:Number(element.value);
    }
    function handle(s, element) {
        const c=s.config,v=s.sim,action=element.dataset.action.slice(4),id=Number(element.dataset.id),value=Number(element.dataset.value);
        const guard = (condition, text) => {if(!condition){message(s,text);return false;}return true;};
        if(c.type==='hiring') {
            if(!valid(c.candidates,id)) return;
            if(action==='interview') {
                if(![0,1].includes(value)||v.interviews[id][value]) return;
                v.interviews[id][value]=true;message(s,c.candidates[id].notes[value],true);
            } else if(action==='hire') {
                if(!guard(v.interviews[id].every(Boolean),'Tekliften önce iki görüşmeyi de tamamla.')) {s.simRedraw();return;}
                const candidate=c.candidates[id],suitable=candidate.skills.every(x=>x>=70);
                end(s,suitable?(id===0?100:90):40,[`${candidate.name}: analitik ${candidate.skills[0]}, iletişim ${candidate.skills[1]}.`,suitable?'İki gerekli yetkinlik de doğrulandı.':'Yüksek teknik beceri, iletişim şartındaki açığı karşılamaz.']);return;
            }
        } else if(c.type==='allocation') {
            if(action==='allocate'&&valid(c.stores,id)&&[-1,1].includes(value)) {
                const used=v.allocations.reduce((a,b)=>a+b,0),store=c.stores[id];
                if(value===1&&!guard(used<c.pool&&store.stock+v.allocations[id]<store.capacity,'Depo stoğu veya raf kapasitesi bu eklemeye izin vermiyor.')) {s.simRedraw();return;}
                if(value===-1&&v.allocations[id]===0)return;
                v.allocations[id]+=value;s.feedback='Dağılım güncellendi; boş raf ve talep farkını birlikte kontrol et.';
            } else if(action==='allocation-submit') {
                const contribution=c.stores.reduce((sum,store,i)=>sum+Math.min(v.allocations[i],Math.max(0,store.demand-store.stock))*store.value,0);
                end(s,contribution/optimalAllocation(c)*100,c.stores.map((store,i)=>`${store.name}: +${v.allocations[i]} çift, karşılanmayan talep ${Math.max(0,store.demand-store.stock-v.allocations[i])}.`));return;
            }
        } else if(c.type==='audit'&&action==='audit-submit') {
            if(!guard(v.counts.every(x=>Number.isInteger(x)&&x>=0&&x<=999),'Her kayıt için 0–999 arasında tam sayı stok gir.')){s.simRedraw();return;}
            if(!guard(v.reasons.every(x=>x!==null),'Her stok kaydı için fark nedeni seç.')){s.simRedraw();return;}
            const points=c.rows.reduce((sum,row,i)=>sum+Number(v.counts[i]===row.system+row.delta)+Number(v.reasons[i]===row.reason),0);
            end(s,points/(c.rows.length*2)*100,c.rows.map((row,i)=>`${row.name}: işlem sonrası doğru stok ${row.system+row.delta}; ${c.reasons[row.reason]}. Girdiğin stok ${v.counts[i]}.`));return;
        } else if(c.type==='fulfillment') {
            if(action==='order'&&valid(c.orders,id)&&v.delivered[id]===null)v.selected=id;
            else if(action==='ship'&&valid(c.nodes,id)) {
                const order=c.orders[v.selected];
                if(v.delivered[v.selected]!==null)return;
                if(!guard(v.stock[id]>=order.qty&&v.capacity[id]>=order.qty,'Bu noktada yeterli stok veya paketleme kapasitesi yok. Başka nokta seç.')){s.simRedraw();return;}
                v.stock[id]-=order.qty;v.capacity[id]-=order.qty;
                const onTime=c.nodes[id].hours<=order.promise;
                v.delivered[v.selected]=onTime;
                message(s,`${order.name}: ${c.nodes[id].name} üzerinden ${c.nodes[id].hours} saat; ${onTime?'teslim sözü korundu.':'teslim sözü aşıldı.'}`,onTime);
            } else if(action==='backorder'&&v.delivered[v.selected]===null) {v.delivered[v.selected]=false;message(s,`${c.orders[v.selected].name} beklemeye alındı; bu sipariş için puan kazanılmadı.`);}
            if(v.delivered.every(x=>x!==null)){end(s,v.delivered.filter(Boolean).length/c.orders.length*100,v.events);return;}
            if(v.delivered[v.selected]!==null)v.selected=v.delivered.findIndex(x=>x===null);
        } else if(c.type==='vitrine') {
            if(action==='slot'&&valid(c.weights,id))v.selected=id;
            else if(action==='product'&&valid(c.products,id)) {
                if(!guard(c.products[id].stock>0,'Stoksuz ürün vitrine alınamaz.')){s.simRedraw();return;}
                const previous=v.slots.indexOf(id);if(previous>=0)v.slots[previous]=null;
                v.slots[v.selected]=id;s.feedback='Vitrin değişti; stok, ilgi ve iade oranının etkisini karşılaştır.';
            } else if(action==='vitrine-submit') {
                if(!guard(v.slots.every(x=>x!==null),'Vitrindeki üç alanı da doldur.')){s.simRedraw();return;}
                const best=c.products.map(yieldFor).sort((a,b)=>b-a).slice(0,c.weights.length).reduce((sum,x,i)=>sum+x*c.weights[i],0);
                end(s,vitrineValue(c,v.slots)/best*100,v.slots.map((i,slot)=>`${slot+1}. alan: ${c.products[i].name}; dönüşüm katkısı ${(yieldFor(c.products[i])*c.weights[slot]).toFixed(1)}.`));return;
            }
        } else if(c.type==='kaizen') {
            if(action==='station'&&valid(c.stations,id))v.selected=id;
            else if(v.resolved[v.selected]===null&&action==='diagnose'&&valid(c.categories,id))v.categories[v.selected]=id;
            else if(v.resolved[v.selected]===null&&action==='remedy'&&valid(c.stations[v.selected].actions,id))v.actions[v.selected]=id;
            else if(action==='kaizen-commit'&&v.resolved[v.selected]===null) {
                if(!guard(v.categories[v.selected]!==null&&v.actions[v.selected]!==null,'Hem israf türünü hem iyileştirmeyi seç.')){s.simRedraw();return;}
                const station=c.stations[v.selected];
                v.resolved[v.selected]=Number(v.categories[v.selected]===station.category)+Number(v.actions[v.selected]===station.answer);
                message(s,station.lesson,v.resolved[v.selected]===2);
            } else if(action==='kaizen-submit'&&v.resolved.every(x=>x!==null)) {end(s,v.resolved.reduce((a,b)=>a+b,0)/(c.stations.length*2)*100,c.stations.map((station,i)=>`${station.name}: ${v.resolved[i]}/2. ${station.lesson}`));return;}
        } else if(c.type==='sprint') {
            if(action==='task-next'&&valid(c.tasks,id)) {
                const state=v.tasks[id],task=c.tasks[id];
                if(state.stage===0) {
                    if(!guard(task.deps.every(i=>v.tasks[i].stage===3),'Bağımlı işin ön koşulu henüz yayında değil.')){s.simRedraw();return;}
                    if(!guard(v.tasks.filter(t=>t.stage===1).length<2,'Geliştirme kapasitesi dolu. Mevcut işleri tamamla.')){s.simRedraw();return;}
                    state.stage=1;state.left=task.dev;
                } else if(state.stage===1) {
                    if(!guard(state.left===0,'Kodlama henüz tamamlanmadı. Bir gün ilerle.')){s.simRedraw();return;}
                    if(!guard(v.tasks.filter(t=>t.stage===2).length<1,'Test kapasitesi dolu. Testteki işi tamamlayıp yayınla.')){s.simRedraw();return;}
                    state.stage=2;state.left=task.test;
                } else if(state.stage===2) {
                    if(!guard(state.left===0,'Test bitmeden yayına alınamaz.')){s.simRedraw();return;}
                    state.stage=3;
                } else return;
                message(s,`${task.name}: ${['bekliyor','geliştirmede','testte','yayında'][state.stage]}.`,true);
            } else if(action==='sprint-tick') {
                v.day++;v.tasks.forEach(t=>{if([1,2].includes(t.stage)&&t.left>0)t.left--;});s.feedback=`${v.day}. gün tamamlandı. Bitmiş işleri bir sonraki aşamaya taşı.`;
            }
            if(v.tasks.every(t=>t.stage===3)){end(s,Math.max(0,100-Math.max(0,v.day-7)*10),[`${v.tasks.length} iş ${v.day} günde test edilip yayınlandı.`,`Kapasite sınırları ve yayın bağımlılıkları korundu.`]);return;}
            if(v.day>=c.deadline){end(s,Math.min(70,v.tasks.filter(t=>t.stage===3).length/c.tasks.length*70),['Sprint süresi doldu. Küçük partilerle test kuyruğunu boşaltıp bağımlı işleri açmayı dene.']);return;}
        } else if(c.type==='project') {
            if(action==='project-start'&&valid(c.tasks,id)&&v.tasks[id].stage===0) {
                const task=c.tasks[id];
                if(!guard(task.deps.every(i=>v.tasks[i].stage===2),'Ön koşul tamamlanmadan bu iş başlayamaz.')){s.simRedraw();return;}
                if(!guard(v.tasks.filter(t=>t.stage===1).length<c.crews,'İki ekip de çalışıyor; bir işi tamamlamalarını bekle.')){s.simRedraw();return;}
                v.tasks[id]={stage:1,left:task.days};message(s,`${task.name} başladı; ${task.days} günlük ekip işi.`,true);
            } else if(action==='project-tick') {
                v.day++;v.tasks.forEach((t,i)=>{if(t.stage===1&&--t.left===0){t.stage=2;v.events.push(`${v.day}. gün: ${c.tasks[i].name} tamamlandı.`);}});s.feedback=`Takvim ${v.day}. güne ilerledi. Tamamlanan işler yeni ön koşulları açtı.`;
            }
            if(v.tasks.every(t=>t.stage===2)){end(s,v.day<=c.deadline?100:0,[`Mağaza ${v.day}. günde güvenlik kontrolünden sonra açıldı.`]);return;}
            if(v.day>=c.deadline){end(s,v.tasks.filter(t=>t.stage===2).length/c.tasks.length*70,['Açılış takvimi kaçırıldı. Zemin ve elektrik işlerini onay sonrası paralel başlatmayı dene.']);return;}
        } else if(c.type==='dispatch') {
            if(action==='cargo'&&valid(c.cargos,id)&&!v.delivered[id]&&v.loads[id]===null)v.selected=id;
            else if(action==='load'&&valid(c.vehicles,id)) {
                if(!valid(c.cargos,v.selected)||v.delivered[v.selected]||v.loads[v.selected]!==null){message(s,'Önce sahadaki bir koliyi seç.');s.simRedraw();return;}
                const cargo=c.cargos[v.selected],truck=c.vehicles[id],used=c.cargos.reduce((sum,row,i)=>sum+(v.loads[i]===id&&!v.delivered[i]?row.pallets:0),0);
                if(!guard(cargo.region===truck.region,'Bu araç seçili kolinin çıkış noktası ve güzergâhına uygun değil.')){s.simRedraw();return;}
                if(!guard(used+cargo.pallets<=truck.capacity,'Araç kapasitesi aşılır. Bu koliyi başka sefere bırak veya yükü düzenle.')){s.simRedraw();return;}
                v.loads[v.selected]=id;message(s,`${cargo.name}: ${truck.name} aracına ${cargo.pallets} palet yüklendi.`,true);
                v.selected=v.loads.findIndex((load,i)=>load===null&&!v.delivered[i]);
            } else if(action==='unload'&&valid(c.cargos,id)&&!v.delivered[id]){v.loads[id]=null;v.selected=id;}
            else if(action==='depart'&&valid(c.vehicles,id)) {
                const manifest=c.cargos.map((cargo,i)=>v.loads[i]===id&&!v.delivered[i]?i:-1).filter(i=>i>=0);
                if(!manifest.length)return;
                manifest.forEach(i=>{v.delivered[i]=true;v.loads[i]=null;});v.trips++;
                message(s,`${c.vehicles[id].name} gönderildi: ${manifest.map(i=>c.cargos[i].name).join(', ')}.`,true);
            }
            if(v.delivered.every(Boolean)){end(s,100-Math.max(0,v.trips-3)*20,[`${c.cargos.length} sevkiyat ${v.trips} seferde tamamlandı.`,...v.events.filter(text=>text.includes('gönderildi'))]);return;}
            if(v.trips>=5){end(s,40,['Sefer sınırı doldu. Aynı güzergâhtaki kolileri kapasite içinde birleştir.']);return;}
        }
        s.simRedraw();
    }
    function report(s) {return `<div class="sim-result-report">${s.sim.report.map(text=>`<p>${esc(text)}</p>`).join('')}</div>`;}
    return {setup,render,handle,input,metrics,report};
})();
