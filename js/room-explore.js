const roomExplore = (() => {
    const layer = document.getElementById('room-hotspots');
    const image = document.getElementById('room-bg-img');
    const menu = document.getElementById('room-explore-menu');
    const panel = document.getElementById('room-info-panel');
    const toggle = document.getElementById('room-explore-toggle');
    let dept = null, opener = null;
    const visited = new Map();
    for (const [id, spots] of Object.entries(journeyData.read('flo-room-notes'))) {
        const valid = departmentsData[id]?.hotspots;
        if (valid && Array.isArray(spots)) visited.set(Number(id), new Set(spots.filter(spot => valid.some(item => item.id === spot))));
    }
    function notes() { return Object.fromEntries([...visited].map(([id, values]) => [id, [...values]])); }
    function saveNotes() { journeyData.save('flo-room-notes', notes()); }
    function align() {
        if (!image.naturalWidth || !image.naturalHeight) return;
        const width = image.clientWidth, height = image.clientHeight;
        const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
        const contentWidth = image.naturalWidth * scale, contentHeight = image.naturalHeight * scale;
        Object.assign(layer.style, {left: `${(width - contentWidth) / 2}px`, top: `${(height - contentHeight) / 2}px`, width: `${contentWidth}px`, height: `${contentHeight}px`});
        Object.assign(document.getElementById('room-art-frame').style, {left:layer.style.left,top:layer.style.top,width:layer.style.width,height:layer.style.height});
        image.style.clipPath = `inset(${(height-contentHeight)/2}px ${(width-contentWidth)/2}px round 18px)`;
        positionInfo();
    }
    function positionInfo() {
        if (panel.hidden || !opener?.isConnected) return;
        const bounds = panel.offsetParent.getBoundingClientRect();
        const anchor = opener.getBoundingClientRect();
        const gap = 12, padding = 12;
        const width = panel.offsetWidth, height = panel.offsetHeight;
        const center = (anchor.left + anchor.right) / 2 - bounds.left;
        const below = anchor.bottom - bounds.top + gap;
        const above = anchor.top - bounds.top - height - gap;
        const left = Math.max(padding, Math.min(center - width / 2, bounds.width - width - padding));
        const top = Math.max(padding, Math.min(below + height <= bounds.height - padding ? below : above, bounds.height - height - padding));
        Object.assign(panel.style, {left: `${left}px`, top: `${top}px`});
    }
    function close(returnFocus = true) {
        panel.hidden = true;
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        layer.querySelectorAll('button').forEach(button => button.setAttribute('aria-expanded', 'false'));
        if (returnFocus && opener?.isConnected) opener.focus({preventScroll: true});
    }
    function openInfo(spot, trigger) {
        opener = trigger;
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        panel.hidden = false;
        document.getElementById('room-info-title').replaceChildren();
        document.getElementById('room-info-title').insertAdjacentHTML('beforeend', GameProps.render(spot.icon));
        document.getElementById('room-info-title').append(document.createTextNode(spot.title));
        const short = spot.desc.length > 240 ? spot.desc.slice(0, 240).replace(/\s+\S*$/, '') + '…' : spot.desc;
        document.getElementById('room-info-text').textContent = short;
        const more = document.getElementById('room-info-more');
        more.hidden = short === spot.desc; more.open = false;
        document.getElementById('room-info-full').textContent = spot.desc;
        visited.get(dept.id).add(spot.id);
        saveNotes();
        updateCount();
        layer.querySelectorAll('button').forEach(button => button.setAttribute('aria-expanded', String(button.dataset.spot === spot.id)));
        positionInfo();
        document.getElementById('room-info-close').focus({preventScroll: true});
    }
    function updateCount() {
        toggle.textContent = `🔎 Keşfet · ${visited.get(dept.id).size}/${dept.hotspots.length}`;
        for (const container of [layer, menu]) container.querySelectorAll('[data-spot]').forEach(button => {
            button.classList.toggle('explored', visited.get(dept.id).has(button.dataset.spot));
        });
    }
    function render(department) {
        dept = department;
        close(false);
        layer.replaceChildren(); menu.replaceChildren();
        toggle.hidden = !dept?.hotspots?.length;
        if (toggle.hidden) return;
        if (!visited.has(dept.id)) { visited.set(dept.id, new Set()); saveNotes(); }
        for (const [i, spot] of dept.hotspots.entries()) {
            const marker = document.createElement('button');
            marker.type = 'button'; marker.className = 'room-info-point';
            marker.innerHTML = `${GameProps.render(spot.icon, i)}<span class="prop-status" aria-hidden="true">${i + 1}</span><span class="prop-label"></span>`;
            marker.querySelector('.prop-label').textContent = spot.title;
            marker.style.setProperty('--prop-delay', `${i * -.3}s`);
            marker.dataset.spot = spot.id;
            marker.style.left = spot.left; marker.style.top = spot.top;
            marker.setAttribute('aria-label', `${i + 1}. ${spot.title}`);
            marker.setAttribute('aria-controls', 'room-info-panel');
            marker.setAttribute('aria-expanded', 'false');
            marker.addEventListener('click', () => openInfo(spot, marker));
            layer.appendChild(marker);
            const item = document.createElement('button');
            item.type = 'button'; item.innerHTML = GameProps.render(spot.icon, i);
            item.append(document.createTextNode(spot.title));
            item.dataset.spot = spot.id;
            item.addEventListener('click', () => openInfo(spot, toggle));
            menu.appendChild(item);
        }
        updateCount(); align();
    }
    toggle.addEventListener('click', () => {
        panel.hidden = true;
        menu.hidden = !menu.hidden;
        toggle.setAttribute('aria-expanded', String(!menu.hidden));
        opener = toggle;
    });
    document.getElementById('room-info-close').addEventListener('click', () => close());
    document.getElementById('room-info-task').addEventListener('click', () => { close(false); openGameView(); });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && (!panel.hidden || !menu.hidden)) { event.preventDefault(); close(); }
    });
    image.addEventListener('load', align);
    new ResizeObserver(positionInfo).observe(panel);
    new ResizeObserver(align).observe(image);
    return {render, close, notes};
})();
