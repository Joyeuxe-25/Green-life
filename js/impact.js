// impact.js — scripts for impact page

document.addEventListener("DOMContentLoaded", function () {
    console.log("Impact page script loaded");

    // Gentle count-up for the two verified numbers (19 and 353)
    const countNumbers = document.querySelectorAll('.impact-number[data-target]');
    
    if (countNumbers.length > 0 && 'IntersectionObserver' in window) {
        const countObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'), 10);
                    if (!isNaN(target) && target > 0) {
                        let current = 0;
                        const increment = target / 50; // animate over ~50 frames
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                el.textContent = target;
                                clearInterval(timer);
                            } else {
                                el.textContent = Math.floor(current);
                            }
                        }, 20);
                    }
                    observer.unobserve(el); // count only once
                }
            });
        }, { threshold: 0.5 });

        countNumbers.forEach(el => countObserver.observe(el));
    } else {
        // fallback: just set the numbers directly
        countNumbers.forEach(el => {
            const target = el.getAttribute('data-target');
            if (target) el.textContent = target;
        });
    }

    // Add any other impact-page specific interactions here
});