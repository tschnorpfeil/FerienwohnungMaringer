// main.js - Core functionality (schnorpfeil.com-inspired interactions)

document.addEventListener('DOMContentLoaded', () => {
    // ===== 1. Footer Year =====
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ===== 2. Header Scroll Transition =====
    const mainNav = document.getElementById('main-nav');
    let mobileMenuOpen = false;

    function updateHeader() {
        if (window.scrollY > 30 || mobileMenuOpen) {
            mainNav.classList.add('is-scrolled');
        } else {
            mainNav.classList.remove('is-scrolled');
        }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    // Trigger once on load in case page starts scrolled
    updateHeader();

    // ===== 3. Mobile Menu Toggle =====
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuOpen = !mobileMenuOpen;
            mobileMenuBtn.classList.toggle('active', mobileMenuOpen);
            mobileMenu.classList.toggle('active', mobileMenuOpen);
            document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';

            // Force scrolled header state when menu is open (so text is readable)
            updateHeader();
        });

        // Close menu when clicking nav links
        document.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenuOpen) {
                    mobileMenuOpen = false;
                    mobileMenuBtn.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                    updateHeader();
                }
            });
        });
    }

    // ===== 4. Scroll Reveal System (js-reveal → js-revealed) =====
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('js-revealed');
                // Clean up after animation completes (500ms transition + delay)
                const delay = parseFloat(entry.target.style.transitionDelay) || 0;
                setTimeout(() => {
                    entry.target.style.transitionDelay = '';
                }, (delay + 600));
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.js-reveal').forEach(el => revealObserver.observe(el));

    // ===== 5. FAQ Accordion =====
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const button = item.querySelector('.faq-question');
        if (!button) return;
        button.addEventListener('click', () => {
            // Close others
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });

    // ===== 6. Lightbox with Navigation =====
    const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    let currentLightboxIndex = 0;

    function openLightbox(index) {
        currentLightboxIndex = index;
        lightboxImg.src = galleryImages[index].src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        currentLightboxIndex = (currentLightboxIndex + direction + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentLightboxIndex].src;
    }

    if (galleryImages.length > 0 && lightbox) {
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
        lightboxNext.addEventListener('click', () => navigateLightbox(1));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });
    }

    // ===== 7. Scroll Down Indicator =====
    const scrollBtn = document.getElementById('hero-scroll-btn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            const factsSection = document.getElementById('facts');
            if (factsSection) {
                const targetY = factsSection.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: targetY, behavior: 'smooth' });
            }
        });
    }

    // ===== 8. Hero Parallax =====
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    if (parallaxEls.length && window.matchMedia('(min-width: 768px)').matches) {
        // Release animation lock on parallax elements after initial fade
        parallaxEls.forEach(el => {
            if (!el.classList.contains('js-hero-zoom')) {
                el.addEventListener('animationend', () => {
                    el.style.animation = 'none';
                    el.style.opacity = '1';
                }, { once: true });
            }
            el.style.willChange = 'transform';
        });

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const heroH = window.innerHeight;
                    if (scrollY < heroH) {
                        parallaxEls.forEach(el => {
                            if (el.classList.contains('js-hero-zoom')) return;
                            const speed = parseFloat(el.dataset.parallax);
                            const dir = parseFloat(el.dataset.parallaxDir || '1');
                            el.style.transform = `translate3d(0, ${scrollY * speed * dir}px, 0)`;
                        });
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
});
