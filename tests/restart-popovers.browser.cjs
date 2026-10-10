const assert=require('node:assert/strict');
const {openBrowser,begin,solvePrimary}=require('./browser-support.cjs');
(async()=>{
 const env=await openBrowser(),{page}=env;
 try{
  await begin(page,2);
  await page.locator('[data-card="4"]').click();await page.locator('[data-target="2"]').click();
  assert.match(await page.locator('[data-lives]').innerText(),/1 hak/);
  await page.locator('[data-action="restart"]').click();
  assert.match(await page.locator('[data-lives]').innerText(),/2 hak/);
  assert.equal(await page.locator('.mg-bin [data-card]').count(),0);
  await begin(page,1);await solvePrimary(page,1);
  await page.locator('[data-action="restart"]').click();
  assert.equal(await page.locator('.mg-case').count(),0);
  assert.match(await page.locator('[data-live-score]').innerText(),/0\/6/);
  for(const viewport of [{width:1365,height:900},{width:390,height:844}]){
   await page.setViewportSize(viewport);
   await page.evaluate(()=>enterDepartment(7));
   await page.locator('#room-bg-img').evaluate(img=>img.decode());
   for(const index of [0,2,3,4]){
    const marker=page.locator('.room-info-point').nth(index);await marker.click();
    const box=await page.locator('#room-info-panel').boundingBox();
    const anchor=await marker.boundingBox();
    assert(box.x>=0&&box.y>=0&&box.x+box.width<=viewport.width+1&&box.y+box.height<=viewport.height+1);
    if(viewport.width>1000)assert(Math.abs(box.x+box.width/2-anchor.x-anchor.width/2)<210,'Panel follows the selected marker horizontally');
    await page.locator('#room-info-close').click();
   }
  }
  assert.deepEqual(env.errors,[]);
  console.log('PASS active restart restores lives and clears progress; marker popovers follow anchors within desktop/mobile bounds.');
 }finally{await env.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
