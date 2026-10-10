// Local learning record. Never infer a score from an old badge alone.
const journeyData = (() => {
    function read(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || '{}');
            return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
        } catch (_) { return {}; }
    }
    function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} }
    function normalized(result) {
        if (!result || !Number.isFinite(result.score) || !Number.isFinite(result.total) || result.total <= 0 || result.score < 0 || result.score > result.total) return null;
        return {score: result.score, total: result.total, percent: Math.round(result.score / result.total * 10000) / 100};
    }
    const scores = {};
    for (const [id, result] of Object.entries(read('flo-game-scores'))) {
        const valid = normalized(result);
        if (departmentGames[id] && valid) scores[id] = valid;
    }
    function record(id, result) {
        const valid = normalized(result);
        if (!departmentGames[id] || !valid) return;
        if (!scores[id] || valid.percent >= scores[id].percent) {
            scores[id] = valid;
            save('flo-game-scores', scores);
        }
    }
    function recommendation(completed) {
        const ids = [...new Set(completed)].filter(id => departmentGames[id] && scores[id] && departmentsData[id].family);
        if (ids.length < 5) return {ready: false, count: ids.length};
        const groups = {};
        for (const id of ids) {
            const family = departmentsData[id].family;
            (groups[family] ||= []).push({id, ...scores[id]});
        }
        const families = Object.entries(groups).map(([family, rows]) => ({family, count: rows.length, average: rows.reduce((sum, row) => sum + row.percent, 0) / rows.length}));
        families.sort((a, b) => b.average - a.average || b.count - a.count || a.family.localeCompare(b.family, 'tr'));
        const strongest = ids.sort((a, b) => scores[b].percent - scores[a].percent || a - b);
        return {ready: true, count: ids.length, families, winner: families[0],
            tiedFamilies: families.filter(v => Math.abs(v.average - families[0].average) < 0.000001),
            strongest: strongest[0], tiedDepartments: strongest.filter(id => scores[id].percent === scores[strongest[0]].percent)};
    }
    return {read, save, record, recommendation, scores: () => structuredClone(scores)};
})();
