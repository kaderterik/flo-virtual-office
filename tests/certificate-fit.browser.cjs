const assert=require('node:assert/strict');
const path=require('node:path');
const {openBrowser}=require('./browser-support.cjs');
(async()=>{const env=await openBrowser();const {page,root}=env;try{
 assert.equal(await page.locator('[data-social="mail"]').getAttribute('href'),'mailto:kaderterik3@gmail.com');
 assert.match(await page.locator('.chat-message.bot').first().innerText(),/Merhaba canım!/);
 assert.equal(await page.locator('.fillo-seated').count(),1);
 await page.evaluate(()=>document.getElementById('chatbot-retry').hidden=false);
 const retry=await page.locator('#chatbot-retry').boundingBox();assert(retry.width<120&&retry.height<40);
 await page.screenshot({path:path.join(root,'tmp/fillo-heart-sidebar.png')});
 await page.evaluate(()=>{for(let id=1;id<=20;id++)awardGameBadge(id,{score:100,total:100,won:true});});
 for(const v of [{width:1365,height:900},{width:1200,height:600},{width:390,height:844}]){
  await page.setViewportSize(v);await page.evaluate(()=>journey.open('certificate'));
  const fit=await page.locator('#journey-dialog').evaluate(el=>({scroll:el.scrollHeight,client:el.clientHeight,width:el.scrollWidth,inner:el.clientWidth}));
  assert(fit.scroll<=fit.client+1,`Certificate scroll ${v.width}: ${JSON.stringify(fit)}`);assert(fit.width<=fit.inner+1);
  const preview=await page.locator('.certificate-preview').boundingBox(),button=await page.locator('.journey-download').boundingBox();
  assert(preview.height>100);assert(button.y+button.height<=v.height);
  await page.screenshot({path:path.join(root,`tmp/certificate-fit-${v.width}.png`)});
  await page.locator('#journey-close').click();
 }
 console.log('PASS small retry, mail, greeting, seated Fillo and full certificate without scrolling at three viewport sizes.');
}finally{await env.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
