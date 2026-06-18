// get-involved.js — scripts for get involved page

document.addEventListener("DOMContentLoaded", function () {
    console.log("Get Involved page script loaded");

    // Smooth scroll for card links that point to same-page anchors
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

    // Add any other get-involved-page specific interactions here
});