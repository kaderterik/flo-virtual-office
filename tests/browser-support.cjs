const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const root=path.resolve(__dirname,'..');
async function openBrowser(){
    const server=http.createServer((req,res)=>{
        const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));
        if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
        fs.readFile(file,(error,body)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png'}[path.extname(file)]||'application/octet-stream');res.end(body);});
    });
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
    const page=await browser.newPage({viewport:{width:1365,height:900}}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('https://fonts.googleapis.com/**',route=>route.abort());
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    return {page,browser,errors,root,close:async()=>{await browser.close();server.close();}};
}
async function begin(page,id){
    await page.evaluate(id=>{enterDepartment(id);openGameView();},id);
    await page.locator('[data-action="start"]').click();
}
// Solve through public DOM controls; no direct writes to private game sessions.
async function solvePrimary(page,id){
    await page.evaluate(id=>{
        const c=departmentGames[id];
        const act=(name,id,value)=>{const selector=`[data-action="${name}"]${id===undefined?'':`[data-id="${id}"]`}${value===undefined?'':`[data-value="${value}"]`}`;const el=document.querySelector(selector);if(!el)throw new Error('Missing control '+selector);el.click();};
        const move=(card,target)=>{document.querySelector(`[data-card="${card}"]`).click();document.querySelector(`[data-target="${target}"]`).click();};
        if(c.type==='hiring'){act('sim-interview',0,0);act('sim-interview',0,1);act('sim-hire',0);}
        else if(c.type==='allocation'){[8,6,5,1,0].forEach((count,i)=>{for(let n=0;n<count;n++)act('sim-allocate',i,1);});act('sim-allocation-submit');}
        else if(c.type==='audit'){c.rows.forEach((row,i)=>{const input=document.querySelector(`[data-sim-input="${i}"]`);input.value=row.system+row.delta;input.dispatchEvent(new Event('input',{bubbles:true}));const reason=document.querySelector(`[data-sim-reason="${i}"]`);reason.value=row.reason;reason.dispatchEvent(new Event('input',{bubbles:true}));});act('sim-audit-submit');}
        else if(c.type==='fulfillment'){[[1,0],[3,0],[0,1],[4,1],[2,2]].forEach(([order,node])=>{act('sim-order',order);act('sim-ship',node);});}
        else if(c.type==='vitrine'){[0,1,5].forEach((product,slot)=>{act('sim-slot',slot);act('sim-product',product);});act('sim-vitrine-submit');}
        else if(c.type==='kaizen'){c.stations.forEach((station,i)=>{act('sim-station',i);act('sim-diagnose',station.category);act('sim-remedy',station.answer);act('sim-kaizen-commit');});act('sim-kaizen-submit');}
        else if(c.type==='sprint'){
            act('sim-task-next',0);act('sim-task-next',1);act('sim-sprint-tick');act('sim-task-next',1);act('sim-task-next',4);act('sim-sprint-tick');act('sim-task-next',1);act('sim-task-next',0);act('sim-task-next',3);act('sim-sprint-tick');act('sim-task-next',0);act('sim-task-next',4);act('sim-task-next',2);act('sim-sprint-tick');act('sim-task-next',4);act('sim-task-next',3);act('sim-sprint-tick');act('sim-task-next',3);act('sim-task-next',2);act('sim-sprint-tick');act('sim-task-next',2);
        }
        else if(c.type==='project'){
            act('sim-project-start',0);act('sim-project-tick');act('sim-project-tick');act('sim-project-start',1);act('sim-project-start',2);act('sim-project-tick');act('sim-project-tick');act('sim-project-tick');act('sim-project-start',3);act('sim-project-tick');act('sim-project-tick');act('sim-project-start',4);act('sim-project-tick');act('sim-project-start',5);act('sim-project-tick');
        }
        else if(c.type==='dispatch'){[[0,0],[1,0],[2,1],[3,1],[4,2]].forEach(([cargo,truck])=>{act('sim-cargo',cargo);act('sim-load',truck);});act('sim-depart',0);act('sim-depart',1);act('sim-depart',2);}
        else if(['order','flow','ranking','timeline'].includes(c.type)){
            for(let card=0;card<c.items.length;card++){while([...document.querySelectorAll('.mg-order-row')].findIndex(row=>row.querySelector('[data-card]').dataset.card===String(card))>card)act('up',card);}act('submit');
        }
        else if(c.type==='match'){c.items.forEach((item,i)=>{if(item[1]>=0)move(i,item[1]);});if(!c.live)act('submit');}
        else if(['sortTimed','materials'].includes(c.type)){for(let n=0;n<c.items.length;n++){const card=Number(document.querySelector('[data-card]').dataset.card);document.querySelector(`[data-answer="${Number(c.items[card][1])}"]`).click();if(c.type==='materials')act('next');}}
        else if(c.type==='markets'){c.countries.forEach((country,i)=>{act('country',i);document.querySelector(`[data-action="market"][data-answer="${country.answer}"]`).click();});act('submit');}
        else if(c.type==='crisis'){for(let n=0;n<4;n++)document.querySelector('[data-action="crisis"][data-answer="0"]').click();}
        else throw new Error('Unknown type '+c.type);
    },id);
    await page.locator('.mg-case,.mg-result').first().waitFor();
}
async function decisions(page,points=[2,2,2]){
    for(const point of points){
        const choice=await page.evaluate(point=>{const index=Number(document.querySelector('.mg-case').dataset.missionIndex);return departmentMissions[currentDeptId][index].choices.findIndex(c=>c.points===point);},point);
        await page.locator(`[data-action="case-choice"][data-choice="${choice}"]`).click();
        await page.locator('[data-action="case-next"]').click();
    }
}
module.exports={openBrowser,begin,solvePrimary,decisions};
