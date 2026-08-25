// Multi-Language Translation System
// Manual translations: EN, DE, ES, FR, UR
// Google Translate fallback for other languages

document.addEventListener('DOMContentLoaded', async () => {
    // Check localStorage first
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
        setLanguage(savedLang);
        return;
    }

    // IP Detection for auto-language
    if (window.location.protocol === 'file:') {
        setLanguage('en'); // Default to EN for local
        return;
    }

    try {
        const response = await fetch('https://get.geojs.io/v1/ip/country.json');
        const data = await response.json();
        const country = data.country;

        // Map countries to languages
        const countryLangMap = {
            'DE': 'de', 'AT': 'de', 'CH': 'de', // German
            'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', // Spanish
            'FR': 'fr', 'BE': 'fr', 'CA': 'fr', // French
            'PK': 'ur', 'IN': 'ur' // Urdu
        };

        const detectedLang = countryLangMap[country] || 'en';
        setLanguage(detectedLang);
        localStorage.setItem('language', detectedLang);
    } catch (error) {
        setLanguage('en'); // Silent fallback
    }
});

const translations = {
    en: {
        // Navigation
        'nav-work': 'WORK',
        'nav-about': 'ABOUT',
        'nav-contact': 'CONTACT',

        // Hero Section
        'hero-role': 'Senior PHP/Laravel Developer & <br><span class="font-semibold text-black dark:text-white">UI/UX Architect.</span>',
        'hero-desc': 'Building scalable, high-performance web applications',
        'btn-initiate': 'Initiate Project <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>',
        'cv-download': 'Download CV <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">download</span>',

        // System Status
        'system-status-text': 'System Status: Optimal',

        // About Section
        'about-heading': 'SENIOR PHP DEVELOPER',
        'about-text-1': "I'm a professional PHP web developer specializing in Laravel, custom web applications, and database-driven solutions. With over 5 years of experience, I don't just write code; I solve real business problems.",

        // Expertise
        'expertise-heading': 'CORE EXPERTISE',
        'expertise-architect': 'ARCHITECT',
        'expertise-architect-desc': 'Database design & system planning.',
        'expertise-develop': 'DEVELOP',
        'expertise-develop-desc': 'Robust PHP/Laravel backends.',
        'expertise-refine': 'REFINE',
        'expertise-refine-desc': 'Polished interactions & visual design.',

        // Reviews
        'reviews-upwork-heading': 'Upwork Reviews',
        'reviews-upwork-verify': 'Verify Source',
        'reviews-fiverr-heading': 'FIVERR REVIEWS',
        'fiverr-load-more': '<span class="relative z-10 font-manrope font-bold text-sm tracking-[0.2em] uppercase">Show Next Batch</span>',

        // Footer
        'footer-terminate': '06 // TERMINATE SESSION',
        'footer-avail': 'Available for freelance opportunities and long-term contracts.',
        'footer-copyright': '© 2026 Adnan Portfolio. All Rights Reserved.'
    },

    de: {
        // Navigation
        'nav-work': 'PROJEKTE',
        'nav-about': 'ÜBER MICH',
        'nav-contact': 'KONTAKT',

        // Hero Section
        'hero-role': 'Senior PHP/Laravel Entwickler & <br><span class="font-semibold text-black dark:text-white">UI/UX Architekt.</span>',
        'hero-desc': 'Entwicklung skalierbarer, leistungsstarker Webanwendungen',
        'btn-initiate': 'Projekt Starten <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>',
        'cv-download': 'Lebenslauf Herunterladen <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">download</span>',

        // System Status
        'system-status-text': 'Systemstatus: Optimal',

        // About Section
        'about-heading': 'SENIOR PHP ENTWICKLER',
        'about-text-1': 'Ich bin ein professioneller PHP-Webentwickler, spezialisiert auf Laravel, maßgeschneiderte Webanwendungen und datenbankgestützte Lösungen. Mit über 5 Jahren Erfahrung schreibe ich nicht nur Code; ich löse echte Geschäftsprobleme.',

        // Expertise
        'expertise-heading': 'KERNKOMPETENZEN',
        'expertise-architect': 'ARCHITEKT',
        'expertise-architect-desc': 'Datenbankdesign & Systemplanung.',
        'expertise-develop': 'ENTWICKELN',
        'expertise-develop-desc': 'Robuste PHP/Laravel Backends.',
        'expertise-refine': 'VERFEINERN',
        'expertise-refine-desc': 'Optimierte Interaktionen & visuelles Design.',

        // Reviews
        'reviews-upwork-heading': 'Upwork Bewertungen',
        'reviews-upwork-verify': 'Quelle Überprüfen',
        'reviews-fiverr-heading': 'FIVERR BEWERTUNGEN',
        'fiverr-load-more': '<span class="relative z-10 font-manrope font-bold text-sm tracking-[0.2em] uppercase">Nächste Laden</span>',

        // Footer
        'footer-terminate': '06 // SITZUNG BEENDEN',
        'footer-avail': 'Verfügbar für Freelance-Projekte und langfristige Verträge.',
        'footer-copyright': '© 2026 Adnan Portfolio. Alle Rechte vorbehalten.'
    },

    es: {
        // Navigation
        'nav-work': 'TRABAJOS',
        'nav-about': 'SOBRE MÍ',
        'nav-contact': 'CONTACTO',

        // Hero Section
        'hero-role': 'Desarrollador Senior PHP/Laravel y <br><span class="font-semibold text-black dark:text-white">Arquitecto UI/UX.</span>',
        'hero-desc': 'Desarrollo de aplicaciones web escalables y de alto rendimiento',
        'btn-initiate': 'Iniciar Proyecto <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>',
        'cv-download': 'Descargar CV <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">download</span>',

        // System Status
        'system-status-text': 'Estado del Sistema: Óptimo',

        // About Section
        'about-heading': 'DESARROLLADOR PHP SENIOR',
        'about-text-1': 'Soy un desarrollador web PHP profesional especializado en Laravel, aplicaciones web personalizadas y soluciones orientadas a bases de datos. Con más de 5 años de experiencia, no solo escribo código; resuelvo problemas empresariales reales.',

        // Expertise
        'expertise-heading': 'EXPERIENCIA PRINCIPAL',
        'expertise-architect': 'ARQUITECTO',
        'expertise-architect-desc': 'Diseño de bases de datos y planificación de sistemas.',
        'expertise-develop': 'DESARROLLAR',
        'expertise-develop-desc': 'Backends robustos en PHP/Laravel.',
        'expertise-refine': 'REFINAR',
        'expertise-refine-desc': 'Interacciones pulidas y diseño visual.',

        // Reviews
        'reviews-upwork-heading': 'Reseñas de Upwork',
        'reviews-upwork-verify': 'Verificar Fuente',
        'reviews-fiverr-heading': 'RESEÑAS DE FIVERR',
        'fiverr-load-more': '<span class="relative z-10 font-manrope font-bold text-sm tracking-[0.2em] uppercase">Mostrar Siguiente Lote</span>',

        // Footer
        'footer-terminate': '06 // TERMINAR SESIÓN',
        'footer-avail': 'Disponible para oportunidades freelance y contratos a largo plazo.',
        'footer-copyright': '© 2026 Adnan Portfolio. Todos los derechos reservados.'
    },

    fr: {
        // Navigation
        'nav-work': 'TRAVAUX',
        'nav-about': 'À PROPOS',
        'nav-contact': 'CONTACT',

        // Hero Section
        'hero-role': 'Développeur Senior PHP/Laravel et <br><span class="font-semibold text-black dark:text-white">Architecte UI/UX.</span>',
        'hero-desc': 'Création d\'applications web évolutives et performantes',
        'btn-initiate': 'Démarrer un Projet <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>',
        'cv-download': 'Télécharger le CV <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">download</span>',

        // System Status
        'system-status-text': 'État du Système: Optimal',

        // About Section
        'about-heading': 'DÉVELOPPEUR PHP SENIOR',
        'about-text-1': 'Je suis un développeur web PHP professionnel spécialisé dans Laravel, les applications web personnalisées et les solutions basées sur des bases de données. Avec plus de 5 ans d\'expérience, je ne me contente pas d\'écrire du code; je résous de vrais problèmes commerciaux.',

        // Expertise
        'expertise-heading': 'EXPERTISE PRINCIPALE',
        'expertise-architect': 'ARCHITECTE',
        'expertise-architect-desc': 'Conception de bases de données et planification de systèmes.',
        'expertise-develop': 'DÉVELOPPER',
        'expertise-develop-desc': 'Backends robustes en PHP/Laravel.',
        'expertise-refine': 'AFFINER',
        'expertise-refine-desc': 'Interactions raffinées et design visuel.',

        // Reviews
        'reviews-upwork-heading': 'Avis Upwork',
        'reviews-upwork-verify': 'Vérifier la Source',
        'reviews-fiverr-heading': 'AVIS FIVERR',
        'fiverr-load-more': '<span class="relative z-10 font-manrope font-bold text-sm tracking-[0.2em] uppercase">Afficher le Lot Suivant</span>',

        // Footer
        'footer-terminate': '06 // TERMINER LA SESSION',
        'footer-avail': 'Disponible pour des opportunités freelance et des contrats à long terme.',
        'footer-copyright': '© 2026 Adnan Portfolio. Tous droits réservés.'
    },

    ur: {
        // Navigation
        'nav-work': 'کام',
        'nav-about': 'میرے بارے میں',
        'nav-contact': 'رابطہ',

        // Hero Section
        'hero-role': 'سینئر PHP/Laravel ڈویلپر اور <br><span class="font-semibold text-black dark:text-white">UI/UX آرکیٹیکٹ۔</span>',
        'hero-desc': 'اسکیل ایبل، ہائی پرفارمنس ویب ایپلیکیشنز بنانا',
        'btn-initiate': 'پراجیکٹ شروع کریں <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>',
        'cv-download': 'سی وی ڈاؤن لوڈ کریں <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">download</span>',

        // System Status
        'system-status-text': 'سسٹم کی حیثیت: بہترین',

        // About Section
        'about-heading': 'سینئر PHP ڈویلپر',
        'about-text-1': 'میں ایک پروفیشنل PHP ویب ڈویلپر ہوں جو Laravel، کسٹم ویب ایپلیکیشنز، اور ڈیٹا بیس پر مبنی حل میں مہارت رکھتا ہوں۔ 5 سال سے زیادہ کے تجربے کے ساتھ، میں صرف کوڈ نہیں لکھتا؛ میں حقیقی کاروباری مسائل حل کرتا ہوں۔',

        // Expertise
        'expertise-heading': 'بنیادی مہارت',
        'expertise-architect': 'آرکیٹیکٹ',
        'expertise-architect-desc': 'ڈیٹا بیس ڈیزائن اور سسٹم پلاننگ۔',
        'expertise-develop': 'ڈویلپ',
        'expertise-develop-desc': 'مضبوط PHP/Laravel بیک اینڈز۔',
        'expertise-refine': 'بہتر بنائیں',
        'expertise-refine-desc': 'پالش شدہ تعاملات اور بصری ڈیزائن۔',

        // Reviews
        'reviews-upwork-heading': 'Upwork جائزے',
        'reviews-upwork-verify': 'ذریعہ تصدیق کریں',
        'reviews-fiverr-heading': 'FIVERR جائزے',
        'fiverr-load-more': '<span class="relative z-10 font-manrope font-bold text-sm tracking-[0.2em] uppercase">اگلا بیچ دکھائیں</span>',

        // Footer
        'footer-terminate': '06 // سیشن ختم کریں',
        'footer-avail': 'فری لانس مواقع اور طویل مدتی معاہدوں کے لیے دستیاب۔',
        'footer-copyright': '© 2026 ادنان پورٹ فولیو۔ تمام حقوق محفوظ ہیں۔'
    }
};

function setLanguage(lang) {
    if (!translations[lang]) {
        // If language not supported, show Google Translate
        showGoogleTranslate();
        return;
    }

    hideGoogleTranslate();
    const t = translations[lang];

    // Helper to safely set HTML or Text
    const setContent = (id, content) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = content;
    };

    Object.keys(t).forEach(id => {
        setContent(id, t[id]);
    });

    // Update language selector dropdown
    updateLanguageSelector(lang);
}

function updateLanguageSelector(lang) {
    const langLabels = {
        'en': '🇬🇧 EN',
        'de': '🇩🇪 DE',
        'es': '🇪🇸 ES',
        'fr': '🇫🇷 FR',
        'ur': '🇵🇰 UR'
    };

    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
        // Only update text content, preserve dropdown arrow
        const currentLabel = langLabels[lang] || lang.toUpperCase();
        const arrow = '<span class="text-[8px]">▼</span>';
        btn.innerHTML = `${currentLabel} ${arrow}`;
    });
}

function showGoogleTranslate() {
    const widget = document.getElementById('google_translate_element');
    if (widget) widget.style.display = 'block';
}

function hideGoogleTranslate() {
    const widget = document.getElementById('google_translate_element');
    if (widget) widget.style.display = 'none';
}

// Language switcher function
window.switchLanguage = function (lang) {
    localStorage.setItem('language', lang);
    setLanguage(lang);
};

// Legacy toggle for compatibility
window.toggleLanguage = function () {
    const current = localStorage.getItem('language') || 'en';
    const next = current === 'en' ? 'de' : 'en';
    switchLanguage(next);
};
