document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-auth-carousel]').forEach(function (carousel) {
        const slides = Array.from(carousel.querySelectorAll('.auth-slide'));
        const dots = Array.from(carousel.querySelectorAll('.auth-carousel-dots button'));
        if (slides.length < 2) return;

        let activeIndex = 0;
        let intervalId = null;

        function showSlide(index) {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach((slide, i) => slide.classList.toggle('is-active', i === activeIndex));
            dots.forEach((dot, i) => {
                dot.classList.toggle('is-active', i === activeIndex);
                dot.setAttribute('aria-pressed', i === activeIndex ? 'true' : 'false');
            });
        }

        function start() {
            stop();
            intervalId = window.setInterval(() => showSlide(activeIndex + 1), 4500);
        }

        function stop() {
            if (intervalId !== null) {
                window.clearInterval(intervalId);
                intervalId = null;
            }
        }

        dots.forEach((dot, i) => {
            dot.addEventListener('click', function () {
                showSlide(i);
                start();
            });
        });

        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
        showSlide(0);
        start();
    });
});
