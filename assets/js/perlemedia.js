// Change menu icon
document.addEventListener('DOMContentLoaded', function () {
    const NEW_D =
        'M21.039 36V33.505H54V36H21.039ZM1 19.2475V16.7525H54V19.2475H1ZM0 2.49505V0H54V2.49505H0Z';

    function replaceMenuIcons(root = document) {
        root.querySelectorAll('svg.kadence-menu-svg').forEach(svg => {
        svg.setAttribute('viewBox', '0 0 54 36');
        svg.setAttribute('width', svg.getAttribute('width') || '24');
        svg.setAttribute('height', svg.getAttribute('height') || '24');
        svg.setAttribute('fill', 'currentColor');

        const path = svg.querySelector('path');
        if (path) path.setAttribute('d', NEW_D);
        else {
            const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            p.setAttribute('d', NEW_D);
            svg.appendChild(p);
        }
        });
    }
    replaceMenuIcons();
const mo = new MutationObserver(muts => {
for (const m of muts) {
    if (m.type === 'childList' && (m.addedNodes?.length || m.removedNodes?.length)) {
    replaceMenuIcons(m.target instanceof Document ? m.target : document);
    }
}
});
  mo.observe(document.body, { childList: true, subtree: true });
});