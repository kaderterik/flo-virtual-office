const assert=require('node:assert/strict');
const path=require('node:path');
const {openBrowser,begin}=require('./browser-support.cjs');
(async()=>{
    const env=await openBrowser(),{page,root,errors}=env;
    try{
        await page.screenshot({path:path.join(root,'tmp/cozy-sidebar-desktop.png')});
        assert.equal(await page.locator('.chatbot-panel').first().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 246, 232)');
        for(const viewport of [{width:1365,height:900},{width:390,height:844}]){
            await page.setViewportSize(viewport);
            await page.evaluate(()=>enterDepartment(1));
            await page.waitForFunction(()=>document.getElementById('room-bg-img').complete&&document.getElementById('room-bg-img').naturalWidth>0);
            const frame=await page.evaluate(()=>{
                const image=document.getElementById('room-bg-img'),box=document.getElementById('room-art-frame'),layer=document.getElementById('room-hotspots');
                return {frame:[box.style.left,box.style.top,box.style.width,box.style.height],layer:[layer.style.left,layer.style.top,layer.style.width,layer.style.height],clip:image.style.clipPath,pointer:getComputedStyle(box).pointerEvents};
            });
            assert.deepEqual(frame.frame,frame.layer);assert.match(frame.clip,/round 18px/);assert.equal(frame.pointer,'none');
            await page.locator('.room-info-point').first().click();assert.equal(await page.locator('#room-info-panel').isVisible(),true);await page.keyboard.press('Escape');
            await page.screenshot({path:path.join(root,`tmp/cozy-room-frame-${viewport.width}.png`)});
            await begin(page,13);
            assert.equal(await page.locator('.room-game-view').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(241, 227, 204)');
            assert(await page.locator('.sim-board').evaluate(el=>el.scrollWidth<=el.clientWidth+1));
            await page.screenshot({path:path.join(root,`tmp/cozy-game-${viewport.width}.png`)});
        }
        assert.deepEqual(errors,[]);
        console.log('PASS warm chat/game theme, aligned rounded image frame, clickable hotspots and mobile board.');
    }finally{await env.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
