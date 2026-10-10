// Standalone canvas certificate: the on-screen image and download share the same pixels.
const CertificateArt = (() => {
    const familyNames={analitik:'Analitik',teknoloji:'Teknoloji',yaratıcı:'Yaratıcı',insan:'İnsan ve iletişim',ticari:'Ticari'};
    function model(completed,scores,depts,games){
        const ids=Object.keys(games).map(Number).sort((a,b)=>a-b),done=new Set(completed);
        const rows=ids.map(id=>({id,title:depts[id].title,badge:games[id].badge,done:done.has(id),score:done.has(id)?scores[id]:null}));
        const recorded=rows.filter(row=>row.score);
        const groups=Object.entries(familyNames).map(([key,label])=>{
            const entries=recorded.filter(row=>depts[row.id].family===key);
            return {label,count:entries.length,percent:entries.length?entries.reduce((sum,row)=>sum+row.score.percent,0)/entries.length:null};
        });
        return {rows,groups,completed:rows.filter(row=>row.done).length,total:rows.length,count:recorded.length,
            average:recorded.length?recorded.reduce((sum,row)=>sum+row.score.percent,0)/recorded.length:null};
    }
    function render(data){
        const canvas=document.createElement('canvas');canvas.width=1400;canvas.height=1000;
        const ctx=canvas.getContext('2d');if(!ctx)return null;
        const ink='#594b43',muted='#7d736e',pink='#9a687e';
        function box(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}}
        function text(value,x,y,size=20,color=ink,weight=400,align='left'){ctx.font=`${weight} ${size}px Arial, sans-serif`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(value,x,y);}
        function heart(x,y,size,color){ctx.save();ctx.translate(x,y);ctx.scale(size,size);ctx.beginPath();ctx.moveTo(0,.3);ctx.bezierCurveTo(-1,-.35,-.7,-1.05,0,-.65);ctx.bezierCurveTo(.7,-1.05,1,-.35,0,.3);ctx.fillStyle=color;ctx.fill();ctx.restore();}
        function wrap(value,width,size,weight=700){ctx.font=`${weight} ${size}px Arial, sans-serif`;const lines=[];let line='';for(const word of value.split(' ')){const next=line?line+' '+word:word;if(ctx.measureText(next).width>width&&line){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);return lines;}
        function fit(value,width,size,maxLines=2){let lines=wrap(value,width,size);while(lines.length>maxLines&&size>11)lines=wrap(value,width,--size);return {lines,size};}
        ctx.fillStyle='#f3e5e9';ctx.fillRect(0,0,1400,1000);
        box(20,20,1360,960,32,'#f8edf0','#cfaeb9');
        box(34,34,1332,932,26,'#fffaf1','#e4cfd5');
        for(const [x,y,s] of [[1330,78,20],[80,923,16],[1320,923,16],[1288,135,10]])heart(x,y,s,'#e49ab6');
        // Draw Fillo directly into the canvas so the download includes the mascot.
        ctx.save();ctx.translate(80,58);ctx.scale(.92,.92);
        ctx.strokeStyle='#66564b';ctx.lineWidth=3;ctx.lineJoin='round';
        function oval(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();ctx.stroke();}
        oval(27,52,24,29,'#a9c8cc');oval(113,52,24,29,'#a9c8cc');
        oval(27,52,15,21,'#ecc2ca');oval(113,52,15,21,'#ecc2ca');
        box(36,83,68,55,16,'#ed8b4b','#66564b');
        oval(37,135,19,10,'#b5d0d1');oval(102,135,19,10,'#b5d0d1');
        oval(70,52,37,38,'#b5d0d1');
        box(44,5,52,21,12,'#ee974f','#66564b');box(32,22,76,10,5,'#ffd08b','#66564b');
        ctx.beginPath();ctx.moveTo(49,50);ctx.quadraticCurveTo(55,41,61,50);ctx.moveTo(79,50);ctx.quadraticCurveTo(85,41,91,50);ctx.stroke();
        oval(46,63,6,3,'#eab0ba');oval(94,63,6,3,'#eab0ba');
        box(64,58,13,40,7,'#b5d0d1','#66564b');
        oval(32,107,10,16,'#b5d0d1');oval(108,107,10,16,'#b5d0d1');
        text('FLO',70,121,19,'#fffaf1',800,'center');
        ctx.restore();
        text('FLO  ·  STAJ 2026',700,76,18,pink,700,'center');
        text('Fillo’nun Yolculuğu',700,128,43,ink,800,'center');
        text('KEŞİF VE ÖĞRENME SERTİFİKASI',700,163,17,muted,700,'center');
        box(220,184,960,52,22,'#f4e3e9','#d5b3c0');
        text(`${data.completed}/${data.total} departman tamamlandı`,470,218,23,ink,700,'center');
        text(data.average===null?'Oyun ortalaması: henüz skor yok':`Genel oyun ortalaması: %${data.average.toFixed(1)}`,930,218,21,pink,700,'center');
        text('Alanlara göre en iyi görev sonuçlarım',64,273,21,ink,700);
        const gap=12,w=(1272-4*gap)/5;
        data.groups.forEach((group,i)=>{
            const x=64+i*(w+gap);box(x,288,w,96,16,'#f7eaf0','#dfc5d0');
            text(group.label,x+16,314,16,ink,700);
            text(group.percent===null?'—':`%${group.percent.toFixed(1)}`,x+16,348,28,pink,800);
            text(`${group.count} kayıtlı görev`,x+16,371,14,muted);
        });
        text('Departmanlarım ve rozetlerim',64,422,21,ink,700);
        data.rows.forEach((row,i)=>{
            const x=64+(i%5)*(w+gap),y=440+Math.floor(i/5)*112;
            box(x,y,w,100,14,row.done?'#fffdf8':'#eeede7',row.done?'#ddc6ce':'#d5d2c8');
            const title=fit(`${row.id}. ${row.title}`,w-28,15);
            title.lines.forEach((line,j)=>text(line,x+14,y+22+j*(title.size+2),title.size,ink,700));
            if(row.done){
                const badge=fit(row.badge,w-28,13);
                badge.lines.forEach((line,j)=>text(line,x+14,y+57+j*(badge.size+1),badge.size,muted));
                text(row.score?`${row.score.score}/${row.score.total} puan  ·  %${row.score.percent}`:'Rozet var · skor kaydı yok',x+14,y+88,row.score?16:13,row.score?pink:muted,700);
            }else text('Henüz tamamlanmadı',x+14,y+79,14,muted);
        });
        ctx.strokeStyle='#dbc2cb';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(64,907);ctx.lineTo(1336,907);ctx.stroke();
        text('Yüzde = puan / toplam puan × 100. Alan oranları, kayıtlı en iyi yüzdelerin eşit ağırlıklı ortalamasıdır.',700,934,14,muted,400,'center');
        text('Fillo ile keşfettim, öğrendim; her adımda yeni bir rozet kazandım.',700,958,15,ink,700,'center');
        text(`Kişisel oyun ve öğrenme özeti · ${data.count} skor kaydı`,64,975,12,muted);
        text(new Date().toLocaleDateString('tr-TR',{timeZone:'Europe/Istanbul'}),1336,975,12,muted,400,'right');
        canvas.dataset.certificateSummary=JSON.stringify(data);
        return canvas;
    }
    return {model,render};
})();
