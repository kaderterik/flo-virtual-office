// Code-native illustrations share one bold outline and saturated palette.
const GameArt = (() => {
    const drawings = {
        order: '<rect x="25" y="20" width="55" height="65" rx="5" fill="white"/><path d="M39 18H64V29H39Z" fill="#ff5a1f"/><path d="M39 43H66M39 57H66M39 71H59"/>',
        match: '<path d="M15 25H46V43H64V25H85V78H64V60H46V78H15Z" fill="#ff5a1f"/><path d="M46 25V43M46 60V78"/>',
        sortTimed: '<circle cx="50" cy="55" r="31" fill="white"/><path d="M41 12H59M50 12V23M50 36V55L66 64"/><path d="M68 27L77 18"/>',
        budget: '<path d="M18 83H87M27 82V56H40V82M49 82V39H62V82M71 82V20H84V82" fill="#ff5a1f"/><path d="M20 34L44 16 59 23"/>',
        flow: '<rect x="10" y="18" width="32" height="24" rx="3" fill="#ff5a1f"/><rect x="57" y="58" width="32" height="24" rx="3" fill="white"/><path d="M42 30H73V52M65 44L73 52 81 44"/>',
        stock: '<path d="M15 27L39 17 64 27V65L39 76 15 65Z" fill="#ff5a1f"/><path d="M15 27L39 39 64 27M39 39V76"/><circle cx="67" cy="59" r="18" fill="white"/><path d="M80 72L92 85"/>',
        materials: '<path d="M23 77Q9 26 81 18Q91 78 23 77Z" fill="#18a957"/><path d="M19 85L65 38M35 67V47M46 55H65"/>',
        routing: '<circle cx="22" cy="27" r="12" fill="#ff5a1f"/><circle cx="77" cy="71" r="14" fill="white"/><path d="M22 39V69H57M49 61L57 69 49 77"/>',
        ranking: '<path d="M16 84V54H38V84M39 84V26H62V84M63 84V66H86V84" fill="#ff5a1f"/><path d="M44 16L50 8 57 16"/>',
        markets: '<circle cx="50" cy="50" r="36" fill="white"/><ellipse cx="50" cy="50" rx="17" ry="36"/><path d="M15 40H85M15 60H85"/><path d="M67 12Q85 12 85 28Q85 39 68 52Q51 39 51 28Q51 12 67 12Z" fill="#ff5a1f"/><circle cx="68" cy="28" r="4" fill="white"/>',
        hidden: '<circle cx="45" cy="43" r="27" fill="#ffe03e"/><path d="M34 69V81H56V69M39 89H51M45 22V42M45 52V54M10 13L17 20M80 13L73 20"/>',
        kanban: '<rect x="11" y="17" width="78" height="66" rx="4" fill="white"/><path d="M37 17V83M63 17V83"/><path d="M17 30H30V44H17ZM43 47H56V61H43ZM69 63H82V76H69Z" fill="#ff5a1f"/>',
        crisis: '<path d="M18 35H40L80 16V74L40 57H18ZM29 57L37 84H52L43 59" fill="#ff5a1f"/><path d="M80 35Q96 44 80 55M14 28L8 23"/>',
        timeline: '<path d="M14 83H89M28 83V14H70V28H28M28 14L82 41H28M70 28V56M64 56H77V68H64" fill="white"/><path d="M28 31L44 41M28 53L42 66 28 78"/>',
        award: '<path d="M29 49L20 90 48 76 75 91 68 49" fill="#ff5a1f"/><circle cx="49" cy="39" r="28" fill="#ffe03e"/><path d="M49 21L54 33 67 34 57 43 60 56 49 49 38 56 41 43 31 34 44 33Z" fill="white"/>'
    };
    function icon(type) {
        return GameProps.render(type).replace('class="game-prop"', 'class="game-prop mg-art-icon"');
    }
    function elephant(state = 'idle') {
        return `<svg class="mg-fillo mg-fillo-${state === 'happy' ? 'correct' : state === 'confused' ? 'wrong' : 'ready'}" viewBox="0 0 120 120" aria-hidden="true" stroke="#343546" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
            <ellipse cx="60" cy="113" rx="37" ry="5" fill="#343546" opacity=".2" stroke="none"/>
            <rect x="22" y="68" width="76" height="36" rx="14" fill="#66999e"/>
            <path d="M32 84Q32 73 45 72H75Q88 74 88 87V106H32Z" fill="#f6a052"/>
            <path d="M40 101V112H54V102M68 102V112H83V101" fill="#91b7bf"/>
            <path d="M33 111H55V116H31ZM67 111H87V116H66Z" fill="#536478"/>
            <ellipse cx="25" cy="46" rx="21" ry="26" fill="#85afb8"/><ellipse cx="95" cy="46" rx="21" ry="26" fill="#85afb8"/>
            <ellipse cx="25" cy="48" rx="12" ry="17" fill="#e4afa6"/><ellipse cx="95" cy="48" rx="12" ry="17" fill="#e4afa6"/>
            <path d="M32 31Q36 12 60 12Q86 12 89 34L86 60Q82 80 61 83Q37 81 32 62Z" fill="#accdd0"/>
            <path d="M39 24Q41 6 61 6Q81 6 83 24L75 28H45Z" fill="#ee9855"/><path d="M33 26Q59 17 88 26L81 32H39Z" fill="#ffc47b"/>
            ${state === 'happy' ? '<path d="M39 46Q45 38 50 46M71 46Q77 38 82 46" fill="none"/>' : '<ellipse cx="45" cy="44" rx="4" ry="6" fill="#343546"/><ellipse cx="77" cy="44" rx="4" ry="6" fill="#343546"/><circle cx="44" cy="42" r="1.5" fill="#fff" stroke="none"/><circle cx="76" cy="42" r="1.5" fill="#fff" stroke="none"/>'}
            ${state === 'confused' ? '<path d="M39 34L50 37M72 34L82 31" fill="none"/>' : ''}
            <ellipse cx="40" cy="56" rx="6" ry="3" fill="#e4afa6" stroke="none"/><ellipse cx="81" cy="56" rx="6" ry="3" fill="#e4afa6" stroke="none"/>
            <path d="M53 54V76Q53 92 67 92Q79 92 80 80H69Q69 83 65 82V54" fill="#accdd0"/>
            <path d="M53 66H61M53 74H61" stroke="#759da7" stroke-width="2"/>
            <path d="M41 61L46 69 40 70ZM80 61L74 69 81 70Z" fill="#fff5db"/>
            <path d="M43 86V103M78 85V103" stroke="#ffd697"/>
            <rect x="47" y="96" width="27" height="12" rx="4" fill="#ffe6ab"/>
            <path d="M56 101H66" stroke="#ae734e"/>
        </svg>`;
    }
    function seatedHeart() {
        return `<svg class="fillo-seated" viewBox="0 0 160 150" aria-hidden="true" fill="none" stroke="#614b3d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="80" cy="137" rx="56" ry="7" fill="#b9916833" stroke="none"/>
        <path d="M47 88Q32 111 48 130H111Q129 113 112 88Z" fill="#f69a50"/>
        <ellipse cx="49" cy="127" rx="22" ry="12" fill="#b1cdd0"/><ellipse cx="110" cy="127" rx="22" ry="12" fill="#b1cdd0"/>
        <path d="M41 125v6m8-7v8m60-8v8m9-7v6" stroke="#819da2" stroke-width="2"/>
        <ellipse cx="39" cy="51" rx="27" ry="31" fill="#9ebdc5"/><ellipse cx="121" cy="51" rx="27" ry="31" fill="#9ebdc5"/>
        <ellipse cx="38" cy="53" rx="16" ry="22" fill="#e8b5b2"/><ellipse cx="122" cy="53" rx="16" ry="22" fill="#e8b5b2"/>
        <path d="M47 32Q50 13 80 13Q110 13 113 35V62Q108 91 80 91Q49 89 46 62Z" fill="#b7d2d2"/>
        <path d="M57 23Q58 5 80 5Q101 5 103 23L96 28H64Z" fill="#ec8b43"/><path d="M48 28Q80 17 113 28L104 36H57Z" fill="#ffc079"/>
        <path d="M58 51q7-10 13 0m20 0q7-10 13 0"/><ellipse cx="57" cy="62" rx="7" ry="4" fill="#eba9a6" stroke="none"/><ellipse cx="104" cy="62" rx="7" ry="4" fill="#eba9a6" stroke="none"/>
        <path d="M72 61v24q0 16 16 16q12 0 13-11H88q-1 4-5 1V62" fill="#b7d2d2"/>
        <path d="M79 105C40 84 56 61 80 80C104 61 122 84 79 118Z" fill="#ea7eaa" stroke="#a95578"/>
        <path d="M63 87q-8-9-11 0" stroke="#ffd5e5" stroke-width="4"/>
        <ellipse cx="49" cy="100" rx="10" ry="14" transform="rotate(-25 49 100)" fill="#b7d2d2"/><ellipse cx="112" cy="100" rx="10" ry="14" transform="rotate(25 112 100)" fill="#b7d2d2"/>
        <path d="M23 20l3-5 3 5-3 5Zm108-6 3-5 3 5-3 5Z" fill="#edb577" stroke="none"/></svg>`;
    }
    return {icon, elephant, seatedHeart};
})();
