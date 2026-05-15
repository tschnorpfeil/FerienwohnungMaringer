// i18n.js — Client-side language switcher + auto-detection
// Loads translations from inline JSON (injected at build time or fetched)

import de from '../locales/de.json';
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import nl from '../locales/nl.json';

const TRANSLATIONS = { de, en, fr, nl };
const SUPPORTED_LANGS = ['de', 'en', 'fr', 'nl'];
const STORAGE_KEY = 'fw-maringer-lang';
const LANG_PATHS = {
    de: '/',
    en: '/en/',
    fr: '/fr/',
    nl: '/nl/'
};
const LANG_LABELS = {
    de: { flag: '🇩🇪', label: 'Deutsch', short: 'DE' },
    en: { flag: '🇬🇧', label: 'English', short: 'EN' },
    fr: { flag: '🇫🇷', label: 'Français', short: 'FR' },
    nl: { flag: '🇳🇱', label: 'Nederlands', short: 'NL' }
};

/**
 * Detect the language from the URL.
 * The German root and all German guide pages must stay German for canonical SEO.
 */
function detectLanguage() {
    const pathLang = window.location.pathname.split('/').filter(Boolean)[0];
    if (SUPPORTED_LANGS.includes(pathLang)) return pathLang;
    return 'de';
}

/**
 * Resolve a dot-path key like "hero.h1" against the translation object
 */
function resolve(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
}

/**
 * Apply translations to all elements with data-i18n attributes
 */
function applyTranslations(lang) {
    const t = TRANSLATIONS[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = resolve(t, key);
        if (val !== null) {
            // Check if this is an element that uses innerHTML (for <br> etc.)
            if (el.hasAttribute('data-i18n-html')) {
                el.innerHTML = val;
            } else {
                el.textContent = val;
            }
        }
    });

    // Update special attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const val = resolve(t, key);
        if (val !== null) el.placeholder = val;
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        const val = resolve(t, key);
        if (val !== null) el.setAttribute('aria-label', val);
    });

    // Update <title> and meta tags
    if (t.meta) {
        if (t.meta.title) document.title = t.meta.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && t.meta.description) metaDesc.content = t.meta.description;
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && t.meta.og_title) ogTitle.content = t.meta.og_title;
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc && t.meta.og_description) ogDesc.content = t.meta.og_description;
    }

    // Update <html lang>
    document.documentElement.lang = lang === 'de' ? 'de' : lang;

    // Update WhatsApp link
    if (t.contact && t.contact.whatsapp_prefill) {
        const waLink = document.querySelector('.contact-btn.whatsapp');
        if (waLink) {
            waLink.href = `https://wa.me/4916096035775?text=${t.contact.whatsapp_prefill}`;
        }
    }

    // Update email subject
    if (lang !== 'de') {
        const emailLink = document.querySelector('.contact-btn.email');
        if (emailLink) {
            const subjects = {
                en: 'Booking%20Request%20Holiday%20Apartment%20Cochem',
                fr: 'Demande%20de%20r%C3%A9servation%20Appartement%20Cochem',
                nl: 'Boekingsaanvraag%20Vakantiewoning%20Cochem'
            };
            emailLink.href = `mailto:w.maringer43@web.de?subject=${subjects[lang] || subjects.en}`;
        }
    }
}

/**
 * Set the active language, save to localStorage, and apply
 */
function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) lang = 'de';
    applyTranslations(lang);
    updateSwitcherUI(lang);
}

function navigateToLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) lang = 'de';
    localStorage.setItem(STORAGE_KEY, lang);
    const target = LANG_PATHS[lang] || '/';
    if (window.location.pathname !== target) {
        window.location.href = target;
        return;
    }
    setLanguage(lang);
}

/**
 * Update the visual state of the language switcher
 */
function updateSwitcherUI(lang) {
    const info = LANG_LABELS[lang];

    // Desktop switcher
    const currentBtn = document.getElementById('lang-current');
    if (currentBtn) {
        currentBtn.innerHTML = `${info.flag} <span class="lang-short">${info.short}</span>`;
    }

    // Mark active item
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === lang);
    });

    // Mobile switcher
    document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

/**
 * Build the language switcher UI and insert it into the DOM
 */
function initSwitcher() {
    // === DESKTOP: Dropdown next to CTA ===
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        const switcher = document.createElement('div');
        switcher.className = 'lang-switcher';
        switcher.innerHTML = `
            <button id="lang-current" class="lang-toggle" aria-label="Change language" type="button">
                🇩🇪 <span class="lang-short">DE</span>
            </button>
            <div class="lang-dropdown">
                ${SUPPORTED_LANGS.map(l => `
                    <a class="lang-option" data-lang="${l}" href="${LANG_PATHS[l]}">
                        <span class="lang-option-flag">${LANG_LABELS[l].flag}</span>
                        <span class="lang-option-label">${LANG_LABELS[l].label}</span>
                        <span class="lang-option-short">${LANG_LABELS[l].short}</span>
                    </a>
                `).join('')}
            </div>
        `;
        navLinks.appendChild(switcher);

        // Toggle dropdown
        const toggleBtn = switcher.querySelector('.lang-toggle');
        const dropdown = switcher.querySelector('.lang-dropdown');

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            switcher.classList.toggle('open');
        });

        // Select language
        dropdown.querySelectorAll('.lang-option').forEach(opt => {
            opt.addEventListener('click', (event) => {
                event.preventDefault();
                navigateToLanguage(opt.dataset.lang);
                switcher.classList.remove('open');
            });
        });

        // Close on outside click
        document.addEventListener('click', () => {
            switcher.classList.remove('open');
        });
    }

    // === MOBILE: Language buttons row in burger menu ===
    const mobileNav = document.querySelector('.mobile-menu-nav');
    if (mobileNav) {
        const langRow = document.createElement('div');
        langRow.className = 'mobile-lang-row';
        langRow.innerHTML = SUPPORTED_LANGS.map(l =>
            `<a class="mobile-lang-btn" data-lang="${l}" href="${LANG_PATHS[l]}">
                <span class="mobile-lang-flag">${LANG_LABELS[l].flag}</span>
                <span class="mobile-lang-short">${LANG_LABELS[l].short}</span>
            </a>`
        ).join('');
        mobileNav.appendChild(langRow);

        langRow.querySelectorAll('.mobile-lang-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                event.preventDefault();
                navigateToLanguage(btn.dataset.lang);
            });
        });
    }
}

/**
 * Initialize i18n system
 */
export function initI18n() {
    initSwitcher();
    const lang = detectLanguage();
    setLanguage(lang);
}
