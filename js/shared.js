// shared.js — common functionality used across multiple pages

document.addEventListener("DOMContentLoaded", function () {

    // ===== HEADER TEMPLATE =====
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
                        <li class="has-dropdown">
                            <a href="about.html">About <i class="fas fa-chevron-down nav-arrow"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="about.html#vision">Vision, Mission & Core Values</a></li>
                                <li><a href="about.html#history">Our History</a></li>
                                <li><a href="about.html#staff">Our Staff & Board</a></li>
                                <li><a href="about.html#reports">Annual & Other Reports</a></li>
                                <li><a href="contact.html">Contact Us</a></li>
                            </ul>
                        </li>
                        <li class="has-dropdown">
                            <a href="programs.html">Programs <i class="fas fa-chevron-down nav-arrow"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="programs.html#agroforestry">Agroforestry</a></li>
                                <li><a href="programs.html#climate">Climate Action</a></li>
                                <li><a href="programs.html#education">Environmental Education</a></li>
                                <li><a href="programs.html#livelihoods">Community Livelihoods</a></li>
                                <li><a href="programs.html#activities">Hands-on Activities</a></li>
                            </ul>
                        </li>
                        <li class="has-dropdown">
                            <a href="news.html">News <i class="fas fa-chevron-down nav-arrow"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="news.html#news">News</a></li>
                                <li><a href="news.html#events">Events</a></li>
                                <li><a href="news.html#media">Media Resources</a></li>
                            </ul>
                        </li>
                        <li><a href="projects.html">Projects</a></li>
                        <li><a href="impact.html">Impact</a></li>
                        <li><a href="get-involved.html">Get Involved</a></li>
                    </ul>
                </nav>
                <a href="donate.html" class="btn donate-btn">Donate Now</a>
            </div>
        </header>
    `;

    // ===== FOOTER TEMPLATE =====
    const footerTemplate = `
        <footer class="site-footer">
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-brand">
                        <img src="assets/logos/logo.jpg" alt="Green for Life Rwanda" class="footer-logo">
                        <p>An environmental organization that empowers communities, particularly small household farmers, to conserve the environment and improve livelihoods.</p>
                        <div class="footer-social">
                            <a href="https://web.facebook.com/GREEN-for-LIFE-Rwanda-100208564927414" target="_blank" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                            <a href="https://x.com/liferwanda1" target="_blank" aria-label="X / Twitter"><i class="fab fa-x-twitter"></i></a>
                            <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                            <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        </div>
                    </div>
                    <div class="footer-column">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="about.html">Who We Are</a></li>
                            <li><a href="programs.html">Programs</a></li>
                            <li><a href="projects.html">Projects</a></li>
                            <li><a href="news.html">News & Events</a></li>
                            <li><a href="get-involved.html">Support Our Work</a></li>
                            <li><a href="contact.html">Contact Us</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h3>Contact</h3>
                        <p><i class="fas fa-envelope"></i> <a href="mailto:greenforliferwanda@gmail.com">greenforliferwanda@gmail.com</a></p>
                        <p><i class="fas fa-phone"></i> +250-788-487-932</p>
                        <p><i class="fas fa-map-marker-alt"></i> Rwanda, South Province, Huye, Mukura Sector, Rango Cell</p>
                    </div>
                    <div class="footer-column">
                        <h3>Support Us</h3>
                        <p>Your support helps conserve soil, ensure food security, sustain rural livelihoods, and build resilience to climate change.</p>
                        <a href="donate.html" class="btn btn-primary footer-donate-btn">Donate Now</a>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>© 2026 Green for Life Rwanda. All rights reserved.</p>
                    <p class="footer-quote">"He who plants a tree plants a hope" — Lucy Larcom</p>
                </div>
            </div>
        </footer>
    `;

    // ===== INJECT =====
    const headerPlaceholder = document.getElementById('site-header');
    if (headerPlaceholder) headerPlaceholder.innerHTML = headerTemplate;

    const footerPlaceholder = document.getElementById('site-footer');
    if (footerPlaceholder) footerPlaceholder.innerHTML = footerTemplate;

    // ===== ACTIVE NAV LINK =====
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links > li > a').forEach(link => {
            const href = link.getAttribute('href').split('#')[0];
            if (href === currentPage) link.classList.add('active');
        });
    }
    setActiveNavLink();

    // ===== MOBILE MENU =====
    function initMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        if (!menuToggle || !navLinks) return;

        // Inject Donate Now button at bottom of mobile nav if not already there
        if (!navLinks.querySelector('.nav-mobile-donate')) {
            const mobileBtn = document.createElement('a');
            mobileBtn.href = 'donate.html';
            mobileBtn.className = 'nav-mobile-donate';
            mobileBtn.innerHTML = '<i class="fas fa-heart"></i> Donate Now';
            navLinks.appendChild(mobileBtn);
        }

        menuToggle.addEventListener('click', function () {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Mobile dropdown accordion
        document.querySelectorAll('.has-dropdown > a').forEach(link => {
            link.addEventListener('click', function (e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    const parent = this.closest('.has-dropdown');
                    // Close all other open dropdowns first
                    document.querySelectorAll('.has-dropdown.dropdown-open').forEach(el => {
                        if (el !== parent) el.classList.remove('dropdown-open');
                    });
                    parent.classList.toggle('dropdown-open');
                }
            });
        });

        // Close menu when a non-parent link is clicked
        navLinks.addEventListener('click', function (e) {
            const link = e.target.closest('a');
            if (!link) return;
            const isDropdownParent = link.closest('.has-dropdown > a');
            if (!isDropdownParent) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
                document.querySelectorAll('.has-dropdown.dropdown-open').forEach(el => {
                    el.classList.remove('dropdown-open');
                });
            }
        });
    }
    initMobileMenu();

    // ===== FIXED NAVBAR: TRANSPARENT → WHITE ON SCROLL =====
    function initScrollHeader() {
        const wrapper = document.getElementById('site-header');
        const header  = document.querySelector('.site-header');
        if (!wrapper || !header) return;

        // Pages that have a full-image hero — start transparent on these
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const heroPages = ['index.html', 'about.html', 'programs.html', 'news.html', 'projects.html', 'impact.html', 'get-involved.html', 'donate.html', 'contact.html', ''];
        const hasHero = heroPages.includes(currentPage);

        // Force wrapper fixed — beats global.css
        wrapper.setAttribute('style',
            'position:fixed!important;top:0!important;left:0!important;' +
            'right:0!important;width:100%!important;z-index:9999!important;'
        );

        function paintTransparent() {
            header.setAttribute('style',
                'background-color:transparent!important;' +
                'box-shadow:none!important;' +
                'transition:background-color 0.4s ease,box-shadow 0.4s ease;'
            );
            // Only style TOP-LEVEL nav links (not dropdown children)
            header.querySelectorAll('.nav-links > li > a').forEach(a => {
                a.setAttribute('style', 'color:#ffffff!important;');
            });
            // Clear any styles on dropdown links so CSS hover works
            header.querySelectorAll('.dropdown-menu a').forEach(a => {
                a.removeAttribute('style');
            });
            const donate = header.querySelector('.donate-btn');
            if (donate) donate.setAttribute('style',
                'background:rgba(255,255,255,0.15)!important;' +
                'border:2px solid rgba(255,255,255,0.65)!important;' +
                'color:#ffffff!important;padding:8px 20px!important;border-radius:4px!important;'
            );
            header.querySelectorAll('.mobile-menu-toggle span').forEach(s => {
                s.setAttribute('style', 'background-color:#ffffff!important;');
            });
        }

        function paintScrolled() {
            header.setAttribute('style',
                'background-color:#ffffff!important;' +
                'box-shadow:0 2px 20px rgba(0,0,0,0.10)!important;' +
                'transition:background-color 0.4s ease,box-shadow 0.4s ease;'
            );
            // Only style TOP-LEVEL nav links (not dropdown children)
            header.querySelectorAll('.nav-links > li > a').forEach(a => {
                a.setAttribute('style', 'color:#1a4a2e!important;');
            });
            // Clear any styles on dropdown links so CSS hover works
            header.querySelectorAll('.dropdown-menu a').forEach(a => {
                a.removeAttribute('style');
            });
            const donate = header.querySelector('.donate-btn');
            if (donate) donate.setAttribute('style',
                'background:#4a7c59!important;' +
                'border:2px solid #4a7c59!important;' +
                'color:#ffffff!important;padding:8px 20px!important;border-radius:4px!important;'
            );
            header.querySelectorAll('.mobile-menu-toggle span').forEach(s => {
                s.setAttribute('style', 'background-color:#1a4a2e!important;');
            });
        }

        // Initial paint
        if (hasHero) {
            paintTransparent();
        } else {
            paintScrolled();
        }

        // Scroll listener — works on all hero pages
        window.addEventListener('scroll', function () {
            if (!hasHero) return;
            if (window.scrollY > 60) {
                paintScrolled();
            } else {
                paintTransparent();
            }
        }, { passive: true });
    }
    initScrollHeader();

    // ===== SCROLL REVEAL =====
    const sections = document.querySelectorAll('.section');
    if (sections.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        sections.forEach(s => { s.classList.add('section-hidden'); observer.observe(s); });
    } else {
        sections.forEach(s => s.classList.add('section-visible'));
    }
});
