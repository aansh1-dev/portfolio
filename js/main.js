// main.js - Portfolio Website

// Smooth scroll for navbar links
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').slice(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Close mobile menu when a link is clicked (if open)
const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
mobileMenuLinks.forEach(a => a.addEventListener('click', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const toggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenu) { mobileMenu.style.display = 'none'; mobileMenu.setAttribute('aria-hidden', 'true'); }
    if (toggle) { toggle.setAttribute('aria-expanded', 'false'); }
}));

// IntersectionObserver for reveal animations (staggered)
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // optional stagger using CSS transitionDelay
            entry.target.style.transitionDelay = (entry.target.dataset.delay || '0') + 's';
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
reveals.forEach((el, i) => {
    // store small stagger
    el.dataset.delay = (i * 0.08).toFixed(2);
    observer.observe(el);
});

// Hero background subtle parallax on mouse move
const heroBg = document.querySelector('.hero-bg');
const hero = document.querySelector('.hero');
if (heroBg && hero) {
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        // small translate for parallax
        const tx = -relX * 6; // px
        const ty = -relY * 3;
        heroBg.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.08)`;
    });
    hero.addEventListener('mouseleave', () => {
        heroBg.style.transform = 'translate3d(0,0,0) scale(1.06)';
    });
}

// Fade-in on load for elements already in view
window.addEventListener('load', () => {
    reveals.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
            el.classList.add('visible');
        }
    });
    // trigger initial active nav update
    updateActiveNav();
});
// (dark mode toggle removed)
// Mobile menu toggle
const mobileToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
        const open = mobileMenu.style.display === 'block';
        mobileMenu.style.display = open ? 'none' : 'block';
        mobileMenu.setAttribute('aria-hidden', open ? 'true' : 'false');
        mobileToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    // close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            mobileMenu.style.display = 'none';
            mobileMenu.setAttribute('aria-hidden', 'true');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Active nav highlighting based on scroll position
const sections = document.querySelectorAll('section[id]');
function updateActiveNav() {
    const scrollPos = window.scrollY + 90; // offset to match header height
    sections.forEach(sec => {
        const top = sec.offsetTop;
        const h = sec.offsetHeight;
        const id = sec.getAttribute('id');
        const link = document.querySelector('.nav-links a[href="#' + id + '"]');
        if (scrollPos >= top && scrollPos < top + h) {
            if (link) link.classList.add('active');
        } else {
            if (link) link.classList.remove('active');
        }
    });
}
window.addEventListener('scroll', throttle(updateActiveNav, 100));

// Throttle helper
function throttle(fn, wait) {
    let last = 0;
    return function(...args) {
        const now = Date.now();
        if (now - last >= wait) {
            last = now;
            fn.apply(this, args);
        }
    };
}

// Interactive glow toggles (no follow cursor)
const hoverables = document.querySelectorAll('a, button, .cta-btn, .btn, .nav-links a');
hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => el.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => el.classList.remove('is-hover'));
});

// Contact form (no backend, just prevent default)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
}
 
