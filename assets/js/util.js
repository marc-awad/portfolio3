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
        slides.forEach((s) => s.classList.remove('active'));
        indicators.forEach((i) => i.classList.remove('active'));
        slides[current].classList.add('active');
        if (indicators[current]) indicators[current].classList.add('active');
        wrapper.style.transform = `translateX(-${100 * current}%)`;
    }

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
