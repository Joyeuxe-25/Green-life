// projects.js — scripts for projects page

document.addEventListener("DOMContentLoaded", function () {
    console.log("Projects page script loaded");

    // Smooth scroll for "Learn more" links that point to same-page anchors
    const cardLinks = document.querySelectorAll('.card-link[href^="#"]');
    cardLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add any other projects-page specific interactions here
});