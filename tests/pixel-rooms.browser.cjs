const assert = require('node:assert/strict');
const path = require('node:path');
const {openBrowser,begin,solvePrimary,decisions}=require('./browser-support.cjs');
(async()=>{
    const env=await openBrowser(),{page,root,errors}=env;
    try {
        const rooms=await page.evaluate(()=>Object.values(departmentsData).filter(d=>d.id>=1&&d.id<=20).map(d=>({id:d.id,image:d.image,dialogues:d.dialogues})));
        assert.equal(rooms.length,20);
        for(const room of rooms){
            assert.equal(room.dialogues.length,6);
            assert(room.dialogues.every(d=>d.text.length<=220),`Long dialogue ${room.id}`);
            assert.equal(room.dialogues.at(-1).isLast,true);
            await page.evaluate(id=>enterDepartment(id),room.id);
            await page.waitForFunction(()=>document.getElementById('room-bg-img').complete&&document.getElementById('room-bg-img').naturalWidth>0);
            assert.equal(await page.locator('#room-bg-img').getAttribute('src'),room.image);
        }
        await page.evaluate(()=>enterDepartment(13));
        await page.screenshot({path:path.join(root,'tmp/pixel-room-13-desktop.png')});
        await page.setViewportSize({width:390,height:844});
        for(const room of rooms){
            await page.evaluate(id=>enterDepartment(id),room.id);
            const sizes=await page.locator('#dialogue-step-tag').evaluate(el=>({height:el.getBoundingClientRect().height,line:parseFloat(getComputedStyle(el).lineHeight),white:getComputedStyle(el).whiteSpace}));
            assert.equal(sizes.white,'nowrap');
            assert(sizes.height<=sizes.line+1,`Wrapped counter ${room.id}`);
        }
        await page.locator('.room-info-point').first().click();
        assert((await page.locator('#room-info-text').innerText()).length<=241);
        await page.keyboard.press('Escape');
        await page.screenshot({path:path.join(root,'tmp/pixel-room-mobile.png')});
        await begin(page,13);
        await page.locator('.sim-sprint-guide summary').click();
        assert.equal(await page.locator('.sim-sprint-guide li').count(),6);
        await page.screenshot({path:path.join(root,'tmp/sprint-guide-mobile.png')});
        await solvePrimary(page,13);await decisions(page);
        assert.match(await page.locator('.mg-result').innerText(),/Rozetin kazanıldı/);
        assert.deepEqual(errors,[]);
        console.log('PASS 20 pixel rooms, six concise dialogues, mobile counters, compact info cards and guided sprint completion.');
    }finally{await env.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
