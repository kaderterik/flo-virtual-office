// Shared UI for every game. Plain JavaScript components match this project's runtime.
const GameUI = (() => {
    const escape = value => String(value).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
    function TaskIntro(dept, config) {
        return `<div class="mg-intro"><div class="mg-intro-art">${GameArt.elephant('happy')}<span class="mg-task-object">${GameArt.icon(config.type)}</span><span class="mg-art-caption">FİLLO İLE<br>GÖREV ZAMANI</span></div><div class="mg-intro-copy"><p class="mg-eyebrow">Görev seni bekliyor</p>
            <h3>${escape(dept.gameTitle)}</h3><p>${escape(dept.taskSummary)}</p>
            <div class="mg-help">${config.seconds ? `⏱ Hazırlık: ${config.seconds} saniye · Süre Başla ile başlar.` : 'Hazırlık: kendi hızında oyna.'}</div>
            <ol class="mg-intro-stages"><li>Departmanın temel görevini çöz.</li><li>${departmentMissions[dept.id]?.length || 0} iş senaryosunda bilgileri okuyup karar ver.</li><li>Sonuçları öğren; karar masasında en az %80 ile rozetini kazan.</li></ol>
            <p class="mg-training-note">Senaryolar ve sayısal veriler öğrenme amaçlı kurgulanmıştır.</p>
            ${config.mistakes ? `<p>${config.mistakes} hata hakkın var. Başlangıçta hiçbir kart yerleştirilmez.</p>` : ''}
            <button type="button" data-action="start" class="mg-primary">Oyuna Başla →</button></div></div>`;
    }
    function ScoreBar(current, total, label, lives) {
        return `<div class="mg-live-stats"><strong data-live-score>★ ${current}/${total} ${escape(label)}</strong>
            ${lives ? `<span data-lives aria-label="${lives.current} hata hakkı kaldı">${'♥'.repeat(lives.current)}${'♡'.repeat(lives.total - lives.current)} <small>${lives.current} hak</small></span>` : ''}
            <progress value="${current}" max="${total}" aria-label="${escape(label)} ilerlemesi"></progress></div>`;
    }
    function FilloReaction(state = 'idle') {
        return `<aside class="mg-fillo-corner" aria-label="Fillo: ${state === 'happy' ? 'mutlu' : state === 'confused' ? 'şaşkın' : 'hazır'}">${GameArt.elephant(state)}<small>Fillo</small></aside>`;
    }
    function CompletionOverlay(s, summary) {
        const c = s.config;
        return `<div class="mg-result" tabindex="-1" aria-label="Oyun sonucu">${s.won ? `<div class="mg-confetti" aria-hidden="true">${Array.from({length: 24}, (_, i) => `<i style="--i:${i};--x:${(i * 37) % 100}%"></i>`).join('')}</div>` : ''}
            <span class="mg-award ${s.won ? 'mg-celebrate' : ''}">${s.won ? GameArt.icon('award') : GameArt.elephant('confused')}</span>
            <h3>${s.won ? `🎉 ${escape(s.dept.title)} ekibi gibi düşündün!` : 'Bir tur daha deneyebilirsin'}</h3>
            ${s.won ? `<p class="mg-badge-name">${escape(s.badge)}</p>` : ''}
            <p class="mg-score">${s.score} / ${s.total} görev puanı</p>
            <p>${s.won ? 'Rozetin kazanıldı!' : 'Rozet için hedefe biraz daha yaklaş.'} ${escape(s.feedback)}</p>
            ${c.success && s.won ? `<p>${escape(c.success)}</p>` : ''}${c.summary ? `<p>${escape(c.summary)}</p>` : ''}${summary}
            <div class="mg-choices"><button type="button" data-action="retry" class="mg-primary">Tekrar Oyna</button><button type="button" data-action="back">Sohbete Dön</button></div></div>`;
    }
    class GameFeedbackProvider {
        constructor(session) { this.session = session; }
        onCorrectDrop(message, details = {}) { this.react('correct', message, details); }
        onWrongDrop(message, details = {}) { this.react('wrong', message, details); }
        react(kind, message, details) {
            this.session.reaction = {kind, ...details};
            if (message) this.session.feedback = message;
            officeAudio.gameCue(kind);
        }
        render(current, total, label) {
            const s = this.session;
            const lives = s.config.mistakes || s.config.type === 'stock' ? {current: s.lives, total: s.config.mistakes || 3} : null;
            return `<div class="mg-game-hud" data-feedback-provider>${ScoreBar(current, total, label, lives)}<p class="mg-provider-message" role="status">${escape(s.feedback || 'Ben Fillo! Verileri incele, kararını ver; birlikte ilerleyelim.')}</p></div>`;
        }
        avatar() {
            return FilloReaction(this.session.reaction?.kind === 'correct' ? 'happy' : this.session.reaction?.kind === 'wrong' ? 'confused' : 'idle');
        }
        complete(summary) { return CompletionOverlay(this.session, summary); }
    }
    return {TaskIntro, ScoreBar, FilloReaction, CompletionOverlay, GameFeedbackProvider};
})();
