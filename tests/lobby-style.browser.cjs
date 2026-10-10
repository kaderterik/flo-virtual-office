const assert=require('node:assert/strict');
const path=require('node:path');
const {openBrowser}=require('./browser-support.cjs');
(async()=>{
    const env=await openBrowser(),{page,root,errors}=env;
    try{
        const expected1={1:[55,290,105,290],2:[210,300,95,270],3:[335,310,85,250],4:[445,320,78,235],5:[530,330,70,220],6:[1085,325,70,220],7:[1165,318,78,235],8:[1260,308,85,250],9:[1370,295,95,270],10:[1485,280,110,290]};
        const expected2={1:[55,290,105,290],2:[210,300,95,270],3:[335,310,85,250],4:[445,310,78,225],5:[530,320,70,210],6:[1085,310,70,210],7:[1165,305,78,225],8:[1260,295,85,240],9:[1370,290,95,265],10:[1485,280,110,290]};
        const boxes=await page.evaluate(()=>[KAT1_DOOR_HITBOXES,KAT2_DOOR_HITBOXES].map(map=>Object.fromEntries(Object.entries(map).map(([k,b])=>[k,[b.x,b.y,b.w,b.h]]))));
        assert.deepEqual(boxes,[expected1,expected2]);
        for(const floor of [1,2]){
            if(floor===2){await page.locator('#floor-btn').click();await page.waitForFunction(()=>currentFloor===2&&!document.querySelector('.floor-transitioning'));}
            await page.waitForFunction(()=>document.getElementById('corridor-img').complete&&document.getElementById('corridor-img').naturalWidth>0);
            assert.equal(await page.locator('.door-btn').count(),10);
            assert.match(await page.locator('#corridor-img').getAttribute('src'),/cozy/);
            await page.screenshot({path:path.join(root,`tmp/cozy-lobby-${floor}.png`)});
            for(let id=(floor-1)*10+1;id<=floor*10;id++){
                await page.locator(`.door-btn[data-dept-id="${id}"]`).click();
                assert.equal(await page.evaluate(()=>currentDeptId),id);
                await page.locator('#btn-close-room').click();
            }
        }
        await page.locator('#floor-btn').click();await page.waitForFunction(()=>currentFloor===1&&!document.querySelector('.floor-transitioning'));
        await page.locator('.door-btn[data-dept-id="1"]').click();
        assert.match(await page.locator('#room-bg-img').getAttribute('src'),/cozy\/oda1/);
        await page.screenshot({path:path.join(root,'tmp/cozy-hr-live.png')});
        assert.deepEqual(errors,[]);
        console.log('PASS unchanged 20 door rectangles, both floor transitions, 20 door clicks and matching HR room.');
    }finally{await env.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
