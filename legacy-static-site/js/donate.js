// donate.js — scripts for donate page

document.addEventListener("DOMContentLoaded", function () {
    console.log("Donate page script loaded");

    const form = document.getElementById("donateForm");
    const successMsg = document.getElementById("formSuccess");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Basic validation
        const name = form.querySelector('#donor-name').value.trim();
        const email = form.querySelector('#donor-email').value.trim();
        const amount = form.querySelector('#donor-amount').value.trim();

        if (!name || !email || !amount) {
            // Highlight empty required fields
            [['#donor-name', name], ['#donor-email', email], ['#donor-amount', amount]].forEach(([sel, val]) => {
                const el = form.querySelector(sel);
                if (!val) {
                    el.style.borderColor = '#e05252';
                    el.addEventListener('input', function () {
                        this.style.borderColor = '';
                    }, { once: true });
                }
            });
            return;
        }

        // Simulate form submission — show success message
        form.style.display = "none";
        successMsg.style.display = "block";
    });
});
