const assert=require('node:assert/strict');
const path=require('node:path');
const {openBrowser,begin,solvePrimary,decisions}=require('./browser-support.cjs');
(async()=>{
    const env=await openBrowser(),{page,root,errors}=env;
    try{
        for(let id=1;id<=20;id++){
            await begin(page,id);
            assert.equal(await page.locator('[data-feedback-provider]').count(),1);
            await solvePrimary(page,id);
            assert.equal(await page.locator('.mg-case').count(),1);
            assert.equal(await page.locator('#badge-count').innerText(),String(id-1),'No badge before decisions');
            await decisions(page);
            assert.match(await page.locator('.mg-result').innerText(),/Rozetin kazanıldı/);
            assert.equal(await page.locator('.mg-confetti').count(),1);
            console.log(`PASS ${id}: ${await page.evaluate(id=>departmentGames[id].name,id)}`);
        }
        await page.reload();assert.equal(await page.locator('#badge-count').innerText(),'20');
        await begin(page,1);await solvePrimary(page,1);await decisions(page);assert.equal(await page.locator('#badge-count').innerText(),'20');
        // Actual pointer drag, immediate feedback, undo and two-mistake failure remain supported.
        await begin(page,2);
        const from=await page.locator('[data-card="0"]').boundingBox(),to=await page.locator('[data-target="2"]').boundingBox();
        await page.mouse.move(from.x+from.width/2,from.y+from.height/2);await page.mouse.down();await page.mouse.move(to.x+to.width/2,to.y+to.height/2,{steps:10});
        assert(await page.locator('.mg-drag-preview').isVisible());await page.mouse.up();
        assert.equal(await page.locator('.mg-bin[data-drop="2"] [data-card="0"]').count(),1);
        await page.locator('[data-card="0"]').click();await page.locator('[data-target="bank"]').click();
        assert.equal(await page.locator('.mg-deck [data-card="0"]').count(),1);
        for(let n=0;n<2;n++){await page.locator('[data-card="4"]').click();await page.locator('[data-target="2"]').click();}
        await page.locator('.mg-result').waitFor();assert.match(await page.locator('.mg-result').innerText(),/2 hata/);
        // Timed category task pauses and is cancelled on leaving the department.
        await begin(page,3);await page.clock.install();await page.locator('[data-action="pause"]').click();await page.clock.fastForward(60000);assert.equal(await page.locator('.mg-result').count(),0);
        await page.locator('[data-action="resume"]').click();await page.clock.fastForward(31000);assert.match(await page.locator('.mg-result').innerText(),/Süre doldu/);
        await begin(page,3);await page.evaluate(()=>exitDepartment());await page.clock.fastForward(60000);assert.equal(await page.locator('#department-screen.active').count(),0);await page.clock.resume();
        for(let id=1;id<=20;id++){
            await page.evaluate(id=>enterDepartment(id),id);
            const count=await page.evaluate(id=>departmentsData[id].hotspots.length,id);
            assert.equal(await page.locator('.room-info-point .game-prop').count(),count);
            assert.equal(await page.locator('.room-info-point').evaluateAll(elements=>elements.every(el=>el.textContent.replace(/\d/g,'').trim().length>0)),true);
        }
        await page.evaluate(()=>enterDepartment(20));await page.locator('.room-info-point').first().click();await page.keyboard.press('Escape');
        assert.equal(await page.locator('.room-info-point').first().evaluate(el=>el===document.activeElement),true);
        await page.screenshot({path:path.join(root,'tmp/props-room-desktop.png')});
        await page.emulateMedia({reducedMotion:'reduce'});
        assert.equal(await page.locator('.room-info-point .game-prop').first().evaluate(el=>getComputedStyle(el).animationName),'none');
        await page.setViewportSize({width:390,height:844});
        for(const id of [1,4,6,8,9,12,13,18,20]){
            await begin(page,id);
            assert(await page.locator('.sim-board').evaluate(el=>el.scrollWidth<=el.clientWidth+1),`Mobile overflow ${id}`);
            await page.screenshot({path:path.join(root,`tmp/simulation-${id}-mobile.png`)});
            await solvePrimary(page,id);await decisions(page);
        }
        await page.setViewportSize({width:1365,height:900});
        for(const id of [4,9,12,13,18,20]){await begin(page,id);await page.screenshot({path:path.join(root,`tmp/simulation-${id}-desktop.png`)});}
        await page.evaluate(()=>{
            const gallery=document.createElement('section');gallery.id='art-preview';
            Object.assign(gallery.style,{position:'fixed',left:'120px',top:'70px',width:'1050px',padding:'28px',zIndex:'20000',background:'#fff5e0',color:'#343546',borderRadius:'20px',boxShadow:'0 10px 40px #0008'});
            const props=[['box','Koli'],['terminal','Bilgisayar'],['books','Kitaplar'],['chart','Analiz'],['shoe','Ayakkabı'],['plant','Bitki'],['globe','Dünya'],['truck','Nakliye'],['clipboard','Görev dosyası'],['gear','Süreç'],['shield','Güvenlik'],['bulb','Fikir'],['megaphone','İletişim'],['clock','Süre'],['people','Ekip'],['coins','Bütçe'],['crane','Şantiye'],['magnifier','İnceleme'],['robot','Yapay zekâ'],['award','Rozet']];
            gallery.innerHTML=`<h2 style="margin-bottom:20px;font-size:24px">Fillo’nun oyun nesneleri</h2><div style="display:grid;grid-template-columns:repeat(10,1fr);gap:20px">${props.map(([key,label])=>`<div style="text-align:center"><div style="height:82px">${GameProps.render(key)}</div><p style="font-size:11px;margin-top:10px">${label}</p></div>`).join('')}</div>`;
            document.body.appendChild(gallery);
        });
        await page.locator('#art-preview').screenshot({path:path.join(root,'tmp/props-gallery.png')});
        await page.locator('#art-preview').evaluate(el=>el.remove());
        assert.deepEqual(errors,[]);
        console.log('PASS 20 complete games, persistence, drag/undo, timed pause/cleanup, all room sprites, reduced motion and nine mobile simulation boards.');
    }finally{await env.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
