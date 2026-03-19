// contact.js — scripts for contact page

document.addEventListener("DOMContentLoaded", function () {
    console.log("Contact page script loaded");

    const form = document.getElementById('contact-form');
    const successMsg = document.getElementById('contactSuccess');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name    = document.getElementById('name').value.trim();
        const email   = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validate required fields
        let valid = true;
        [['#name', name], ['#email', email], ['#message', message]].forEach(([sel, val]) => {
            const el = form.querySelector(sel);
            if (!val) {
                el.style.borderColor = '#e05252';
                el.addEventListener('input', function () {
                    this.style.borderColor = '';
                }, { once: true });
                valid = false;
            }
        });

        if (!valid) return;

        // Email format check
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            const emailEl = form.querySelector('#email');
            emailEl.style.borderColor = '#e05252';
            emailEl.addEventListener('input', function () {
                this.style.borderColor = '';
            }, { once: true });
            return;
        }

        // Show success state
        form.style.display = 'none';
        if (successMsg) successMsg.style.display = 'block';
    });
});
