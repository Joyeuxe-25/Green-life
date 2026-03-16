// shared.js — common functionality used across multiple pages

document.addEventListener("DOMContentLoaded", function () {
    console.log("Shared scripts loaded");

    // ===== Header and Footer Templates =====
    const headerTemplate = `
        <header class="site-header">
            <div class="container">
                <div class="logo">
                    <a href="index.html">
                        <img src="assets/logos/logo.JPG" alt="Green for Life Rwanda">
                    </a>
                </div>
                <nav class="main-nav">
                    <button class="mobile-menu-toggle" aria-label="Menu" aria-expanded="false">
                        <span></span><span></span><span></span>
                    </button>
                    <ul class="nav-links">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="programs.html">Programs</a></li>
                        <li><a href="projects.html">Projects</a></li>
                        <li><a href="impact.html">Impact</a></li>
                        <li><a href="news.html">News</a></li>
                        <li><a href="get-involved.html">Get Involved</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </nav>
                <a href="#" class="btn btn-primary donate-btn">Donate</a>
            </div>
        </header>
    `;

    const footerTemplate = `
        <footer class="site-footer">
            <div class="container">
                <div class="footer-grid">
                    <!-- Quick Links -->
                    <div class="footer-column">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="about.html">About Us</a></li>
                            <li><a href="projects.html">Projects</a></li>
                            <li><a href="news.html">News</a></li>
                            <li><a href="contact.html">Contact</a></li>
                        </ul>
                    </div>

                    <!-- Contact -->
                    <div class="footer-column">
                        <h3>Contact</h3>
                        <p><i class="fas fa-envelope"></i> greenforliferwanda@gmail.com</p>
                        <p><i class="fas fa-phone"></i> +250-788-487-932</p>
                        <p><i class="fas fa-map-marker-alt"></i>  Rwanda, South, Huye, Mukura Sector , Rango Cell</p>
                    </div>

                    <!-- Follow Us -->
                    <div class="footer-column">
                        <h3>Follow Us</h3>
                        <p><a href="#"><i class="fab fa-facebook"></i> Facebook</a></p>
                        <p><a href="#"><i class="fab fa-x-twitter"></i> X</a></p>
                        <p><a href="#"><i class="fab fa-instagram"></i> Instagram</a></p>
                    </div>

                    <!-- Support Us -->
                    <div class="footer-column">
                        <h3>Support Us</h3>
                        <p>Support our environmental work and community initiatives.</p>
                        <a href="#" class="donate-btn">Donate Now</a>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>© 2026 Green for Life Rwanda. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;

    // ===== Inject Header and Footer =====
    const headerPlaceholder = document.getElementById('site-header');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerTemplate;
    }

    const footerPlaceholder = document.getElementById('site-footer');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerTemplate;
    }

    // ===== Set Active Navigation Link =====
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    setActiveNavLink();

    // ===== Mobile Menu Toggle =====
    function initMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (menuToggle && navLinks) {
            // Remove any existing listeners to avoid duplicates
            const newToggle = menuToggle.cloneNode(true);
            menuToggle.parentNode.replaceChild(newToggle, menuToggle);
            const newNavLinks = navLinks.cloneNode(true);
            navLinks.parentNode.replaceChild(newNavLinks, navLinks);

            // Re-attach event listener
            newToggle.addEventListener('click', function () {
                const expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
                this.setAttribute('aria-expanded', expanded);
                newNavLinks.classList.toggle('active');
            });

            // Close menu when a nav link is clicked
            newNavLinks.addEventListener('click', function (e) {
                if (e.target.tagName === 'A') {
                    newNavLinks.classList.remove('active');
                    newToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }
    initMobileMenu();

    // ===== Scroll Reveal for Sections (unchanged) =====
    const sections = document.querySelectorAll('.section');
    
    if (sections.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

        sections.forEach(section => {
            section.classList.add('section-hidden');
            observer.observe(section);
        });
    } else {
        sections.forEach(section => {
            section.classList.add('section-visible');
        });
    }
});
