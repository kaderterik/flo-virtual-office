// Retained mechanic compatibility tests. Current shipped games are tested in game-regression.cjs.
// Keep the original scenario matrix to exercise ordering, sliders and legacy mechanics.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
    const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (error, body) => {
        if (error) { res.writeHead(404).end(); return; }
        res.setHeader('Content-Type', ({'.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.png':'image/png'})[path.extname(file)] || 'application/octet-stream');
        res.end(body);
    });
});

(async () => {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const browser = await chromium.launch({headless: true, executablePath: process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
    try {
        const page = await browser.newPage({viewport: {width: 1365, height: 900}});
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.route('https://fonts.googleapis.com/**', route => route.abort());
        await page.route('**/js/simulation-data.js', route => route.fulfill({status:200,contentType:'text/javascript',body:'// Retained mechanic test configuration; no simulation overrides.'}));
        await page.goto(`http://127.0.0.1:${server.address().port}`);
        await page.evaluate(() => { localStorage.clear(); });
        page.setDefaultTimeout(8000);
        const click = selector => page.locator(selector).click();
        const slider = (i, value) => page.locator(`[data-slider="${i}"]`).evaluate((el, value) => {
            el.value = value; el.dispatchEvent(new Event('input', {bubbles: true}));
        }, String(value));
        const action = name => click(`[data-action="${name}"]`);
        const begin = async id => {
            await page.evaluate(id => { enterDepartment(id); openGameView(); }, id);
            assert.equal(await page.locator('.mg-intro').count(), 1);
            const dept = await page.evaluate(id => departmentsData[id], id);
            assert.equal(await page.locator('.mg-intro h3').innerText(), dept.gameTitle);
            if (id === 1) await page.screenshot({path: path.join(root, 'tmp/game-theme-intro.png')});
            assert.match(await page.locator('.mg-intro').innerText(), new RegExp(dept.taskSummary.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
            await action('start');
            assert.equal(await page.locator('[data-feedback-provider]').count(), 1);
            assert.equal(await page.locator('.mg-fillo-corner').count(), 1);
        };
        const move = async (id, bin) => {
            await click(`[data-card="${id}"]`);
            await click(`[data-target="${bin}"]`);
        };
        const won = async () => {
            await completeDecisions(page);
            assert.match(await page.locator('.mg-result').innerText(), /Rozetin kazanıldı/);
        };
        const completeDecisions = async target => {
            await target.locator('.mg-case, .mg-result').first().waitFor();
            while (await target.locator('.mg-case').count()) {
                const choice = await target.evaluate(() => {
                    const index = Number(document.querySelector('.mg-case').dataset.missionIndex);
                    return departmentMissions[currentDeptId][index].choices.findIndex(choice=>choice.points===2);
                });
                await target.locator(`[data-action="case-choice"][data-choice="${choice}"]`).click();
                await target.locator('[data-action="case-next"]').click();
            }
        };
        const order = async () => {
            const length = await page.locator('.mg-order-row').count();
            for (let id = 0; id < length; id++) {
                while (await page.locator('.mg-order-row').evaluateAll((rows, target) => rows.findIndex(row => row.querySelector('[data-card]').dataset.card === String(target)), id) > id) {
                    await click(`[data-action="up"][data-id="${id}"]`);
                }
            }
        };
        for (let id = 1; id <= 20; id++) {
            await begin(id);
            const c = await page.evaluate(id => departmentGames[id], id);
            if (['order', 'flow', 'ranking', 'timeline'].includes(c.type)) {
                await action('submit');
                assert(await page.locator('.mg-invalid').count() > 0);
                await order();
                if (c.days) for (let i = 0; i < c.days.length; i++) {
                    await slider(i, c.days[i]);
                }
                await action('submit');
            } else if (c.type === 'match') {
                if (!c.live) {
                    await action('submit');
                    assert(await page.locator('.mg-invalid').count() > 0);
                }
                for (let i = 0; i < c.items.length; i++) if (c.items[i][1] >= 0) await move(i, c.items[i][1]);
                if (!c.live) await action('submit');
            } else if (c.type === 'budget') {
                await action('submit');
                assert.match(await page.locator('.mg-feedback').innerText(), /tam 100/);
                for (let i = 0; i < 5; i++) await slider(i, c.stores[i].ideal);
                await action('submit');
                assert.match(await page.locator('[data-primary-score]').innerText(), /100\/100/);
            } else if (c.type === 'sortTimed' || c.type === 'materials') {
                for (let i = 0; i < c.items.length; i++) {
                    const card = Number(await page.locator('[data-card]').getAttribute('data-card'));
                    await click(`[data-answer="${Number(c.items[card][1])}"]`);
                    if (c.type === 'materials') await action('next');
                }
            } else if (c.type === 'stock') {
                await click('[data-action="stock"][data-id="0"]');
                assert.match(await page.locator('.mg-counter').innerText(), /2 can/);
                for (const row of [1, 4, 6]) await click(`[data-action="stock"][data-id="${row}"]`);
            } else if (c.type === 'routing') {
                for (const round of c.rounds) {
                    await click(`[data-answer="${round.answer}"]`); await action('next');
                }
            } else if (c.type === 'markets') {
                for (let i = 0; i < 4; i++) {
                    await click(`[data-action="country"][data-id="${i}"]`);
                    await click(`[data-action="market"][data-answer="${c.countries[i].answer}"]`);
                }
                await action('submit');
            } else if (c.type === 'hidden') {
                for (let i = 0; i < 5; i++) await click(`[data-action="spot"][data-id="${i}"]`);
                await action('submit');
            } else if (c.type === 'kanban') {
                await move(0, 2);
                assert.match(await page.locator('.mg-feedback').innerText(), /Durumu yeniden oku/);
                assert.equal(await page.locator('[data-drop="0"] [data-card="0"]').count(), 1);
                // Test and release cards go directly to their destinations, without development.
                await move(2, 2);
                await move(4, 3);
                assert.equal(await page.locator('[data-drop="2"] [data-card="2"]').count(), 1);
                assert.equal(await page.locator('[data-drop="3"] [data-card="4"]').count(), 1);
                for (let card = 0; card < c.tasks.length; card++) if (![2,4].includes(card)) await move(card, c.tasks[card].answer);
            } else if (c.type === 'crisis') {
                for (let step = 0; step < 4; step++) await click('[data-action="crisis"][data-answer="0"]');
            }
            await won();
            assert.equal(await page.locator('.mg-confetti').count(), 1);
            console.log(`PASS ${id}: ${c.name}`);
        }
        assert.equal(await page.locator('#badge-count').innerText(), '20');
        await begin(1); await order(); await action('submit');
        await completeDecisions(page);
        assert.equal(await page.locator('#badge-count').innerText(), '20', 'No duplicate badges');
        await page.reload();
        assert.equal(await page.locator('#badge-count').innerText(), '20', 'Progress persists');
        for (const correctCount of [3, 4]) {
            await begin(20);
            const rounds = await page.evaluate(() => departmentGames[20].rounds);
            for (let i = 0; i < rounds.length; i++) {
                const choice = i < correctCount ? rounds[i].answer : (rounds[i].answer + 1) % 5;
                if (i === 0) {
                    const source = await page.locator('[data-card="0"]').boundingBox();
                    const target = await page.locator(`[data-answer="${choice}"]`).boundingBox();
                    await page.mouse.move(source.x + source.width / 2, source.y + source.height / 2);
                    await page.mouse.down();
                    await page.mouse.move(target.x + target.width / 2, target.y + target.height / 2, {steps: 12});
                    await page.mouse.up();
                    assert.match(await page.locator('.mg-counter').innerText(), /1 doğru/);
                } else await click(`[data-answer="${choice}"]`);
                await action('next');
            }
            await completeDecisions(page);
            assert.equal((await page.locator('.mg-result').innerText()).includes('Rozetin kazanıldı'), correctCount === 4);
        }
        await page.setViewportSize({width: 390, height: 844});
        await begin(20);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await page.screenshot({path: path.join(root, 'tmp/logistics-mobile.png'), fullPage: true});
        await page.setViewportSize({width: 1365, height: 900});
        console.log('PASS logistics drag, 3/5 failure, 4/5 success, mobile overflow');
        await begin(6);
        await page.clock.install();
        await page.clock.fastForward(21000);
        assert.match(await page.locator('.mg-result').innerText(), /Süre doldu/);
        await action('retry'); await action('start');
        await click('#btn-back-to-dialogue');
        await page.clock.fastForward(25000);
        assert.equal(await page.locator('#room-dialogue-view').evaluate(el => el.classList.contains('hidden')), false);
        await page.clock.resume();
        // Real pointer drag on desktop.
        await begin(2);
        const from = await page.locator('[data-card="0"]').boundingBox();
        const to = await page.locator('[data-target="2"]').boundingBox();
        await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
        await page.mouse.down();
        await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, {steps: 12});
        const preview = await page.locator('.mg-drag-preview').boundingBox();
        assert(preview, 'Dragged card must be visible');
        assert(Math.abs(preview.x - (to.x + to.width / 2 - from.width / 2)) < 2);
        assert(Math.abs(preview.y - (to.y + to.height / 2 - from.height / 2)) < 2);
        await page.screenshot({path: path.join(root, 'tmp/card-drag-preview.png')});
        await page.mouse.up();
        assert.equal(await page.locator('.mg-drag-preview').count(), 0);
        assert.equal(await page.locator('.mg-bin[data-drop="2"] [data-card="0"]').count(), 1);
        await page.screenshot({path: path.join(root, 'tmp/games-desktop.png'), fullPage: true});
        await page.setViewportSize({width: 390, height: 844});
        await begin(13);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await page.screenshot({path: path.join(root, 'tmp/games-mobile.png'), fullPage: true});
        assert.deepEqual(errors, []);
        console.log('PASS persistence, duplicate prevention, timeout, cleanup, pointer drag, mobile overflow, no runtime errors');
        // Touch pointer events on an actual mobile browser context (not mouse emulation).
        const mobile = await browser.newContext({viewport: {width: 390, height: 844}, hasTouch: true, isMobile: true});
        const touchPage = await mobile.newPage();
        await touchPage.route('https://fonts.googleapis.com/**', route => route.abort());
        await touchPage.route('**/js/simulation-data.js', route => route.fulfill({status:200,contentType:'text/javascript',body:'// Retained mechanic test configuration; no simulation overrides.'}));
        await touchPage.goto(`http://127.0.0.1:${server.address().port}`);
        await touchPage.evaluate(() => { enterDepartment(13); openGameView(); });
        await touchPage.locator('[data-action="start"]').tap();
        await touchPage.locator('[data-card="0"]').scrollIntoViewIfNeeded();
        await touchPage.locator('[data-target="1"]').scrollIntoViewIfNeeded();
        const touchFrom = await touchPage.locator('[data-card="0"]').boundingBox();
        const touchTo = await touchPage.locator('[data-target="1"]').boundingBox();
        const cdp = await mobile.newCDPSession(touchPage);
        const x = touchFrom.x + touchFrom.width / 2, y = touchFrom.y + touchFrom.height / 2;
        const endX = touchTo.x + touchTo.width / 2, endY = touchTo.y + touchTo.height / 2;
        await cdp.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x, y}]});
        for (let i = 1; i <= 8; i++) await cdp.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: x + (endX - x) * i / 8, y: y + (endY - y) * i / 8}]});
        assert.equal(await touchPage.locator('.mg-drag-preview').isVisible(), true);
        await cdp.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
        assert.equal(await touchPage.locator('.mg-drag-preview').count(), 0);
        assert.equal(await touchPage.locator('[data-drop="1"] [data-card="0"]').count(), 1);
        await touchPage.locator('[data-card="1"]').tap();
        await touchPage.locator('[data-target="1"]').tap();
        assert.equal(await touchPage.locator('[data-drop="1"] [data-card="1"]').count(), 1);
        await touchPage.evaluate(() => { enterDepartment(2); openGameView(); });
        await touchPage.screenshot({path: path.join(root, 'tmp/game-theme-intro-mobile.png')});
        await touchPage.locator('[data-action="start"]').tap();
        await touchPage.screenshot({path: path.join(root, 'tmp/games-product-mobile.png')});
        assert.equal(await touchPage.locator('.mg-arena').evaluate(el => el.scrollWidth <= el.clientWidth + 1), true, 'Mission board must fit inside mobile panel');
        assert.equal(await touchPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        for (const [id, bin] of [[0,2],[1,4],[2,0],[3,1],[4,3]]) {
            await touchPage.locator(`[data-card="${id}"]`).tap();
            await touchPage.locator(`[data-target="${bin}"]`).tap();
        }
        await completeDecisions(touchPage);
        assert.match(await touchPage.locator('.mg-result').innerText(), /Rozetin kazanıldı/);
        console.log('PASS mobile product mission through tap controls');
        await touchPage.evaluate(() => enterDepartment(1));
        await touchPage.locator('#room-explore-toggle').tap();
        await touchPage.locator('#room-explore-menu button').first().tap();
        assert.equal(await touchPage.locator('#room-info-panel').isVisible(), true);
        await touchPage.screenshot({path: path.join(root, 'tmp/room-explore-mobile.png')});
        await touchPage.locator('#room-info-close').tap();
        await touchPage.locator('#room-explore-toggle').tap();
        await touchPage.locator('#room-explore-menu button').nth(1).tap();
        await touchPage.locator('#room-info-task').tap();
        assert.equal(await touchPage.locator('.mg-intro').isVisible(), true);
        await mobile.close();
        await begin(17);
        for (let i = 0; i < 4; i++) await click(`[data-action="crisis"][data-answer="1"]`);
        assert.match(await page.locator('.mg-result').innerText(), /Bir tur daha/);
        await begin(4);
        await slider(0, 100); await slider(1, 100); await action('submit');
        assert.equal(await page.locator('.mg-result').count(), 0);
        assert.match(await page.locator('[data-total]').innerText(), /Bütçe aşıldı/);
        await begin(1);
        const lastId = await page.locator('.mg-order-row').last().locator('[data-card]').getAttribute('data-card');
        await page.locator(`[data-action="up"][data-id="${lastId}"]`).focus();
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('.mg-order-row').nth(3).locator('[data-card]').getAttribute('data-card'), lastId);
        console.log('PASS touch drag, tap alternative, crisis failure branch, budget overflow, keyboard reorder');
        await page.setViewportSize({width: 1365, height: 900});
        await begin(2);
        assert.equal(await page.locator('.mg-station [data-card]').count(), 0, 'No prefilled task masquerades as tutorial');
        await move(4, 2);
        assert.match(await page.locator('[data-lives]').innerText(), /1 hak/);
        assert.equal(await page.locator('.mg-deck [data-card="4"]').count(), 1, 'Wrong card returns');
        assert.equal(await page.locator('.mg-hit-wrong').count(), 1);
        await move(4, 3);
        assert.match(await page.locator('[data-live-score]').innerText(), /1\/5/);
        await move(4, 'bank');
        assert.match(await page.locator('[data-live-score]').innerText(), /0\/5/);
        await move(4, 2);
        assert.match(await page.locator('.mg-result').innerText(), /2 hata/);
        await action('retry'); await action('start');
        assert.match(await page.locator('[data-lives]').innerText(), /2 hak/);
        for (const [id, bin] of [[0,2],[1,4],[2,0],[3,1],[4,3]]) await move(id, bin);
        await won();
        assert.equal(await page.locator('.mg-confetti').count(), 1);
        await page.screenshot({path: path.join(root, 'tmp/games-product-win.png')});
        await begin(2);
        for (const [id, bin] of [[0,2],[1,4],[2,0],[3,1],[4,3]]) await move(id, bin);
        await page.evaluate(() => exitDepartment());
        await new Promise(resolve => setTimeout(resolve, 800));
        assert.equal(await page.locator('#department-screen').evaluate(el => el.classList.contains('active')), false);
        console.log('PASS immediate feedback, two-mistake loss, undo scoring, reset, automatic victory and cancelled finish');
        for (let id = 1; id <= 19; id++) {
            await page.evaluate(id => enterDepartment(id), id);
            assert.equal(await page.locator('.room-info-point').count(), 5);
        }
        await page.evaluate(() => enterDepartment(1));
        await page.locator('.room-info-point').first().click();
        assert.match(await page.locator('#room-info-title').innerText(), /Özlük/);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#room-info-panel').isVisible(), false);
        assert.equal(await page.locator('.room-info-point').first().evaluate(el => el === document.activeElement), true);
        await page.locator('#room-explore-toggle').click();
        for (let i = 0; i < 5; i++) {
            await page.locator('#room-explore-menu button').nth(i).click();
            await page.locator('#room-info-close').click();
            if (i < 4) await page.locator('#room-explore-toggle').click();
        }
        assert.match(await page.locator('#room-explore-toggle').innerText(), /5\/5/);
        await page.screenshot({path: path.join(root, 'tmp/room-explore-desktop.png')});
        await page.evaluate(() => { enterDepartment(20); openGameView(); });
        assert.match(await page.locator('.mg-intro').innerText(), /Sevkiyat Yönlendirme/);
        await page.evaluate(() => { const original = departmentsData[1].gameComponent; departmentsData[1].gameComponent = 'missing-component'; enterDepartment(1); openGameView(); departmentsData[1].gameComponent = original; });
        assert.match(await page.locator('.mg-empty').innerText(), /Yakında/);
        assert.deepEqual(errors, []);
        console.log('PASS shared intro/provider/completion in 20 games, hotspot content/navigation, mobile discovery, missing component fallback');
        for (const id of [3, 6]) {
            await begin(id);
            if (id === 6) await click('[data-action="stock"][data-id="1"]');
            else {
                const cardId = Number(await page.locator('[data-card]').getAttribute('data-card'));
                const answer = await page.evaluate(cardId => departmentGames[3].items[cardId][1], cardId);
                await click(`[data-answer="${answer}"]`);
            }
            const before = await page.locator('[data-live-score]').innerText();
            await action('pause');
            const pausedText = await page.locator('.mg-pause-panel').innerText();
            await page.clock.fastForward(60000);
            assert.equal(await page.locator('.mg-pause-panel').innerText(), pausedText);
            assert.equal(await page.locator('.mg-result').count(), 0);
            await action('resume');
            assert.equal(await page.locator('[data-live-score]').innerText(), before);
            assert.equal(await page.locator('[data-action="pause"]').evaluate(el => el === document.activeElement), true);
            await action('pause'); await action('resume');
            await page.clock.fastForward(31000);
            assert.match(await page.locator('.mg-result').innerText(), /Süre doldu/);
        }
        // Change content counts at runtime to prove totals and completion use data.
        const variants = await page.evaluate(() => {
            const results = [];
            const run = (id, change, solve) => {
                const original = departmentGames[id];
                departmentGames[id] = structuredClone(original);
                change(departmentGames[id]);
                enterDepartment(id); openGameView();
                document.querySelector('[data-action="start"]').click();
                solve(departmentGames[id]);
                while (document.querySelector('.mg-case')) {
                    const index = Number(document.querySelector('.mg-case').dataset.missionIndex);
                    const choice = departmentMissions[id][index].choices.findIndex(v=>v.points===2);
                    document.querySelector(`[data-action="case-choice"][data-choice="${choice}"]`).click();
                    document.querySelector('[data-action="case-next"]').click();
                }
                results.push(document.querySelector('.mg-score')?.textContent);
                departmentGames[id] = original;
            };
            run(13, c => { c.tasks.push({title:'Ek görev', status:'Teslimat onayı bekliyor.', answer:4}); c.bins.push('Teslimat Onayı'); }, c => {
                c.tasks.forEach((task, id) => {
                    document.querySelector(`[data-card="${id}"]`).click(); document.querySelector(`[data-target="${task.answer}"]`).click();
                });
            });
            run(12, c => c.spots.push({x: 40, y: 80, icon: '!', label: 'Ek nokta', detail: 'Yeni gözlem'}), c => {
                c.spots.forEach((_, id) => document.querySelector(`[data-action="spot"][data-id="${id}"]`).click());
                document.querySelector('[data-action="submit"]').click();
            });
            run(10, c => c.countries.push({name: 'Ek Pazar', x: 20, y: 20, answer: 1, profile: 'Örnek'}), c => {
                c.countries.forEach((country, id) => {
                    document.querySelector(`[data-action="country"][data-id="${id}"]`).click();
                    document.querySelector(`[data-action="market"][data-answer="${country.answer}"]`).click();
                }); document.querySelector('[data-action="submit"]').click();
            });
            run(8, c => c.rounds.push(structuredClone(c.rounds[0])), c => {
                c.rounds.forEach(round => {
                    document.querySelector(`[data-action="route"][data-answer="${round.answer}"]`).click();
                    document.querySelector('[data-action="next"]').click();
                });
            });
            run(6, c => c.rows.push(['Ek ürün', 9, 5]), c => {
                c.rows.forEach((row, id) => { if (row[1] !== row[2]) document.querySelector(`[data-action="stock"][data-id="${id}"]`).click(); });
            });
            return results;
        });
        assert.deepEqual(variants, ['13 / 13 görev puanı', '12 / 12 görev puanı', '11 / 11 görev puanı', '12 / 12 görev puanı', '10 / 10 görev puanı']);
        await begin(12);
        assert.equal(await page.locator('.mg-office').evaluate(el => getComputedStyle(el).borderTopColor), 'rgb(26, 26, 26)');
        await page.screenshot({path: path.join(root, 'tmp/waste-hunter-theme.png')});
        assert.deepEqual(errors, []);
        console.log('PASS manual pause/resume in both timed games, score preservation, expanded data counts, office theme');
    } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
