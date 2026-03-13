// contact.js — scripts for contact page

document.addEventListener("DOMContentLoaded", function () {
    console.log("Contact page script loaded");

    // Front-end form validation and demo alert
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Simple validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all required fields (Name, Email, Message).');
                return;
            }

            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Demo success message (no actual send)
            alert('Thank you for reaching out! This is a demo form. No actual message was sent, but we appreciate your interest in Green for Life Rwanda.');
            contactForm.reset(); // optional reset
        });
    }

    // Helper email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Add any other contact-page specific interactions here
});