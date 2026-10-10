/**
 * corridor.js
 * Canvas üzerinde FLO Ofis Koridorunu çizer.
 * Tam 20 kapı (sol 1-10, sağ 11-20) + EXIT kapısı.
 * Kapı geometrisi, app.js'teki buton konumlarıyla senkronize çalışır.
 */

const CORR = {
    W: 1400, H: 700,
    // Koridorun uzak ucundaki perspektif sınırları (piksel)
    FL: 420,   // sol duvar uzak uç x
    FR: 980,   // sağ duvar uzak uç x
    FT: 105,   // arka duvar üst y
    FB: 420,   // arka duvar alt y / zemin uzak uç y
    // Kapı geometri parametreleri (derinlik oranı olarak)
    D_START:  0.025,   // ilk kapı başlangıç boşluğu
    D_STEP:   0.097,   // kapı aralığı (kapı + boşluk)
    D_WIDTH:  0.072,   // her kapının derinlik genişliği
    D_TOP:    0.12,    // üst boşluk (tavan marjı, oran)
    D_BOT:    0.06,    // alt boşluk (zemin/süpürgelik marjı)
    // Renkler
    C: {
        bg:        '#1A0F08',
        ceiling:   '#1C1008',
        lWall:     '#7A4A2E',
        rWall:     '#6A3C1E',
        bWall:     '#4A2E18',
        floor:     '#F0D9A0',
        floorGrid: 'rgba(195,168,110,0.45)',
        doorBody:  '#A06840',
        doorDark:  '#7C5030',
        doorFrame: '#FF5A1F',
        plaque:    '#241C15',
        plaqueText:'#FFD9BB',
        handle:    '#FFD9BB',
        baseboard: '#FF5A1F',
        exitSign:  '#CC1800',
        exitText:  '#FFFFFF',
        edgeDark:  '#2A1408',
        sofa:      '#E04515',
        sofaDark:  '#B83510',
        table:     '#5C3920',
        plant:     '#2A6A28',
        pot:       '#CC6228',
        rug:       '#FF8FAE',
    }
};

// ─────────────────────────────────────────────────
// Kapı Geometri Hesabı (app.js'te de kullanılır)
// ─────────────────────────────────────────────────
function getCorridorDoorGeo(doorId) {
    const { W, H, FL, FR, FT, FB } = CORR;
    let rank, isLeft;
    if (doorId <= 10) {
        isLeft = true;
        rank = doorId - 1;    // 0=en yakın (kapı 1), 9=en uzak (kapı 10)
    } else {
        isLeft = false;
        rank = 20 - doorId;   // 0=en yakın (kapı 20), 9=en uzak (kapı 11)
    }
    const t0 = CORR.D_START + rank * CORR.D_STEP;
    const t1 = t0 + CORR.D_WIDTH;

    const wallNX = isLeft ? 0 : W;
    const wallFX = isLeft ? FL : FR;

    const wX  = t => wallNX + t * (wallFX - wallNX);
    const wTY = t => t * FT;
    const wBY = t => H - t * (H - FB);

    const x0 = wX(t0), x1 = wX(t1);
    const wyt0 = wTY(t0), wyb0 = wBY(t0);
    const wyt1 = wTY(t1), wyb1 = wBY(t1);
    const wh0  = wyb0 - wyt0, wh1 = wyb1 - wyt1;

    const top0 = wyt0 + CORR.D_TOP * wh0;
    const bot0 = wyb0 - CORR.D_BOT * wh0;
    const top1 = wyt1 + CORR.D_TOP * wh1;
    const bot1 = wyb1 - CORR.D_BOT * wh1;

    const tMid  = (t0 + t1) / 2;
    const scale = Math.max(0.38, 1.35 - tMid * 1.1);
    const zIdx  = Math.round((1 - tMid) * 100) + 10;
    const cx    = (x0 + x1) / 2;
    const cy    = (top0 + bot0) / 2;

    return {
        pts: [[x0, top0], [x1, top1], [x1, bot1], [x0, bot0]],
        cx, cy, scale, zIdx, rank, tMid, isLeft,
        // Yüzde olarak (buton konumlandırması için)
        pctLeft: (cx / W) * 100,
        pctTop:  (cy / H) * 100,
    };
}

// ─────────────────────────────────────────────────
// Ana Çizim Fonksiyonu
// ─────────────────────────────────────────────────
function drawCorridor(canvasEl) {
    const ctx = canvasEl.getContext('2d');
    const { W, H, FL, FR, FT, FB, C } = CORR;
    canvasEl.width  = W;
    canvasEl.height = H;

    // Poligon yardımcısı
    const poly = (pts, fill, stroke, sw) => {
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        pts.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
        ctx.closePath();
        if (fill)  { ctx.fillStyle   = fill;  ctx.fill();   }
        if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = sw || 2; ctx.stroke(); }
    };

    // 1 ▸ ARKA PLAN
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);

    // 2 ▸ TAVAN
    poly([[0,0],[W,0],[FR,FT],[FL,FT]], C.ceiling, C.edgeDark, 2);

    // 3 ▸ SOL DUVAR
    poly([[0,0],[0,H],[FL,FB],[FL,FT]], C.lWall, C.edgeDark, 3);
    // Sol duvar ince derinlik çizgileri (mimari doku)
    for (let i = 1; i <= 4; i++) {
        const ty = (i / 5) * H;
        const fy = FT + (i / 5) * (FB - FT);
        const fx = FL * (i / 5);
        ctx.beginPath(); ctx.moveTo(0, ty); ctx.lineTo(fx, fy);
        ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 1; ctx.stroke();
    }

    // 4 ▸ SAĞ DUVAR
    poly([[W,0],[W,H],[FR,FB],[FR,FT]], C.rWall, C.edgeDark, 3);

    // 5 ▸ ZEMİN
    poly([[0,H],[W,H],[FR,FB],[FL,FB]], C.floor, null);
    // Zemin ızgara çizgileri (perspektif)
    ctx.strokeStyle = C.floorGrid; ctx.lineWidth = 1;
    for (let s = 0; s <= 12; s++) {   // "yatay" çizgiler
        const t = s / 12;
        const y  = FB + t * (H - FB);
        const lx = FL + t * (0  - FL);
        const rx = FR + t * (W  - FR);
        ctx.beginPath(); ctx.moveTo(lx, y); ctx.lineTo(rx, y); ctx.stroke();
    }
    for (let p = 0; p <= 18; p++) {   // "dikey" çizgiler (perspektife doğru)
        const pf = p / 18;
        ctx.beginPath();
        ctx.moveTo(pf * W, H);
        ctx.lineTo(FL + pf * (FR - FL), FB);
        ctx.stroke();
    }

    // 6 ▸ ARKA DUVAR
    poly([[FL,FT],[FR,FT],[FR,FB],[FL,FB]], C.bWall, C.edgeDark, 3);
    // Arka duvarda yatay mimari çizgiler
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1;
    for (let n = 1; n <= 3; n++) {
        const hy = FT + (n / 4) * (FB - FT);
        ctx.beginPath(); ctx.moveTo(FL, hy); ctx.lineTo(FR, hy); ctx.stroke();
    }

    // 7 ▸ EXIT/ÇIKIŞ KAPISI (arka duvar ortası)
    const exW = (FR - FL) * 0.32;
    const exH = (FB - FT) * 0.80;
    const exX = (FL + FR) / 2 - exW / 2;
    const exY = FB - exH;
    // Çerçeve
    ctx.fillStyle = C.doorFrame;
    ctx.fillRect(exX - 7, exY - 7, exW + 14, exH + 14);
    // Kapı gövdesi
    ctx.fillStyle = C.doorBody;
    ctx.fillRect(exX, exY, exW, exH);
    // Panel detayı
    ctx.fillStyle = C.doorDark;
    ctx.fillRect(exX + exW*0.10, exY + exH*0.05, exW*0.80, exH*0.38);
    ctx.fillRect(exX + exW*0.10, exY + exH*0.48, exW*0.80, exH*0.42);
    // Kapı kolu
    ctx.fillStyle = C.handle;
    ctx.beginPath();
    ctx.arc(exX + exW * 0.78, exY + exH * 0.5, 5, 0, Math.PI*2);
    ctx.fill();
    // EXIT tabelası
    const sgW = exW * 0.9, sgH = 22;
    const sgX = exX + exW*0.05, sgY = exY - sgH - 6;
    ctx.fillStyle = C.exitSign;
    ctx.beginPath();
    ctx.roundRect(sgX, sgY, sgW, sgH, 4);
    ctx.fill();
    ctx.fillStyle = C.exitText;
    ctx.font = 'bold 13px "Space Mono", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('ÇIKIŞ / EXIT', exX + exW/2, sgY + sgH/2);

    // 8 ▸ SÜPÜRGELİK (turuncu şerit, iki duvar boyunca)
    // Sol
    ctx.fillStyle = C.baseboard;
    poly([[0,H],[FL,FB],[FL,FB-12],[0,H-12]], C.baseboard, null);
    // Sağ
    poly([[W,H],[FR,FB],[FR,FB-12],[W,H-12]], C.baseboard, null);

    // 9 ▸ 20 KAPISI ÇİZ
    for (let id = 1; id <= 20; id++) {
        _drawDoor(ctx, id);
    }

    // 10 ▸ LOUNGE MOBİLYALARI
    _drawLounge(ctx, W, H, FL, FR, FT, FB, C);

    // 11 ▸ TAVAN AYDINLATMA
    _drawCeilingLights(ctx, W, FL, FR, FT, C);
}

function _drawDoor(ctx, doorId) {
    const geo  = getCorridorDoorGeo(doorId);
    const pts  = geo.pts;
    const sc   = Math.max(0.35, 1.3 - geo.tMid * 1.05);
    const C    = CORR.C;

    // Kapı çerçevesi (turuncu)
    const fi = 5;
    const framePts = [
        [pts[0][0]-fi, pts[0][1]-fi],
        [pts[1][0]+fi, pts[1][1]-fi],
        [pts[2][0]+fi, pts[2][1]+fi],
        [pts[3][0]-fi, pts[3][1]+fi],
    ];
    // Doğru yön: sol kapılar için sağ tarafta +, sağ kapılar için sol tarafta +
    const isLeft = doorId <= 10;
    framePts[0] = [pts[0][0] + (isLeft?-fi:fi), pts[0][1]-fi];
    framePts[1] = [pts[1][0] + (isLeft?fi:-fi), pts[1][1]-fi];
    framePts[2] = [pts[2][0] + (isLeft?fi:-fi), pts[2][1]+fi];
    framePts[3] = [pts[3][0] + (isLeft?-fi:fi), pts[3][1]+fi];

    ctx.beginPath();
    ctx.moveTo(framePts[0][0], framePts[0][1]);
    framePts.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
    ctx.closePath();
    ctx.fillStyle = C.doorFrame;
    ctx.fill();

    // Kapı gövdesi (ahşap renk)
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    pts.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
    ctx.closePath();
    ctx.fillStyle = C.doorBody;
    ctx.fill();

    // Üst kapı paneli
    const topPanelPts = [
        [pts[0][0] + (pts[1][0]-pts[0][0])*0.08, pts[0][1] + (pts[3][1]-pts[0][1])*0.05],
        [pts[1][0] - (pts[1][0]-pts[0][0])*0.08, pts[1][1] + (pts[2][1]-pts[1][1])*0.05],
        [pts[1][0] - (pts[1][0]-pts[0][0])*0.08, pts[1][1] + (pts[2][1]-pts[1][1])*0.42],
        [pts[0][0] + (pts[1][0]-pts[0][0])*0.08, pts[0][1] + (pts[3][1]-pts[0][1])*0.42],
    ];
    ctx.beginPath();
    topPanelPts.forEach((p,i) => i===0? ctx.moveTo(p[0],p[1]) : ctx.lineTo(p[0],p[1]));
    ctx.closePath();
    ctx.fillStyle = C.doorDark;
    ctx.fill();
    // Alt panel
    const botPanelPts = [
        [pts[0][0] + (pts[1][0]-pts[0][0])*0.08, pts[0][1] + (pts[3][1]-pts[0][1])*0.47],
        [pts[1][0] - (pts[1][0]-pts[0][0])*0.08, pts[1][1] + (pts[2][1]-pts[1][1])*0.47],
        [pts[1][0] - (pts[1][0]-pts[0][0])*0.08, pts[1][1] + (pts[2][1]-pts[1][1])*0.93],
        [pts[0][0] + (pts[1][0]-pts[0][0])*0.08, pts[0][1] + (pts[3][1]-pts[0][1])*0.93],
    ];
    ctx.beginPath();
    botPanelPts.forEach((p,i) => i===0? ctx.moveTo(p[0],p[1]) : ctx.lineTo(p[0],p[1]));
    ctx.closePath();
    ctx.fillStyle = C.doorDark;
    ctx.fill();

    // Kapı kolu
    const handleX = isLeft
        ? pts[1][0] - (pts[1][0]-pts[0][0]) * 0.25
        : pts[0][0] + (pts[1][0]-pts[0][0]) * 0.25;
    const handleY = (pts[2][1] + pts[3][1]) / 2;
    const hR = Math.max(2.5, 6 * sc);
    ctx.fillStyle = C.handle;
    ctx.beginPath();
    ctx.arc(handleX, handleY, hR, 0, Math.PI*2);
    ctx.fill();

    // Numara plaketi (kapının üstünde)
    const pFontSz = Math.max(7, Math.round(14 * sc));
    const pW = pFontSz * 2.0, pH = pFontSz * 1.4;
    const pX = geo.cx - pW/2, pY = pts[0][1] - pH - 4;
    ctx.fillStyle = C.plaque;
    ctx.beginPath();
    ctx.roundRect(pX, pY, pW, pH, 3);
    ctx.fill();
    ctx.fillStyle = C.plaqueText;
    ctx.font = `bold ${pFontSz}px "Space Mono", monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(doorId), geo.cx, pY + pH/2);
}

function _drawLounge(ctx, W, H, FL, FR, FT, FB, C) {
    // Lounge zemin orta kısmında (perspektife göre konumlandırılmış)
    const mx = W / 2, floorY = FB + (H - FB) * 0.45;
    const sc = 0.65;  // lounge ölçeği

    // Halı
    ctx.fillStyle = C.rug;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.ellipse(mx, floorY + 30*sc, 160*sc, 55*sc, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Koltuk (basit trapezoid)
    const sofaW = 220*sc, sofaH = 80*sc;
    const sx = mx - sofaW/2, sy = floorY - sofaH*0.5;
    ctx.fillStyle = C.sofaDark;
    ctx.fillRect(sx, sy + sofaH*0.3, sofaW, sofaH*0.7);
    ctx.fillStyle = C.sofa;
    ctx.fillRect(sx, sy, sofaW, sofaH*0.65);
    // Koltuk yastıkları
    ctx.fillStyle = C.sofaDark;
    ctx.fillRect(sx + 4, sy, sofaW/2 - 6, sofaH*0.55);
    ctx.fillRect(sx + sofaW/2 + 2, sy, sofaW/2 - 6, sofaH*0.55);
    // Kolçaklar
    ctx.fillStyle = C.sofaDark;
    ctx.fillRect(sx - 16*sc, sy, 16*sc, sofaH*0.65);
    ctx.fillRect(sx + sofaW, sy, 16*sc, sofaH*0.65);

    // Sehpa
    const tx = mx - 90*sc, ty = floorY + 20*sc;
    const tW = 80*sc, tH = 30*sc;
    ctx.fillStyle = C.table;
    ctx.fillRect(tx, ty, tW, tH);
    ctx.fillStyle = '#3C2510';
    ctx.fillRect(tx, ty, tW, 4);
    // Bardak
    ctx.fillStyle = '#FFF6EC';
    ctx.beginPath();
    ctx.arc(tx + tW/2, ty + tH/2, 7*sc, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#7A4A2C';
    ctx.beginPath();
    ctx.arc(tx + tW/2, ty + tH/2, 5*sc, 0, Math.PI*2);
    ctx.fill();

    // Bitki
    const px = mx + 60*sc, py = floorY - 10*sc;
    // Saksı
    ctx.fillStyle = C.pot;
    ctx.fillRect(px - 14*sc, py, 28*sc, 22*sc);
    ctx.fillStyle = '#A05020';
    ctx.fillRect(px - 14*sc, py, 28*sc, 5);
    // Gövde
    ctx.fillStyle = '#4A3010';
    ctx.fillRect(px - 4*sc, py - 30*sc, 8*sc, 30*sc);
    // Yapraklar
    ctx.fillStyle = C.plant;
    ctx.beginPath();
    ctx.ellipse(px, py - 45*sc, 30*sc, 18*sc, -0.3, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(px + 15*sc, py - 35*sc, 22*sc, 14*sc, 0.4, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(px - 15*sc, py - 38*sc, 22*sc, 14*sc, -0.4, 0, Math.PI*2);
    ctx.fill();
}

function _drawCeilingLights(ctx, W, FL, FR, FT, C) {
    // Birkaç sarkıt lamba
    const positions = [
        {t: 0.15, x: W/2},
        {t: 0.40, x: W/2},
        {t: 0.70, x: W/2},
    ];
    positions.forEach(({t, x}) => {
        const y = t * FT;
        const r = Math.max(4, 14 * (1 - t));
        // Kablo
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, y - r);
        ctx.strokeStyle = '#3A2010'; ctx.lineWidth = 2; ctx.stroke();
        // Lamba
        ctx.fillStyle = '#FFD9BB';
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
        // Işık hüzmesi
        ctx.fillStyle = 'rgba(255,220,140,0.07)';
        ctx.beginPath();
        ctx.moveTo(x - r, y);
        ctx.lineTo(x - r*3, y + r*6);
        ctx.lineTo(x + r*3, y + r*6);
        ctx.lineTo(x + r, y);
        ctx.closePath();
        ctx.fill();
    });
}
