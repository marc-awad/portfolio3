(function () {
    'use strict';

    breakpoints({
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: ['481px', '736px'],
        xsmall: ['361px', '480px'],
        xxsmall: [null, '360px']
    });

    var body = document.body;
    var header = document.getElementById('header');
    var footer = document.getElementById('footer');
    var main = document.getElementById('main');
    var articles = main ? Array.from(main.children).filter(function (el) {
        return el.tagName === 'ARTICLE';
    }) : [];

    window.addEventListener('load', function () {
        window.setTimeout(function () {
            body.classList.remove('is-preload');
        }, 100);
    });

    if (header) {
        var nav = header.querySelector('nav');
        if (nav) {
            var items = nav.querySelectorAll('li');
            if (items.length > 0 && items.length % 2 === 0) {
                nav.classList.add('use-middle');
                items[items.length / 2].classList.add('is-middle');
            }
        }
    }

    var delay = 325;
    var locked = false;

    function show(id, initial) {
        var article = articles.find(function (el) { return el.id === id; });
        if (!article) return;

        if (locked || initial === true) {
            body.classList.add('is-switching');
            body.classList.add('is-article-visible');
            articles.forEach(function (el) { el.classList.remove('active'); });
            if (header) header.style.display = 'none';
            if (footer) footer.style.display = 'none';
            if (main) main.style.display = '';
            article.style.display = '';
            article.classList.add('active');
            locked = false;
            setTimeout(function () {
                body.classList.remove('is-switching');
            }, initial ? 1000 : 0);
            return;
        }

        locked = true;

        if (body.classList.contains('is-article-visible')) {
            var current = articles.find(function (el) { return el.classList.contains('active'); });
            if (current) current.classList.remove('active');
            setTimeout(function () {
                if (current) current.style.display = 'none';
                article.style.display = '';
                setTimeout(function () {
                    article.classList.add('active');
                    window.scrollTo(0, 0);
                    setTimeout(function () { locked = false; }, delay);
                }, 25);
            }, delay);
        } else {
            body.classList.add('is-article-visible');
            setTimeout(function () {
                if (header) header.style.display = 'none';
                if (footer) footer.style.display = 'none';
                if (main) main.style.display = '';
                article.style.display = '';
                setTimeout(function () {
                    article.classList.add('active');
                    window.scrollTo(0, 0);
                    setTimeout(function () { locked = false; }, delay);
                }, 25);
            }, delay);
        }
    }

    function hide(pushHash) {
        var current = articles.find(function (el) { return el.classList.contains('active'); });
        if (!body.classList.contains('is-article-visible')) return;

        if (pushHash === true) {
            history.pushState(null, null, '#');
        }

        if (locked) {
            body.classList.add('is-switching');
            if (current) {
                current.classList.remove('active');
                current.style.display = 'none';
            }
            if (main) main.style.display = 'none';
            if (footer) footer.style.display = '';
            if (header) header.style.display = '';
            body.classList.remove('is-article-visible');
            locked = false;
            body.classList.remove('is-switching');
            window.scrollTo(0, 0);
            return;
        }

        locked = true;
        if (current) current.classList.remove('active');
        setTimeout(function () {
            if (current) current.style.display = 'none';
            if (main) main.style.display = 'none';
            if (footer) footer.style.display = '';
            if (header) header.style.display = '';
            setTimeout(function () {
                body.classList.remove('is-article-visible');
                window.scrollTo(0, 0);
                setTimeout(function () { locked = false; }, delay);
            }, 25);
        }, delay);
    }

    articles.forEach(function (article) {
        var close = document.createElement('div');
        close.className = 'close';
        close.textContent = 'Close';
        article.appendChild(close);
        close.addEventListener('click', function () {
            location.hash = '';
        });
        article.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

    body.addEventListener('click', function () {
        if (body.classList.contains('is-article-visible')) hide(true);
    });

    window.addEventListener('keyup', function (e) {
        if (e.keyCode === 27 && body.classList.contains('is-article-visible')) {
            hide(true);
        }
    });

    window.addEventListener('hashchange', function (e) {
        if (location.hash === '' || location.hash === '#') {
            e.preventDefault();
            e.stopPropagation();
            hide();
        } else if (articles.find(function (el) { return '#' + el.id === location.hash; })) {
            e.preventDefault();
            e.stopPropagation();
            show(location.hash.substr(1));
        }
    });

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    } else {
        var oldScroll = 0;
        var newScroll = 0;
        window.addEventListener('scroll', function () {
            oldScroll = newScroll;
            newScroll = window.scrollY;
        });
        window.addEventListener('hashchange', function () {
            window.scrollTo(0, oldScroll);
        });
    }

    if (main) main.style.display = 'none';
    articles.forEach(function (el) { el.style.display = 'none'; });

    if (location.hash !== '' && location.hash !== '#') {
        window.addEventListener('load', function () {
            show(location.hash.substr(1), true);
        });
    }
})();
