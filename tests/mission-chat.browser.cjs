const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
    const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
    fs.readFile(file, (error, body) => {
        if (error) return res.writeHead(404).end();
        res.setHeader('Content-Type', {'.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.webp':'image/webp'}[path.extname(file)] || 'application/octet-stream');
        res.end(body);
    });
});
(async () => {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const browser = await chromium.launch({headless:true, executablePath:process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
    try {
        const page = await browser.newPage({viewport:{width:1365,height:900}});
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.route('https://fonts.googleapis.com/**', route=>route.abort());
        await page.goto(`http://127.0.0.1:${server.address().port}`);
        const coverage = await page.evaluate(() => Object.keys(departmentGames).map(id => ({id,
            count: departmentMissions[id].length,
            valid: departmentMissions[id].every(m=>m.evidence.length>=3 && m.choices.length===3 &&
                m.choices.filter(c=>c.points===2).length===1 && new Set(m.choices.map(c=>c.points)).size===3 &&
                m.choices.every(c=>c.label.length>0 && c.consequence.length>20))})));
        assert.equal(coverage.length,20);
        assert(coverage.every(row=>row.count===3 && row.valid));
        const prepare = async id => page.evaluate(id => {
            enterDepartment(id); openGameView(); document.querySelector('[data-action="start"]').click();
            if (id === 1) {
                document.querySelector('[data-action="sim-interview"][data-id="0"][data-value="0"]').click();
                document.querySelector('[data-action="sim-interview"][data-id="0"][data-value="1"]').click();
                document.querySelector('[data-action="sim-hire"][data-id="0"]').click();
            } else if(id===4) {
                [8,6,5,1,0].forEach((count,i)=>{for(let n=0;n<count;n++)document.querySelector(`[data-action="sim-allocate"][data-id="${i}"][data-value="1"]`).click();});
                document.querySelector('[data-action="sim-allocation-submit"]').click();
            }
        },id);
        const decide = async points => {
            const choice = await page.evaluate(points => {
                const index=Number(document.querySelector('.mg-case').dataset.missionIndex);
                return departmentMissions[currentDeptId][index].choices.findIndex(c=>c.points===points);
            },points);
            await page.locator(`[data-choice="${choice}"]`).click();
            assert(await page.locator('.mg-case-consequence').isVisible());
            await page.locator(`[data-choice="${choice}"]`).evaluate(el=>el.dispatchEvent(new MouseEvent('click',{bubbles:true})));
            await page.locator('[data-action="case-next"]').click();
        };
        await prepare(1);
        assert.equal(await page.locator('#badge-count').innerText(),'0','No badge before decisions');
        await page.screenshot({path:path.join(root,'tmp/mission-desktop.png')});
        for(const score of [0,2,2]) await decide(score);
        assert.match(await page.locator('.mg-result').innerText(),/Bir tur daha/);
        assert.equal(await page.locator('#badge-count').innerText(),'0','4/6 decisions fails even with a perfect preparation');
        assert.equal(await page.evaluate(()=>journeyData.scores()[1].score),98.11,'A repeated click must not award points twice');
        assert.equal(await page.evaluate(()=>journeyData.scores()[1].total),100,'Final scores use a hundred-point scale');
        await prepare(1);
        for(const score of [1,2,2]) await decide(score);
        assert.match(await page.locator('.mg-result').innerText(),/Rozetin kazanıldı/);
        assert.equal(await page.locator('#badge-count').innerText(),'1');
        assert.match(await page.locator('.mg-report').innerText(),/Karar masası: 5\/6/);
        await prepare(4);
        await page.evaluate(()=>exitDepartment());
        assert.equal(await page.locator('#badge-count').innerText(),'1','Leaving a case does not award a badge');
        await page.evaluate(()=> {
            enterDepartment(4);openGameView();document.querySelector('[data-action="start"]').click();
            [0,2,8,5,5].forEach((count,i)=>{for(let n=0;n<count;n++)document.querySelector(`[data-action="sim-allocate"][data-id="${i}"][data-value="1"]`).click();});
            document.querySelector('[data-action="sim-allocation-submit"]').click();
        });
        assert.match(await page.locator('.mg-result').innerText(),/Bir tur daha/);
        assert.equal(await page.locator('.mg-case').count(),0,'A weak budget cannot enter the decision phase');
        await prepare(4);
        await page.setViewportSize({width:390,height:844});
        assert(await page.locator('.mg-case').evaluate(el=>el.scrollWidth<=el.clientWidth+1));
        await page.screenshot({path:path.join(root,'tmp/mission-mobile.png')});
        for(const score of [2,2,2]) await decide(score);
        await page.evaluate(()=>exitDepartment());
        let requests = 0;
        await page.route('http://127.0.0.1:8000/chat', async route=> {
            if(route.request().method()==='OPTIONS') return route.fulfill({status:204,headers:{'access-control-allow-origin':'*','access-control-allow-headers':'content-type'}});
            requests++;
            await route.fulfill({status:requests===1?503:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(requests===1?{detail:'Unavailable'}:{answer:'İşe alım sürecini birlikte inceleyelim.'})});
        });
        await page.locator('#chatbot-mobile-open').click();
        assert(await page.locator('#chatbot-dialog').evaluate(el=>el.open));
        await page.locator('#chatbot-input').fill('Merhaba, işe alım nasıl ilerliyor?');
        await page.locator('#chatbot-send').click();
        await page.locator('#chatbot-retry').waitFor({state:'visible'});
        assert.equal(await page.locator('.chat-message.user').count(),1);
        await page.locator('#chatbot-retry').click();
        await page.getByText('İşe alım sürecini birlikte inceleyelim.',{exact:true}).waitFor();
        assert.equal(await page.locator('.chat-message.user').count(),1,'Retry must not duplicate the question');
        assert.equal(requests,2);
        await page.screenshot({path:path.join(root,'tmp/chatbot-mobile.png')});
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#chatbot-dialog').evaluate(el=>el.open),false);
        assert.equal(await page.locator('.sidebar #chatbot-input').count(),1,'Same chat panel returns to desktop sidebar');
        await page.locator('#chatbot-mobile-open').click();
        await page.clock.install();
        await page.unroute('http://127.0.0.1:8000/chat');
        let waiting = 0;
        await page.route('http://127.0.0.1:8000/chat', route=> {
            if(route.request().method()==='OPTIONS') return route.fulfill({status:204,headers:{'access-control-allow-origin':'*','access-control-allow-headers':'content-type'}});
            waiting++; // Leave pending to exercise timeout and duplicate-submission guard.
        });
        await page.locator('#chatbot-input').fill('Bekleyen soru');
        const pendingRequest = page.waitForRequest(req=>req.method()==='POST' && req.url().endsWith('/chat'));
        await page.locator('#chatbot-send').click();
        await pendingRequest;
        await page.locator('#chatbot-form').evaluate(el=>el.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
        await page.clock.fastForward(45001);
        await page.getByText('Yanıt beklenenden uzun sürdü. Sorunu tekrar gönderebilirsin.',{exact:true}).waitFor();
        assert.equal(waiting,1);
        assert.equal(await page.locator('#chatbot-send').isEnabled(),true);
        await page.locator('#chatbot-mobile-close').click();
        await page.clock.resume();
        await page.locator('.journey-mobile-actions [data-journey="notes"]').click();
        await page.locator('#journey-content [data-journey="settings"]').click();
        assert.match(await page.locator('#journey-content').innerText(),/geri alınamaz/);
        await page.locator('#journey-content [data-journey="notes"]').click();
        assert.equal(await page.evaluate(()=>completedDepts.length),2,'Cancel keeps progress');
        await page.locator('#journey-content [data-journey="settings"]').click();
        await page.locator('[data-reset-progress]').click();
        await page.waitForFunction(()=>typeof completedDepts!=='undefined' && completedDepts.length===0);
        assert.deepEqual(await page.evaluate(()=>journeyData.scores()),{});
        assert.deepEqual(await page.evaluate(()=>roomExplore.notes()),{});
        assert.deepEqual(errors,[]);
        console.log('PASS 60 cases, partial/failing decisions, duplicate-click guard, no early badges, weak budget, mobile cases, chatbot retry/timeout, progress reset.');
    } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;server.close();});
