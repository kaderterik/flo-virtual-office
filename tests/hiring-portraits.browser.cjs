const assert=require('node:assert/strict');
const path=require('node:path');
const {openBrowser,begin,decisions}=require('./browser-support.cjs');
(async()=>{
    const env=await openBrowser(),{page,root}=env;
    try{
        await begin(page,1);
        const portraits=page.locator('.sim-candidate-portrait');
        assert.equal(await portraits.count(),3);
        await page.waitForFunction(()=>[...document.querySelectorAll('.sim-candidate-portrait')].every(img=>img.complete&&img.naturalWidth>0));
        const paths=await portraits.evaluateAll(images=>images.map(img=>img.getAttribute('src')));
        assert.equal(new Set(paths).size,3);
        assert.deepEqual(await page.locator('.sim-card h3').allTextContents(),['Deniz','Ece','Melis']);
        await page.screenshot({path:path.join(root,'tmp/hiring-portraits.png')});
        await page.locator('[data-action="sim-interview"][data-id="1"][data-value="0"]').click();
        await page.locator('[data-action="sim-interview"][data-id="1"][data-value="1"]').click();
        await page.locator('[data-action="sim-hire"][data-id="1"]').click();
        await decisions(page);
        assert.equal(await page.locator('.mg-score').innerText(),'90.57 / 100 görev puanı');
        assert.match(await page.locator('.mg-report').innerText(),/Hazırlık: 90\/100 · Karar masası: 6\/6/);
        const score=await page.evaluate(()=>journeyData.scores()[1]);
        assert.equal(score.total,100);assert.equal(score.score,90.57);assert.equal(score.percent,90.57);
        await page.screenshot({path:path.join(root,'tmp/hiring-hundred-score.png')});
        assert.deepEqual(env.errors,[]);
        console.log('PASS three distinct women portraits and 96/106 normalized to 90.57/100 with matching saved percentage.');
    }finally{await env.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
