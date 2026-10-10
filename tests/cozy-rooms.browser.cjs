const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {openBrowser}=require('./browser-support.cjs');
(async()=>{
    const env=await openBrowser(),{page,root,errors}=env;
    try{
        const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/rooms/cozy/generation.json'),'utf8'));
        assert.equal(manifest.length,19);assert.equal(new Set(manifest.map(r=>r.character)).size,19);
        assert(manifest.some(r=>r.character.startsWith('adult woman'))&&manifest.some(r=>r.character.startsWith('adult man')));
        for(let id=1;id<=20;id++){
            await page.evaluate(id=>enterDepartment(id),id);
            await page.waitForFunction(()=>document.getElementById('room-bg-img').complete&&document.getElementById('room-bg-img').naturalWidth>0);
            assert.equal(await page.locator('#room-bg-img').getAttribute('src'),`assets/rooms/cozy/oda${id}.webp`);
            assert.equal(await page.locator('#room-bg-img').evaluate(el=>getComputedStyle(el).imageRendering),'auto');
            assert.equal(await page.locator('#room-art-frame').evaluate(el=>getComputedStyle(el).pointerEvents),'none');
            assert.equal(await page.locator('.room-info-point').count(),5);
            if([3,8,13,18,20].includes(id))await page.screenshot({path:path.join(root,`tmp/cozy-room-${id}-live.png`)});
        }
        assert.deepEqual(errors,[]);
        console.log('PASS all 20 cozy assets, distinct character specifications, both genders, room frames and 100 hotspots.');
    }finally{await env.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
