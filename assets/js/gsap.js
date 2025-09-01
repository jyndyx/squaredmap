jQuery(function($) {

    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    /* ===============================
    * Pinned sections that reveal on scroll
    * =============================== */
    (function setupPillarPinsExistingStage(){
    const stage = document.querySelector('.pillar-stage');
    if (!stage) return;

    const panels = gsap.utils.toArray(':scope > .pillar-pin', stage);
    if (panels.length < 2) return;

    const baseZ       = 100;
    const stepDur     = 0.75;
    const HOLD        = .2;     
    const FINAL_FADE  = stepDur;
    const EARLY_REVEAL_VH = 50;

    const steps       = panels.length - 1;
    const holdsCnt    = Math.max(steps - 1, 0);
    const FIRST_HOLD  = HOLD * 2.5;     
    const lastHold    = steps > 0 ? HOLD : 0;
    const totalUnits  = FIRST_HOLD + (steps * stepDur) + (holdsCnt * HOLD) + lastHold + FINAL_FADE;

    panels.forEach((p, i) => {
        gsap.set(p, {
        position: 'absolute',
        inset: 0,
        zIndex: baseZ + i,
        autoAlpha: 1,
        scale: 1,
        yPercent: i === 0 ? 0 : 100
        });
    });
    const last = panels[panels.length - 1];

    const tl = gsap.timeline({
        scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: () => '+=' + (totalUnits * window.innerHeight),
        scrub: true,
        pin: stage,
        pinSpacing: true,
        anticipatePin: 0,
        invalidateOnRefresh: true,
        onToggle: self => gsap.set(stage, { zIndex: self.isActive ? 999 : '' }),
        onRefreshInit: self => { if (self.pinSpacer) self.pinSpacer.style.height = ''; },
        onRefresh: self => {
            const spacer = self.pinSpacer;
            if (!spacer) return;
            const currentH = parseFloat(getComputedStyle(spacer).height) || 0;
            const offset   = Math.max(0, Math.round(window.innerHeight * (EARLY_REVEAL_VH / 100)));
            spacer.style.height = Math.max(0, currentH - offset) + 'px';
        },
        }
    });

    let t = 0;

    if (steps > 0) {
        tl.to({}, { duration: FIRST_HOLD }, t);
        t += FIRST_HOLD;
    }

    for (let i = 1; i < panels.length; i++) {
        tl.to(panels[i],     { yPercent: 0,            duration: stepDur, ease: 'power3.out' }, t);
        tl.to(panels[i - 1], { autoAlpha: 0, scale: .8, duration: stepDur, ease: 'power3.out' }, t);

        if (i < panels.length - 1) {
        tl.to({}, { duration: HOLD });
        t += stepDur + HOLD;
        } else {
        t += stepDur;
        }
    }

    if (lastHold > 0) {
        tl.to({}, { duration: lastHold }, t);
        t += lastHold;
    }
    tl.to(last, { autoAlpha: 0, scale: 0.8, duration: FINAL_FADE, ease: 'power3.out' }, t);

    window.addEventListener('load', () => ScrollTrigger.refresh());
    })();

    /* ===============================
    * Scrolling marquee text
    * =============================== */
    const prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function initSimpleMarquee(scope){
        const root = scope || document;
        gsap.utils.toArray('.marquee-text', root).forEach(el => {
        if (el.__marqBound) return;
        el.__marqBound = true;

        const speed = Math.max(10, parseFloat(el.dataset.speed || '80')); 
        const dir = (el.dataset.direction || 'left').toLowerCase();      
        const gap = parseFloat(el.dataset.gap || '0');                   
        const originalHTML = el.innerHTML;
        const track = document.createElement('div');
        track.className = 'marquee-track';
        if (gap) track.style.setProperty('--marquee-gap', gap + 'px');

        const seg1 = document.createElement('span');
        seg1.innerHTML = originalHTML;
        const seg2 = seg1.cloneNode(true); 

        track.appendChild(seg1);
        track.appendChild(seg2);
        el.innerHTML = '';
        el.appendChild(track);

        if (!el.style.width) el.style.width = '100%';
        let tween;
        function build(){
            if (tween) { tween.kill(); tween = null; }
            const segW = seg1.getBoundingClientRect().width + (gap || 0);
            if (!segW) return;
            const distance = dir === 'left' ? -segW : segW;
            const duration = Math.max(0.1, segW / speed);

            tween = gsap.fromTo(track,
            { x: 0 },
            {
                x: distance,
                duration,
                ease: 'none',
                repeat: -1,
                onRepeat: () => gsap.set(track, { x: 0 })
            }
            );

            if (prefersReduce || el.dataset.pause === 'true') {
            tween.pause(0);
            }
        }

        build();
        let resizeTO;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTO);
            resizeTO = setTimeout(build, 120);
        });
        if (el.classList.contains('marquee-pause-on-hover')) {
            el.addEventListener('mouseenter', () => tween && tween.pause());
            el.addEventListener('mouseleave', () => tween && tween.resume());
        }
        });
    }

    initSimpleMarquee(document);
    $(window).on('elementor/frontend/init', function () {
      if (window.elementorFrontend && !elementorFrontend.isEditMode()) {
        elementorFrontend.hooks.addAction('frontend/element_ready/global', function($el){
            initSimpleMarquee($el[0]);
        });
        }
    });


    /* ===============================
    * Parallax Images on Scroll
    * =============================== */
    (function setupParallaxImages(){
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

      function init(scope){
        const root = scope || document;
        gsap.utils.toArray('.parallax-frame', root).forEach(frame => {
          if (frame.__parallaxBound) return;
          frame.__parallaxBound = true;

          const img = frame.querySelector('img');
          if (!img) return;

          const speed = parseFloat(frame.dataset.speed || '0.9'); 
          gsap.fromTo(img,
            { yPercent: -20 * speed },
            {
              yPercent:  20 * speed,
              ease: 'none',
              scrollTrigger: {
                trigger: frame,
                start: 'top bottom',
                end:   'bottom top',
                scrub: true,
                invalidateOnRefresh: true,
              }
            }
          );
        });
      }
      init(document);
      jQuery(window).on('elementor/frontend/init', function () {
        if (window.elementorFrontend && !elementorFrontend.isEditMode()) {
          elementorFrontend.hooks.addAction('frontend/element_ready/global', ($el) => init($el[0]));
        }
      });
    })();


   /* ===============================
    * Entrance Animation: Swipe In Left
    * =============================== */
    (function setupSwipeInLeft(){
      const items = gsap.utils.toArray('.gsap-swipe-in-left');
      if (!items.length) return;

      items.forEach(el => {
        if (el.__swipeBound) return;
        el.__swipeBound = true;
        const delayClass = [...el.classList].find(c => /^delay-(\d+)$/.test(c));
        const delay = delayClass ? (parseInt(delayClass.split('-')[1], 10) / 2) : 0;
        gsap.set(el, { '--clip': '100%', autoAlpha: 0 });
        gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
          }
        })
        
        .to(el, {
          duration: 1.2,
          '--clip': '0%',
          ease: 'power4.out',
          delay
        }, 0)
        .to(el, {
          autoAlpha: 1,
          duration: 0.2,
          ease: 'power1.out'
        }, 0);
      });
  })();

   /* ===============================
    * Entrance Animation: Fade In
    * =============================== */
  (function setupFadeInHalfView(){
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const inEditor = !!(window.elementorFrontend?.isEditMode?.());

    gsap.utils.toArray('.gsap-fade-in').forEach(el => {
      if (el.__fadeBound) return;
      el.__fadeBound = true;

      if (inEditor) { gsap.set(el, { autoAlpha: 1 }); return; }

      const dur   = parseFloat(el.dataset.dur   || '0.8'); 
      const delay = parseFloat(el.dataset.delay || '0');   
      gsap.fromTo(el,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: dur,
          ease: 'power2.out',
          delay,
          scrollTrigger: {
            trigger: el,
            start: () => 'top+=' + (el.offsetHeight * 0.5) + ' bottom',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    });
  })();

  });
