// ─────────────────────────────────────────────────
// Gerçekçi Prosedürel Ses Motoru (Web Audio API)
// Ofis Ambiyansı + Kapı Tıklatma + Merdiven Adımları + Konuşma Daktilo Sesi
// ─────────────────────────────────────────────────
const officeAudio = (() => {
    let ctx = null;
    let ambienceSource = null;
    let ambienceGain = null;
    let gameGain = null;
    let muted = false;
    try { muted = localStorage.getItem('flo-muted') === 'true'; } catch (_) {}

    function getAudioContext() {
        try {
            if (!ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    ctx = new AudioCtx();
                }
            }
            if (ctx && ctx.state === 'suspended') {
                ctx.resume();
            }
            if (ctx && !ambienceSource && !muted) {
                startAmbience(ctx);
            }
            return ctx;
        } catch (e) {
            return null;
        }
    }

    // ARKA PLAN OFİS AMBİYANSI (Hafif Havalandırma / Ofis Odası Varlığı Uğultusu)
    function startAmbience(ac) {
        if (ambienceSource || muted) return;
        try {
            const rate = ac.sampleRate;
            const duration = 3.5;
            const buffer = ac.createBuffer(1, Math.floor(rate * duration), rate);
            const data = buffer.getChannelData(0);

            let filterMemory = 0;
            for (let i = 0; i < data.length; i++) {
                const white = (Math.random() * 2 - 1);
                filterMemory = (filterMemory * 0.95) + (white * 0.05);
                const t = i / rate;
                // Çok hafif 60Hz/120Hz trafo ve hava sirkülasyonu tonu
                const hum = Math.sin(2 * Math.PI * 60 * t) * 0.03 + Math.sin(2 * Math.PI * 120 * t) * 0.015;
                data[i] = (filterMemory * 2.0 + hum) * 0.22;
            }

            ambienceSource = ac.createBufferSource();
            ambienceSource.buffer = buffer;
            ambienceSource.loop = true;

            const filter = ac.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 750;

            ambienceGain = ac.createGain();
            ambienceGain.gain.setValueAtTime(muted ? 0 : 0.035, ac.currentTime);

            ambienceSource.connect(filter);
            filter.connect(ambienceGain);
            ambienceGain.connect(ac.destination);

            ambienceSource.start();
        } catch (e) {}
    }

    function createNoiseBuffer(ac, duration) {
        const bufferSize = Math.max(1, Math.floor(ac.sampleRate * duration));
        const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.8;
        }
        return buffer;
    }

    // 1. KAPI TIKLATMA SESİ (Doğal Ahşap Kapı Vuruşu "Tok... Tok... Tok")
    function playDoorKnock() {
        if (muted) return;
        const ac = getAudioContext();
        if (!ac) return;

        const now = ac.currentTime;
        const knocks = [
            { time: 0.00, freq: 175, noiseFreq: 1200, vol: 0.75 },
            { time: 0.12, freq: 160, noiseFreq: 1100, vol: 0.70 },
            { time: 0.25, freq: 170, noiseFreq: 1250, vol: 0.80 }
        ];

        knocks.forEach(k => {
            const t = now + k.time;

            // A) Ahşap Kapı Tokluğu
            try {
                const osc = ac.createOscillator();
                const oscGain = ac.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(k.freq, t);
                osc.frequency.exponentialRampToValueAtTime(50, t + 0.08);

                oscGain.gain.setValueAtTime(k.vol, t);
                oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.085);

                osc.connect(oscGain);
                oscGain.connect(ac.destination);
                osc.start(t);
                osc.stop(t + 0.09);
            } catch (e) {}

            // B) Eklem Vuruş Şıkırtısı
            try {
                const noise = ac.createBufferSource();
                noise.buffer = createNoiseBuffer(ac, 0.035);

                const filter = ac.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(k.noiseFreq, t);
                filter.Q.setValueAtTime(3.5, t);

                const noiseGain = ac.createGain();
                noiseGain.gain.setValueAtTime(k.vol * 0.45, t);
                noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

                noise.connect(filter);
                filter.connect(noiseGain);
                noiseGain.connect(ac.destination);
                noise.start(t);
                noise.stop(t + 0.04);
            } catch (e) {}
        });
    }

    // 2. MERDİVEN ÇIKMA / İNME SESİ (Ritmik Merdiven Adım Sesleri)
    function playStairsSound(goingUp = true) {
        if (muted) return;
        const ac = getAudioContext();
        if (!ac) return;

        const now = ac.currentTime;
        const stepCount = 4;
        const stepInterval = 0.18;

        for (let i = 0; i < stepCount; i++) {
            const t = now + (i * stepInterval);
            const pitchFactor = goingUp ? (1 + i * 0.09) : (1.30 - i * 0.09);
            const baseFreq = 95 * pitchFactor;

            // A) Basamak Taban Vuruşu
            try {
                const osc = ac.createOscillator();
                const oscGain = ac.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(baseFreq, t);
                osc.frequency.exponentialRampToValueAtTime(35, t + 0.10);

                oscGain.gain.setValueAtTime(0.60, t);
                oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

                osc.connect(oscGain);
                oscGain.connect(ac.destination);
                osc.start(t);
                osc.stop(t + 0.12);
            } catch (e) {}

            // B) Yüzey Teması
            try {
                const noise = ac.createBufferSource();
                noise.buffer = createNoiseBuffer(ac, 0.06);

                const filter = ac.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime((goingUp ? 850 : 700) * pitchFactor, t);

                const noiseGain = ac.createGain();
                noiseGain.gain.setValueAtTime(0.32, t);
                noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

                noise.connect(filter);
                filter.connect(noiseGain);
                noiseGain.connect(ac.destination);
                noise.start(t);
                noise.stop(t + 0.07);
            } catch (e) {}
        }
    }

    // 3. ODADAN KORİDORA DÖNÜŞ (Kapı Kapanma)
    function playExit() {
        if (muted) return;
        const ac = getAudioContext();
        if (!ac) return;

        try {
            const t = ac.currentTime;
            const osc = ac.createOscillator();
            const gain = ac.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(140, t);
            osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);

            gain.gain.setValueAtTime(0.40, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

            osc.connect(gain);
            gain.connect(ac.destination);
            osc.start(t);
            osc.stop(t + 0.13);
        } catch (e) {}
    }

    // 4. KONUŞMA / DAKTİLO BALONCUK SESİ (Blip)
    function playBlip(voice = 0) {
        if (muted) return;
        const ac = getAudioContext();
        if (!ac) return;

        try {
            const now = ac.currentTime;
            const basePitch = 320 + ((voice || 0) % 6) * 30 + (Math.random() * 40 - 20);
            const osc = ac.createOscillator();
            const gain = ac.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(basePitch, now);
            osc.frequency.exponentialRampToValueAtTime(basePitch * 0.78, now + 0.045);

            gain.gain.setValueAtTime(0.075, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

            osc.connect(gain);
            gain.connect(ac.destination);

            osc.start(now);
            osc.stop(now + 0.05);
        } catch (e) {}
    }

    async function playGameCue(kind) {
        if (muted || document.hidden) return;
        const ac = getAudioContext();
        if (!ac) return;
        try {
            if (ac.state === 'suspended') await ac.resume();
            if (muted || document.hidden) return;
            if (!gameGain) {
                gameGain = ac.createGain();
                gameGain.connect(ac.destination);
            }
            gameGain.gain.setValueAtTime(1, ac.currentTime);
            const notes = kind === 'win' ? [523, 659, 784] : kind === 'correct' ? [660, 880] : kind === 'wrong' ? [230] : [390];
            notes.forEach((frequency, i) => {
                const now = ac.currentTime + i * 0.08;
                const oscillator = ac.createOscillator();
                const gain = ac.createGain();
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(frequency, now);
                oscillator.frequency.exponentialRampToValueAtTime(kind === 'wrong' ? 180 : frequency, now + 0.07);
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(kind === 'pick' ? 0.012 : 0.035, now + 0.005);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
                oscillator.connect(gain); gain.connect(gameGain);
                oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
                oscillator.start(now); oscillator.stop(now + 0.1);
            });
        } catch (_) { /* Optional feedback must not interrupt a game. */ }
    }

    function unlock() {
        getAudioContext();
    }

    document.addEventListener('click', unlock, { once: false });
    document.addEventListener('keydown', unlock, { once: false });

    // Sekme arka plana gidince ambiyansı kıs / geri dönünce aç
    document.addEventListener('visibilitychange', () => {
        if (gameGain && ctx) gameGain.gain.setTargetAtTime(document.hidden || muted ? 0 : 1, ctx.currentTime, 0.01);
        if (!ambienceGain || !ctx) return;
        const targetVol = (document.hidden || muted) ? 0 : 0.035;
        ambienceGain.gain.setTargetAtTime(targetVol, ctx.currentTime, 0.2);
    });

    // Ses Aç/Kapat butonu (varsa)
    const button = document.getElementById('sound-toggle');
    function updateButton() {
        if (!button) return;
        button.textContent = muted ? '🔇' : '🔊';
        button.setAttribute('aria-label', muted ? 'Sesleri aç' : 'Sesleri kapat');
        button.setAttribute('aria-pressed', String(muted));
        button.title = muted ? 'Sesleri aç' : 'Sesleri kapat';
    }

    if (button) {
        button.addEventListener('click', () => {
            muted = !muted;
            try { localStorage.setItem('flo-muted', String(muted)); } catch (_) {}
            if (gameGain && ctx) gameGain.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.01);
            if (ambienceGain && ctx) {
                ambienceGain.gain.setTargetAtTime(muted ? 0 : 0.035, ctx.currentTime, 0.05);
            }
            unlock();
            updateButton();
        });
        updateButton();
    }

    return {
        gameCue: playGameCue,
        knock: playDoorKnock,
        stairs: playStairsSound,
        enter() {
            unlock();
            playDoorKnock();
        },
        exit: playExit,
        blip: playBlip
    };
})();

window.officeAudio = officeAudio;
