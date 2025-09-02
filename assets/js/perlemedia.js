/* ===============================
 * Replace mobile menu icon
 * =============================== */
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



// /* ===============================
// * Testimonial Slider
// * =============================== */
// (function () {
//   const SETTINGS = {
//     autoplay: true,
//     interval: 6000,
//     pauseOnHover: true,
//     loop: true,
//     keyboard: false,
//     autoHeight: true,
//     touch: false,
//   };

//   document.addEventListener('DOMContentLoaded', initAll);
//   function initAll() {
//     document.querySelectorAll('.testimonial-container').forEach(initOne);
//   }

//   function initOne(container) {
//     if (container.dataset.sliderInit === '1') return;
//     container.dataset.sliderInit = '1';
//     const rawSlides = Array.from(container.children).filter(el => el.classList.contains('e-child'));

//     if (rawSlides.length <= 1) return;
//     const track = document.createElement('div');
//     track.className = 'testimonial-track';
//     rawSlides.forEach(s => {
//       s.classList.add('testimonial-slide');
//       track.appendChild(s);
//     });
//     container.appendChild(track);

//     let index = 0;
//     let timer = null;
//     let isDown = false;
//     let startX = 0, startY = 0;
//     let lastX = 0,  lastY = 0;
//     let startPx = 0;
//     let dragged = false;  // becomes true after a small horizontal move

//     const controlsOverlay = document.createElement('div');
//     controlsOverlay.className = 'testimonial-controls';
//     const dotsWrap = document.createElement('div');
//     dotsWrap.className = 'testimonial-dots';
//     const dots = rawSlides.map((_, i) => {
//       const d = document.createElement('button');
//       d.className = 'testimonial-dot';
//       d.type = 'button';
//       d.setAttribute('aria-label', `Go to slide ${i + 1}`);
//       d.addEventListener('click', () => goTo(i));
//       dotsWrap.appendChild(d);
//       return d;
//     });

//     controlsOverlay.appendChild(dotsWrap);
//     container.appendChild(controlsOverlay);

//     const arrowBar = document.createElement('div');
//     arrowBar.className = 'testimonial-arrows';

//     const prevSvg = `
//       <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
//         <mask id="mask0_223_31" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
//           <rect width="48" height="48" />
//         </mask>
//         <g mask="url(#mask0_223_31)">
//           <path d="M9.9999 21.0999L0.899902 11.9999L9.9999 2.8999L10.8499 3.7499L2.5999 11.9999L10.8499 20.2499L9.9999 21.0999Z"/>
//         </g>
//       </svg>`;
//     const nextSvg = `
//       <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
//         <g transform="scale(-1,1) translate(-24,0)">
//           <mask id="mask0_next" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
//             <rect width="48" height="48"/>
//           </mask>
//           <g mask="url(#mask0_next)">
//             <path d="M9.9999 21.0999L0.899902 11.9999L9.9999 2.8999L10.8499 3.7499L2.5999 11.9999L10.8499 20.2499L9.9999 21.0999Z" />
//           </g>
//         </g>
//       </svg>`;

//     const prevBtn = btn(prevSvg, () => goTo(index - 1), true);
//     const nextBtn = btn(nextSvg, () => goTo(index + 1), true);
//     arrowBar.append(prevBtn, nextBtn);
//     container.insertAdjacentElement('afterend', arrowBar);

//     if (SETTINGS.pauseOnHover) {
//       container.addEventListener('mouseenter', stopAutoplay);
//       container.addEventListener('mouseleave', startAutoplay);
//       arrowBar.addEventListener('mouseenter', stopAutoplay);
//       arrowBar.addEventListener('mouseleave', startAutoplay);
//     }

//     container.setAttribute('role', 'region');
//     container.setAttribute('aria-roledescription', 'carousel');
//     container.setAttribute('aria-label', 'Testimonials');
//     rawSlides.forEach((s, i) => {
//       s.setAttribute('role', 'group');
//       s.setAttribute('aria-roledescription', 'slide');
//       s.setAttribute('aria-label', `Slide ${i + 1} of ${rawSlides.length}`);
//     });

//     if (SETTINGS.keyboard) {
//       container.tabIndex = 0;
//       container.addEventListener('keydown', (e) => {
//         if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
//         if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
//       });
//     }

//     if (SETTINGS.touch) {
//       // Lower thresholds + angle lock
//       const ACTIVATE_PX  = 4;   // start dragging after ~4px horizontal movement
//       const MIN_SWIPE_PX = 14;  // commit to next/prev slide after ~14px
//       const opts = { passive: true };

//       const down = (e) => {
//         isDown = true;
//         startX = clientX(e);
//         startY = clientY(e);
//         lastX  = startX;
//         lastY  = startY;
//         dragged = false;
//         startPx = -index * container.clientWidth;
//         track.style.transition = 'none';
//       };

//       const move = (e) => {
//         if (!isDown) return;
//         const cx = clientX(e), cy = clientY(e);
//         const dx = cx - startX, dy = cy - startY;
//         lastX = cx; lastY = cy;

//         // Angle lock: only start dragging if horizontal move dominates
//         if (!dragged) {
//           if (Math.abs(dx) > ACTIVATE_PX && Math.abs(dx) > Math.abs(dy) + 2) {
//             dragged = true;
//           } else {
//             return; // ignore tiny or mostly-vertical moves
//           }
//         }
//         const px = startPx + dx;
//         const pct = (px / container.clientWidth) * 100;
//         track.style.transform = `translateX(${pct}%)`;
//       };

//       const up = (e) => {
//         if (!isDown) return;
//         isDown = false;
//         track.style.transition = '';
//         const dx = (lastX || startX) - startX; // safe if touchend lacks coords
//         if (dragged && Math.abs(dx) > MIN_SWIPE_PX) {
//           goTo(index + (dx < 0 ? 1 : -1));
//         } else {
//           update(); // snap back
//         }
//         dragged = false;
//       };

//       if (window.PointerEvent) {
//         track.addEventListener('pointerdown', down);
//         window.addEventListener('pointermove', move, opts);
//         window.addEventListener('pointerup', up);
//         window.addEventListener('pointercancel', up);
//       } else {
//         track.addEventListener('mousedown', down);
//         window.addEventListener('mousemove', move);
//         window.addEventListener('mouseup', up);
//         track.addEventListener('touchstart', down, opts);
//         window.addEventListener('touchmove', move, opts);
//         window.addEventListener('touchend', up);
//         window.addEventListener('touchcancel', up);
//       }
//     }

//     if (SETTINGS.autoHeight) container.classList.add('auto-height');

//     const ro = new ResizeObserver(() => {
//       if (SETTINGS.autoHeight) setHeightTo(index);
//     });
//     rawSlides.forEach(s => ro.observe(s));
//     window.addEventListener('resize', () => update(true));

//     update(true);
//     startAutoplay();

//     function btn(content, onClick, isSvg = false) {
//       const b = document.createElement('button');
//       b.className = 'testimonial-btn';
//       b.type = 'button';
//       if (isSvg) {
//         b.innerHTML = content;
//       } else {
//         b.textContent = content;
//       }
//       b.addEventListener('click', onClick);
//       return b;
//     }

//     function clientX(e) {
//       if ('changedTouches' in e && e.changedTouches && e.changedTouches.length) {
//         return e.changedTouches[0].clientX;
//       }
//       if ('touches' in e && e.touches && e.touches.length) {
//         return e.touches[0].clientX;
//       }
//       return (typeof e.clientX === 'number') ? e.clientX : lastX || startX || 0;
//     }
//     function clientY(e) {
//       if ('changedTouches' in e && e.changedTouches && e.changedTouches.length) {
//         return e.changedTouches[0].clientY;
//       }
//       if ('touches' in e && e.touches && e.touches.length) {
//         return e.touches[0].clientY;
//       }
//       return (typeof e.clientY === 'number') ? e.clientY : lastY || startY || 0;
//     }

//     function normalize(i) {
//       if (SETTINGS.loop) {
//         const n = rawSlides.length;
//         return (i % n + n) % n;
//       }
//       return Math.max(0, Math.min(rawSlides.length - 1, i));
//     }

//     function goTo(i) {
//       index = normalize(i);
//       update();
//       restartAutoplay();
//     }

//     function update(immediate = false) {
//       const x = -index * 100;
//       if (immediate) track.style.transition = 'none';
//       track.style.transform = `translateX(${x}%)`;
//       if (immediate) requestAnimationFrame(() => track.style.transition = '');
//       dots.forEach((d, i) => d.setAttribute('aria-current', i === index ? 'true' : 'false'));
//       if (SETTINGS.autoHeight) setHeightTo(index);
//     }

//     function setHeightTo(i) {
//       const h = rawSlides[i].getBoundingClientRect().height;
//       container.style.height = h + 'px';
//     }

//     function startAutoplay() {
//       if (!SETTINGS.autoplay || timer) return;
//       timer = setInterval(() => goTo(index + 1), SETTINGS.interval);
//     }
//     function stopAutoplay() {
//       if (!timer) return;
//       clearInterval(timer);
//       timer = null;
//     }
//     function restartAutoplay() {
//       if (!SETTINGS.autoplay) return;
//       stopAutoplay();
//       startAutoplay();
//     }
//   }
// })();
