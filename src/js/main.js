// main.js - Core functionality (schnorpfeil.com-inspired interactions)
import { initI18n } from './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
    // ===== 0. Multi-Language i18n =====
    initI18n();
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
        lightboxImg.src = galleryImages[index].currentSrc || galleryImages[index].src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        currentLightboxIndex = (currentLightboxIndex + direction + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentLightboxIndex].currentSrc || galleryImages[currentLightboxIndex].src;
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

    // ===== 9. Sticky Mobile CTA =====
    const stickyCta = document.getElementById('sticky-cta');
    const heroSection = document.getElementById('hero');
    const kontaktSection = document.getElementById('kontakt');

    if (stickyCta && heroSection) {
        // Show sticky CTA when hero leaves viewport
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('is-visible');
                    stickyCta.setAttribute('aria-hidden', 'false');
                } else {
                    stickyCta.classList.remove('is-visible');
                    stickyCta.setAttribute('aria-hidden', 'true');
                }
            });
        }, { threshold: 0 });
        heroObserver.observe(heroSection);

        // Hide sticky CTA when contact section is in view
        if (kontaktSection) {
            const kontaktObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        stickyCta.classList.remove('is-visible');
                        stickyCta.setAttribute('aria-hidden', 'true');
                    } else if (!heroSection.getBoundingClientRect().bottom > 0) {
                        stickyCta.classList.add('is-visible');
                        stickyCta.setAttribute('aria-hidden', 'false');
                    }
                });
            }, { threshold: 0.1 });
            kontaktObserver.observe(kontaktSection);
        }
    }

    // ===== 10. Inquiry Form =====
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        const submitBtn = document.getElementById('inquiry-submit');
        const successEl = document.getElementById('inquiry-success');
        const errorBanner = document.getElementById('inquiry-error-banner');
        const checkinInput = document.getElementById('inquiry-checkin');
        const checkoutInput = document.getElementById('inquiry-checkout');

        // Set min date to today for date inputs
        const today = new Date().toISOString().split('T')[0];
        checkinInput.min = today;
        checkoutInput.min = today;

        // When checkin changes, update checkout min to checkin + 3 days
        checkinInput.addEventListener('change', () => {
            if (checkinInput.value) {
                const checkinDate = new Date(checkinInput.value);
                const minCheckout = new Date(checkinDate);
                minCheckout.setDate(minCheckout.getDate() + 3);
                checkoutInput.min = minCheckout.toISOString().split('T')[0];
                // If current checkout is before new min, clear it
                if (checkoutInput.value && checkoutInput.value < checkoutInput.min) {
                    checkoutInput.value = '';
                }
            }
        });

        /**
         * Validate form fields, returns true if valid
         */
        function validateInquiryForm() {
            let isValid = true;

            // Clear previous errors
            inquiryForm.querySelectorAll('.inquiry-field.has-error, .inquiry-privacy.has-error').forEach(el => {
                el.classList.remove('has-error');
            });
            errorBanner.classList.remove('is-visible');

            // Required text/email fields
            const requiredFields = inquiryForm.querySelectorAll('input[required]:not([type="checkbox"]), select[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.closest('.inquiry-field').classList.add('has-error');
                    isValid = false;
                }
            });

            // Email format
            const emailInput = document.getElementById('inquiry-email');
            if (emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                emailInput.closest('.inquiry-field').classList.add('has-error');
                isValid = false;
            }

            // Date validation: checkout must be at least 3 nights after checkin
            if (checkinInput.value && checkoutInput.value) {
                const checkin = new Date(checkinInput.value);
                const checkout = new Date(checkoutInput.value);
                const diffDays = (checkout - checkin) / (1000 * 60 * 60 * 24);
                if (diffDays < 3) {
                    checkoutInput.closest('.inquiry-field').classList.add('has-error');
                    isValid = false;
                }
            }

            // Privacy checkbox
            const privacyCheckbox = document.getElementById('inquiry-privacy');
            if (!privacyCheckbox.checked) {
                privacyCheckbox.closest('.inquiry-privacy').classList.add('has-error');
                isValid = false;
            }

            return isValid;
        }

        // Handle form submission
        inquiryForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!validateInquiryForm()) {
                // Scroll to first error
                const firstError = inquiryForm.querySelector('.has-error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            // Show loading state
            submitBtn.classList.add('is-loading');
            submitBtn.disabled = true;
            errorBanner.classList.remove('is-visible');

            try {
                // Reformat dates from YYYY-MM-DD to DD.MM.YYYY for the email
                const formatDate = (isoDate) => {
                    const [y, m, d] = isoDate.split('-');
                    return `${d}.${m}.${y}`;
                };

                // Set reply-to to guest's email
                const replyToField = document.getElementById('inquiry-replyto');
                replyToField.value = document.getElementById('inquiry-email').value;

                const formData = new FormData(inquiryForm);

                // Override date values in FormData (don't mutate input values — breaks retry)
                if (checkinInput.value) formData.set('Anreise', formatDate(checkinInput.value));
                if (checkoutInput.value) formData.set('Abreise', formatDate(checkoutInput.value));

                const response = await fetch(inquiryForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // Success: hide form, show success message
                    inquiryForm.style.display = 'none';
                    successEl.classList.add('is-visible');
                } else {
                    throw new Error('Form submission failed');
                }
            } catch {
                // Show error banner
                errorBanner.classList.add('is-visible');
                submitBtn.classList.remove('is-loading');
                submitBtn.disabled = false;
            }
        });
    }
});
