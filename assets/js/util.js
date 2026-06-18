(function () {
    'use strict';

    const wrapper = document.querySelector('.carousel-wrapper');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    if (!wrapper || slides.length === 0) return;

    let current = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    function update() {
        slides.forEach((s, i) => {
            const isActive = i === current;
            s.classList.toggle('active', isActive);
            // Inactive slides are translated off-screen but stay in the DOM.
            // `inert` removes them from the tab order and the accessibility
            // tree so keyboard / screen-reader users can't land on the
            // hidden "View Live Project" links. aria-hidden is belt-and-
            // suspenders for older AT that predates inert support.
            if (isActive) {
                s.removeAttribute('inert');
                s.removeAttribute('aria-hidden');
            } else {
                s.setAttribute('inert', '');
                s.setAttribute('aria-hidden', 'true');
            }
        });
        indicators.forEach((ind, i) => {
            const isActive = i === current;
            ind.classList.toggle('active', isActive);
            if (isActive) ind.setAttribute('aria-current', 'true');
            else ind.removeAttribute('aria-current');
        });
        wrapper.style.transform = `translateX(-${100 * current}%)`;
    }

    // Establish the initial inert/aria state for the non-active slides
    // (the markup ships with slide 0 active, the rest are not yet inert).
    update();

    function next() {
        current = (current + 1) % slides.length;
        update();
    }

    function prev() {
        current = (current - 1 + slides.length) % slides.length;
        update();
    }

    function goTo(i) {
        current = i;
        update();
    }

    indicators.forEach((btn, i) => {
        btn.addEventListener('click', () => goTo(i));
    });

    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    document.addEventListener('keydown', (e) => {
        const projects = document.querySelector('#projects');
        if (projects && projects.classList.contains('active')) {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        }
    });

    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    wrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const threshold = 50;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > threshold) {
            if (diff > 0) next();
            else prev();
        }
    });
})();
