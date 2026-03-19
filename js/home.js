// home.js — homepage interactions

document.addEventListener("DOMContentLoaded", function () {
    console.log("Home page script loaded");

    // ===== HERO SLIDESHOW =====
    function initHeroSlideshow() {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.hero-dot');
        if (!slides.length) return;

        let current = 0;
        let autoplayTimer;

        function goToSlide(index) {
            slides[current].classList.remove('active');
            dots[current].classList.remove('active');
            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
            dots[current].classList.add('active');
        }

        function nextSlide() {
            goToSlide(current + 1);
        }

        function startAutoplay() {
            autoplayTimer = setInterval(nextSlide, 5000);
        }

        function stopAutoplay() {
            clearInterval(autoplayTimer);
        }

        // Dot click controls
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                stopAutoplay();
                goToSlide(i);
                startAutoplay();
            });
        });

        // Pause on hover
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', stopAutoplay);
            heroSection.addEventListener('mouseleave', startAutoplay);
        }

        // Touch swipe support
        let touchStartX = 0;
        if (heroSection) {
            heroSection.addEventListener('touchstart', e => {
                touchStartX = e.touches[0].clientX;
            }, { passive: true });

            heroSection.addEventListener('touchend', e => {
                const diff = touchStartX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) {
                    stopAutoplay();
                    goToSlide(diff > 0 ? current + 1 : current - 1);
                    startAutoplay();
                }
            }, { passive: true });
        }

        startAutoplay();
    }

    initHeroSlideshow();

    // ===== ANIMATED COUNTERS =====
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        const duration = 1800;
        const startTime = performance.now();

        function easeOut(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.round(easeOut(progress) * target);
            el.textContent = value.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    }

    function initCounters() {
        const counterEls = document.querySelectorAll('.impact-number[data-target]');
        if (!counterEls.length) return;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counterEls.forEach(el => observer.observe(el));
        } else {
            counterEls.forEach(animateCounter);
        }
    }

    initCounters();
});
