// ─────────────────────────────────────────────────
// DOM Elementleri
// ─────────────────────────────────────────────────
const corridorScreen     = document.getElementById('corridor-screen');
const departmentScreen   = document.getElementById('department-screen');
const doorsContainer     = document.getElementById('doors-container');
const floorBtn           = document.getElementById('floor-btn');
const loungeBtn          = document.getElementById('lounge-btn');
const floorLabel         = document.getElementById('floor-label');
const badgeCountEl       = document.getElementById('badge-count');
const preloadedScenes = new Set();
function preloadScene(src) {
    if (!src || preloadedScenes.has(src)) return;
    preloadedScenes.add(src);
    const image = new Image();
    image.src = src;
}

// Modal Elementleri
const btnCloseRoom       = document.getElementById('btn-close-room');
const roomDialogueView   = document.getElementById('room-dialogue-view');
const roomGameView       = document.getElementById('room-game-view');
const roomBgImg          = document.getElementById('room-bg-img');
const roomImgFallback    = document.getElementById('room-img-fallback');
const fallbackDeptName   = document.getElementById('fallback-dept-name');
const btnPrevDialogue    = document.getElementById('btn-prev-dialogue');
const btnNextDialogue    = document.getElementById('btn-next-dialogue');
const btnBackToDialogue  = document.getElementById('btn-back-to-dialogue');
const btnFinishDept      = document.getElementById('btn-finish-dept');

// ─────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────
let currentFloor         = 1;   // 1 = Giriş Katı (Dept 1-10), 2 = Üst Kat (Dept 11-20)
let currentDeptId        = null;
let currentDialogueIndex = 0;
let badges               = 0;
let completedDepts       = [];
let lastVisitedDoorId    = null;

// Typewriter Animasyonu State
let typewriterTimer      = null;
let currentFullText      = '';
let isTyping             = false;

// ─────────────────────────────────────────────────
// Hitbox Koordinatları (1672 x 941 Çözünürlük)
// ─────────────────────────────────────────────────
const BASE_W = 1672;
const BASE_H = 941;

// Kat 1 Hitbox'ları (localId 1..10)
const KAT1_DOOR_HITBOXES = {
    1:  { x: 55,   y: 290, w: 105, h: 290 },
    2:  { x: 210,  y: 300, w: 95,  h: 270 },
    3:  { x: 335,  y: 310, w: 85,  h: 250 },
    4:  { x: 445,  y: 320, w: 78,  h: 235 },
    5:  { x: 530,  y: 330, w: 70,  h: 220 },
    6:  { x: 1085, y: 325, w: 70,  h: 220 },
    7:  { x: 1165, y: 318, w: 78,  h: 235 },
    8:  { x: 1260, y: 308, w: 85,  h: 250 },
    9:  { x: 1370, y: 295, w: 95,  h: 270 },
    10: { x: 1485, y: 280, w: 110, h: 290 }
};

// Kat 2 Hitbox'ları (localId 1..10 -> Dept 11..20)
const KAT2_DOOR_HITBOXES = {
    1:  { x: 55,   y: 290, w: 105, h: 290 },
    2:  { x: 210,  y: 300, w: 95,  h: 270 },
    3:  { x: 335,  y: 310, w: 85,  h: 250 },
    4:  { x: 445,  y: 310, w: 78,  h: 225 },
    5:  { x: 530,  y: 320, w: 70,  h: 210 },
    6:  { x: 1085, y: 310, w: 70,  h: 210 },
    7:  { x: 1165, y: 305, w: 78,  h: 225 },
    8:  { x: 1260, y: 295, w: 85,  h: 240 },
    9:  { x: 1370, y: 290, w: 95,  h: 265 },
    10: { x: 1485, y: 280, w: 110, h: 290 }
};

// Merdiven Hitbox'ları
const KAT1_STAIRS_HITBOX = { x: 680, y: 160, w: 310, h: 240 };
const KAT2_STAIRS_HITBOX = { x: 590, y: 610, w: 480, h: 270 };

function getDoorStyle(deptId) {
    const localId  = deptId <= 10 ? deptId : deptId - 10;
    const doorMap  = currentFloor === 1 ? KAT1_DOOR_HITBOXES : KAT2_DOOR_HITBOXES;
    const box      = doorMap[localId];
    if (!box) return {};

    return {
        left:   `${((box.x / BASE_W) * 100).toFixed(3)}%`,
        top:    `${((box.y / BASE_H) * 100).toFixed(3)}%`,
        width:  `${((box.w / BASE_W) * 100).toFixed(3)}%`,
        height: `${((box.h / BASE_H) * 100).toFixed(3)}%`,
        zIndex: 100 + Math.round((box.y / BASE_H) * 100)
    };
}

// ─────────────────────────────────────────────────
// Kapı Butonlarını Çiz
// ─────────────────────────────────────────────────
function renderDoors() {
    doorsContainer.innerHTML = '';

    const startId = currentFloor === 1 ? 1 : 11;
    const endId   = currentFloor === 1 ? 10 : 20;

    for (let id = startId; id <= endId; id++) {
        const dept        = departmentsData[id];
        const isCompleted = completedDepts.includes(id);
        const pos         = getDoorStyle(id);

        const btn = document.createElement('button');
        btn.type      = 'button';
        btn.className = 'door-btn' + (isCompleted ? ' completed' : '');
        btn.setAttribute('data-dept-id', id);

        btn.style.left   = pos.left;
        btn.style.top    = pos.top;
        btn.style.width  = pos.width;
        btn.style.height = pos.height;
        btn.style.zIndex = pos.zIndex;

        btn.title = `Kapı ${id}: ${dept ? dept.title : 'Keşfedilmemiş'}`;

        btn.addEventListener('click', () => enterDepartment(id));
        doorsContainer.appendChild(btn);
    }
    updateNextDoorHint();
}

function updateNextDoorHint() {
    document.querySelectorAll('.next-destination').forEach(el => { el.classList.remove('next-destination'); el.removeAttribute('aria-describedby'); });
    const available = Object.keys(departmentGames).map(Number);
    const pending = available.filter(id => !completedDepts.includes(id));
    const onFloor = pending.filter(id => currentFloor === 1 ? id <= 10 : id > 10);
    let target, label;
    if (loungeBtn) loungeBtn.style.display = pending.length ? 'none' : 'block';
    if (!pending.length) {
        target = loungeBtn;
        label = 'Yolculuk tamamlandı! Lounge’da Fillo’nun önerisini gör.';
        if (loungeBtn) { loungeBtn.textContent = 'Lounge · Yolculuk Finali'; loungeBtn.title = 'Fillo’nun Önerisi'; }
    } else if (!onFloor.length) {
        target = floorBtn;
        label = 'Bu kat tamam! Diğer kattaki departmanları keşfet.';
    } else {
        const boxes = currentFloor === 1 ? KAT1_DOOR_HITBOXES : KAT2_DOOR_HITBOXES;
        const sameFloor = lastVisitedDoorId && (currentFloor === 1 ? lastVisitedDoorId <= 10 : lastVisitedDoorId > 10);
        const previous = sameFloor ? boxes[(lastVisitedDoorId - 1) % 10 + 1] : null;
        const origin = previous ? {x: previous.x + previous.w / 2, y: previous.y + previous.h / 2} : {x: 0, y: BASE_H / 2};
        const distance = id => { const box = boxes[(id - 1) % 10 + 1]; return (box.x + box.w / 2 - origin.x) ** 2 + (box.y + box.h / 2 - origin.y) ** 2; };
        const next = onFloor.sort((a, b) => distance(a) - distance(b) || a - b)[0];
        target = doorsContainer.querySelector(`[data-dept-id="${next}"]`);
        label = `Sıradaki keşif: ${departmentsData[next].title}`;
    }
    if (target) { target.classList.add('next-destination'); target.setAttribute('aria-describedby', 'guide-arrow'); }
    if (target?.dataset.deptId) preloadScene(departmentsData[target.dataset.deptId]?.image);
    else if (target === floorBtn) preloadScene(currentFloor === 1 ? 'assets/kat2-cozy.webp' : 'assets/kat1-cozy.webp');
    if (guideArrow) {
        guideArrow.style.display = 'flex';
        guideArrow.querySelector('.guide-icon').textContent = '→';
        guideArrow.querySelector('.guide-text').textContent = label;
    }
}

// ─────────────────────────────────────────────────
// Kat Değiştirme — Animasyonlu Geçiş
// ─────────────────────────────────────────────────
let isSwitchingFloor = false;
function switchFloor() {
    if (isSwitchingFloor) return;
    isSwitchingFloor = true;
    officeAudio.stairs(currentFloor === 1);
    const overlay = document.getElementById('transition-overlay');
    const wrapper = document.querySelector('.corridor-wrapper');
    const img     = document.getElementById('corridor-img');

    if (overlay) overlay.classList.add('active');
    if (wrapper) wrapper.classList.add('floor-transitioning');

    setTimeout(() => {
        currentFloor = currentFloor === 1 ? 2 : 1;
        img.src = currentFloor === 1 ? 'assets/kat1-cozy.webp' : 'assets/kat2-cozy.webp';
        updateFloorUI();
        renderDoors();
    }, 450);

    setTimeout(() => {
        if (overlay) overlay.classList.remove('active');
        if (wrapper) wrapper.classList.remove('floor-transitioning');
        isSwitchingFloor = false;
    }, 900);
}

function updateFloorUI() {
    if (floorLabel) {
        floorLabel.textContent = currentFloor === 1 ? '🏠 Giriş Katı' : '🏢 2. Kat';
    }
    if (floorBtn) {
        const stairsBox = currentFloor === 1 ? KAT1_STAIRS_HITBOX : KAT2_STAIRS_HITBOX;
        floorBtn.style.left   = `${((stairsBox.x / BASE_W) * 100).toFixed(3)}%`;
        floorBtn.style.top    = `${((stairsBox.y / BASE_H) * 100).toFixed(3)}%`;
        floorBtn.style.width  = `${((stairsBox.w / BASE_W) * 100).toFixed(3)}%`;
        floorBtn.style.height = `${((stairsBox.h / BASE_H) * 100).toFixed(3)}%`;
        floorBtn.title        = currentFloor === 1 ? '2. Kata Çık' : '1. Kata İn';
    }
}

// Rehber Oku Elementi
const guideArrow        = document.getElementById('guide-arrow');

// ─────────────────────────────────────────────────
// Uygulama Başlatma
// ─────────────────────────────────────────────────
function init() {
    try {
        const saved = JSON.parse(localStorage.getItem('flo-game-badges') || '[]');
        completedDepts = Array.isArray(saved) ? [...new Set(saved.filter(id => Number.isInteger(id) && departmentGames[id]))] : [];
    } catch (_) { completedDepts = []; }
    updateGameProgress();
    renderDoors();
    updateFloorUI();

    if (floorBtn)          floorBtn.addEventListener('click', switchFloor);
    if (loungeBtn)         loungeBtn.addEventListener('click', () => journey.open('recommendation'));
    if (btnCloseRoom)      btnCloseRoom.addEventListener('click', handleCloseModal);
    if (btnFinishDept)     btnFinishDept.addEventListener('click', exitDepartment);
    if (btnPrevDialogue)   btnPrevDialogue.addEventListener('click', handleDialoguePrev);
    if (btnNextDialogue)   btnNextDialogue.addEventListener('click', handleDialogueNext);
    if (btnBackToDialogue) btnBackToDialogue.addEventListener('click', showDialogueView);

    // Boş Siyah Alana Tıklayınca Kapanma (Backdrop Click)
    if (departmentScreen) {
        departmentScreen.addEventListener('click', (e) => {
            const viewport = document.querySelector('.room-game-viewport');
            if (viewport && !e.composedPath().includes(viewport)) {
                handleCloseModal();
            }
        });
    }
}

// ─────────────────────────────────────────────────
// Departman Odasına Giriş (Modal Açılışı)
// ─────────────────────────────────────────────────
function enterDepartment(deptId) {
    officeAudio.enter();
    currentDeptId        = deptId;
    lastVisitedDoorId    = deptId;
    currentDialogueIndex = 0;

    const dept = departmentsData[deptId];
    roomExplore.render(dept);

    // İlk odaya girildiğinde rehber okunu gizle
    if (guideArrow) guideArrow.style.display = 'none';

    // Koridoru gizle, departman ekranını aç
    corridorScreen.classList.remove('active');
    departmentScreen.classList.add('active');

    // Görünüm sıfırlama (Diyalog görünümünü göster)
    showDialogueView();

    // Arka plan görseli
    if (roomBgImg) {
        const imgSrc = (dept && dept.image) ? dept.image : `assets/rooms/oda${deptId}.webp`;
        roomBgImg.src = imgSrc;
        roomBgImg.style.display = 'block';

        roomBgImg.onerror = () => {
            roomBgImg.style.display = 'none';
            if (roomImgFallback) {
                roomImgFallback.style.display = 'flex';
                if (fallbackDeptName) fallbackDeptName.textContent = dept ? dept.title : `Oda ${deptId}`;
            }
        };
        if (roomImgFallback) roomImgFallback.style.display = 'none';
    }

    // Oyun sayfası başlık/açıklama güncelleme
    const gameTitle       = document.getElementById('game-title');
    const gameDesc        = document.getElementById('game-desc');
    const gameStatusBadge = document.getElementById('game-status-badge');
    if (gameTitle)       gameTitle.textContent       = dept ? (dept.gameTitle || `${dept.title} Görevi`) : `Oda ${deptId}`;
    if (gameDesc)        gameDesc.textContent        = dept ? (dept.gameDesc  || 'Yakında bu departmanın simülasyonunu burada oynayacaksın.') : 'Hazırlanıyor...';
    if (gameStatusBadge) gameStatusBadge.textContent = dept ? `🚧 ${dept.title} Oyunu Yakında Ekleniyor` : '🚧 Görev Yakında Ekleniyor';

    // Diyalog adımını yükle
    renderDialogueStep();
}

// ─────────────────────────────────────────────────
// Diyalog Adımını ve Daktilo Efektini Çiz
// ─────────────────────────────────────────────────
function renderDialogueStep() {
    const dept = departmentsData[currentDeptId];

    // Eğer departmanda tanımlı diyaloglar yoksa varsayılan metin oluştur
    const dialogues = (dept && dept.dialogues) ? dept.dialogues : [
        {
            title: "Tanışma",
            text: dept ? (dept.welcomeText || `${dept.title} odasına hoş geldin!`) : `Oda ${currentDeptId} henüz hazırlanmadı.`,
            isLast: true,
            btnText: "🎮 Göreve Başla →"
        }
    ];

    const dialogue   = dialogues[currentDialogueIndex];
    const totalSteps = dialogues.length;

    const charBadge   = document.getElementById('character-badge');
    const stepTag     = document.getElementById('dialogue-step-tag');
    const bubbleTitle = document.getElementById('bubble-title');
    const bubbleText  = document.getElementById('bubble-text');
    const btnPrev     = document.getElementById('btn-prev-dialogue');
    const btnNext     = document.getElementById('btn-next-dialogue');

    if (charBadge)   charBadge.textContent   = (dept && dept.characterTitle) ? dept.characterTitle : '👩‍💼 FLO Departman Yetkilisi';
    if (stepTag)     stepTag.textContent     = `${currentDialogueIndex + 1} / ${totalSteps}`;
    if (bubbleTitle) bubbleTitle.textContent = dialogue.title;

    // Geri Buton Kontrolü
    if (btnPrev) {
        if (currentDialogueIndex > 0) {
            btnPrev.classList.remove('hidden');
        } else {
            btnPrev.classList.add('hidden');
        }
    }

    if (btnNext) {
        btnNext.textContent = dialogue.isLast ? (dialogue.btnText || '🎮 Oyuna Başla →') : 'İleri →';
    }

    // Harf harf canlı okuma (Typewriter) başlat
    startTypewriter(dialogue.text, bubbleText);
}

// ─────────────────────────────────────────────────
// Typewriter (Harf Harf Geliş) Animasyonu
// ─────────────────────────────────────────────────
function startTypewriter(fullText, element) {
    if (typewriterTimer) clearTimeout(typewriterTimer);
    currentFullText   = fullText;
    isTyping          = true;
    element.textContent = '';

    const characters = Array.from(fullText);
    let charIndex = 0;
    let spokenCharacters = 0;
    function typeCharacter() {
        const character = characters[charIndex++];
        element.textContent = characters.slice(0, charIndex).join('');
        if (/[\p{L}\p{N}]/u.test(character) && ++spokenCharacters % 3 === 0) {
            officeAudio.blip(currentDeptId);
        }
        if (charIndex >= characters.length) {
            typewriterTimer = null;
            isTyping        = false;
            return;
        }
        const delay = /[.!?…]/u.test(character) ? 180 : /[,;:]/u.test(character) ? 95 : 26;
        typewriterTimer = setTimeout(typeCharacter, delay);
    }
    if (characters.length) typewriterTimer = setTimeout(typeCharacter, 26);
    else { isTyping = false; typewriterTimer = null; }
}

// ─────────────────────────────────────────────────
// Geri Butonu Mantığı
// ─────────────────────────────────────────────────
function handleDialoguePrev() {
    const bubbleText = document.getElementById('bubble-text');

    // 1. Yazı yazılıyorsa ilk tıklamada durdur ve tam metni göster
    if (isTyping) {
        if (typewriterTimer) clearInterval(typewriterTimer);
        typewriterTimer = null;
        isTyping        = false;
        if (bubbleText) bubbleText.textContent = currentFullText;
        return;
    }

    // 2. Önceki kutuya geç
    if (currentDialogueIndex > 0) {
        currentDialogueIndex--;
        renderDialogueStep();
    }
}

// ─────────────────────────────────────────────────
// İleri Butonu Mantığı
// ─────────────────────────────────────────────────
function handleDialogueNext() {
    const dept = departmentsData[currentDeptId];
    const dialogues = (dept && dept.dialogues) ? dept.dialogues : [];
    const bubbleText = document.getElementById('bubble-text');

    // 1. Yazı yazılıyorsa ilk tıklamada hemen tamamla
    if (isTyping) {
        if (typewriterTimer) clearInterval(typewriterTimer);
        typewriterTimer = null;
        isTyping        = false;
        if (bubbleText) bubbleText.textContent = currentFullText;
        return;
    }

    // 2. Yazı bittiyse sonraki kutuya geç
    if (currentDialogueIndex < dialogues.length - 1) {
        currentDialogueIndex++;
        renderDialogueStep();
    } else {
        // 3. Son kutudaysak oyun/görev sayfasına geç (butona tıklandı)
        openGameView();
    }
}

// ─────────────────────────────────────────────────
// Görünümler Arası Geçiş
// ─────────────────────────────────────────────────
function showDialogueView() {
    roomExplore.close(false);
    updateGameProgress();
    miniGames.stop();
    if (roomDialogueView) roomDialogueView.classList.remove('hidden');
    if (roomGameView)     roomGameView.classList.add('hidden');
}

function openGameView() {
    roomExplore.close(false);
    if (typewriterTimer) clearTimeout(typewriterTimer);
    typewriterTimer = null;
    isTyping = false;
    if (roomDialogueView) roomDialogueView.classList.add('hidden');
    if (roomGameView)     roomGameView.classList.remove('hidden');

    miniGames.mount(currentDeptId, document.getElementById('mini-game-root'), awardGameBadge);
    roomGameView.scrollTop = 0;
}

function updateGameProgress() {
    badges = completedDepts.length;
    const total = Object.keys(departmentGames).length;
    if (badgeCountEl) badgeCountEl.textContent = badges;
    const totalEl = document.getElementById('badge-total');
    if (totalEl) totalEl.textContent = total;
    const fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = `${(badges / total) * 100}%`;
    journey.refresh(completedDepts);
}

function awardGameBadge(id, result) {
    if (!departmentGames[id]) return;
    journeyData.record(id, result);
    if (result?.won === false || completedDepts.includes(id)) return;
    completedDepts.push(id);
    try { localStorage.setItem('flo-game-badges', JSON.stringify(completedDepts)); } catch (_) {}
    updateGameProgress();
    renderDoors();
}

// Akıllı ✕ Çarpı Buton Mantığı:
// Oyundaysan -> Odaya/Sohbete döner
// Odaydaysan -> Koridora atar
function handleCloseModal() {
    if (roomGameView && !roomGameView.classList.contains('hidden')) {
        showDialogueView();
    } else {
        exitDepartment();
    }
}

// ─────────────────────────────────────────────────
// Odadan Çıkış (Koridora Dönüş)
// ─────────────────────────────────────────────────
function exitDepartment() {
    roomExplore.close(false);
    miniGames.stop();
    officeAudio.exit();
    if (typewriterTimer) clearInterval(typewriterTimer);
    typewriterTimer = null;
    isTyping        = false;

    departmentScreen.classList.remove('active');
    corridorScreen.classList.add('active');
    currentDeptId = null;
    updateNextDoorHint();
}

document.addEventListener('DOMContentLoaded', init);

// FLO RAG Chatbot
const CHATBOT_API_URL = window.FLO_CHATBOT_API_URL || 'http://127.0.0.1:8000/chat';
let chatBusy = false;
let failedChatMessage = null;

function addChatMessage(text, role) {
    const messages = document.getElementById('chatbot-messages');
    if (!messages) return;
    const message = document.createElement('div');
    message.className = `chat-message ${role}`;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

async function submitChatMessage(event) {
    event.preventDefault();
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    if (!message || chatBusy) return;
    input.value = '';
    await sendChatMessage(message);
}

async function sendChatMessage(message, retry = false) {
    if (chatBusy) return;
    chatBusy = true;
    const input = document.getElementById('chatbot-input');
    const sendButton = document.getElementById('chatbot-send');
    const status = document.getElementById('chatbot-status');
    const retryButton = document.getElementById('chatbot-retry');
    if (!retry) addChatMessage(message, 'user');
    retryButton.hidden = true;
    failedChatMessage = null;
    sendButton.disabled = true;
    input.disabled = true;
    status.textContent = 'Bilgi tabanında aranıyor…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);
    try {
        const response = await fetch(CHATBOT_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }), signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        addChatMessage(data.answer || 'Bu konuda bilgi tabanımda bilgi bulunmuyor.', 'bot');
        status.textContent = '';
    } catch (error) {
        failedChatMessage = message;
        status.textContent = error.name === 'AbortError' ? 'Yanıt beklenenden uzun sürdü. Sorunu tekrar gönderebilirsin.' : 'Kanka, backend’i deploy edemediğim için chatbotum sadece localde çalışıyor 😭😭';
        retryButton.hidden = false;
    } finally {
        clearTimeout(timeout);
        chatBusy = false;
        sendButton.disabled = false;
        input.disabled = false;
        if (input.getClientRects().length) input.focus({preventScroll: true});
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('chatbot-toggle');
    document.getElementById('sidebar-fillo').innerHTML = `<div class="fillo-heart-scene">${GameArt.seatedHeart()}<span class="fillo-floating-hearts" aria-hidden="true">${Array.from({length:4},(_,i)=>`<span style="--heart-i:${i}">♥</span>`).join('')}</span></div>`;
    const body = document.getElementById('chatbot-body');
    const form = document.getElementById('chatbot-form');
    if (toggle && body) toggle.addEventListener('click', () => {
        const opening = body.classList.contains('hidden');
        body.classList.toggle('hidden');
        toggle.setAttribute('aria-expanded', String(opening));
        if (opening) document.getElementById('chatbot-input')?.focus();
    });
    if (form) form.addEventListener('submit', submitChatMessage);
    document.getElementById('chatbot-retry').addEventListener('click', () => {
        if (failedChatMessage) sendChatMessage(failedChatMessage, true);
    });
    const dialog = document.getElementById('chatbot-dialog');
    const panel = document.querySelector('.chatbot-panel');
    const home = panel.parentElement;
    const launcher = document.getElementById('chatbot-mobile-open');
    launcher.addEventListener('click', () => {
        document.getElementById('chatbot-mobile-slot').appendChild(panel);
        body.classList.remove('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        dialog.showModal();
        document.getElementById('chatbot-input').focus();
    });
    document.getElementById('chatbot-mobile-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => { home.insertBefore(panel, document.getElementById('sidebar-fillo')); launcher.focus({preventScroll: true}); });
});

// A touch-friendly alternative to the small corridor doors on phones.
document.addEventListener('DOMContentLoaded', () => {
    const picker = document.getElementById('mobile-department');
    Object.values(departmentsData).filter(dept => dept.id >= 1 && dept.id <= 20).forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.id; option.textContent = `${dept.id}. ${dept.title}`;
        picker.appendChild(option);
    });
    picker.addEventListener('change', () => {
        if (picker.value) enterDepartment(Number(picker.value));
        picker.value = '';
    });
});
