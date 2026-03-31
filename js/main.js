/* ================================================
   MAIN.JS - 유태이 배우 포트폴리오
   GSAP Animations, ScrollTrigger, Navigation
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check if GSAP loaded (may fail on file:// protocol)
    const gsapLoaded = typeof gsap !== 'undefined';

    if (gsapLoaded) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ---- Navigation ---- //
    initNavigation();

    // ---- Mobile Menu ---- //
    initMobileMenu();

    // ---- Filmography Tabs (mobile) ---- //
    initFilmographyTabs();

    // ---- Mobile CTA ---- //
    initMobileCta();

    // ---- Sticky Contact Bar ---- //
    initStickyContact();

    // ---- Smooth Scroll ---- //
    initSmoothScroll();

    // ---- Back to Top ---- //
    initBackToTop();

    // ---- Custom Cursor ---- //
    initCustomCursor();

    // ---- Loading Screen ---- //
    initLoader();

    // ---- GSAP Animations ---- //
    if (gsapLoaded && !prefersReducedMotion) {
        initHeroAnimation();
        initScrollAnimations();
    } else {
        // Show everything immediately (GSAP not loaded or reduced motion)
        showAllElements();
    }
});

function showAllElements() {
    document.querySelectorAll('.anim-fade, .anim-slide, .anim-wipe, .anim-clip-reveal, .hero__name-line, .hero__photo').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.clipPath = 'none';
    });
    document.querySelectorAll('.anim-curtain').forEach(el => {
        el.style.setProperty('--curtain', '0%');
        el.style.setProperty('--curtain-out', '100%');
    });
    document.querySelectorAll('.anim-divider').forEach(el => {
        el.style.setProperty('--divider-width', '100%');
    });
    // Set stat numbers to their target values
    document.querySelectorAll('.hero__stat-number').forEach(el => {
        el.textContent = el.getAttribute('data-count');
    });
    // Make nav visible
    const nav = document.getElementById('nav');
    if (nav) {
        nav.style.opacity = '1';
        nav.style.animation = 'none';
    }
}


/* ================================================
   NAVIGATION
   ================================================ */
function initNavigation() {
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 80) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}


/* ================================================
   MOBILE MENU
   ================================================ */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('nav__hamburger--active');
        mobileMenu.classList.toggle('mobile-menu--active');
        document.body.style.overflow = mobileMenu.classList.contains('mobile-menu--active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('nav__hamburger--active');
            mobileMenu.classList.remove('mobile-menu--active');
            document.body.style.overflow = '';
        });
    });
}


/* ================================================
   FILMOGRAPHY TABS (MOBILE)
   ================================================ */
function initFilmographyTabs() {
    const tabs = document.querySelectorAll('.filmography__tab');
    const columns = document.querySelectorAll('.filmography__column');

    // Set initial state
    setActiveTab('film');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.tab;
            setActiveTab(category);
        });
    });

    function setActiveTab(category) {
        tabs.forEach(t => t.classList.remove('filmography__tab--active'));
        columns.forEach(c => c.classList.remove('filmography__column--active'));

        const activeTab = document.querySelector(`[data-tab="${category}"]`);
        const activeColumn = document.querySelector(`[data-category="${category}"]`);

        if (activeTab) activeTab.classList.add('filmography__tab--active');
        if (activeColumn) activeColumn.classList.add('filmography__column--active');
    }
}


/* ================================================
   MOBILE CTA
   ================================================ */
function initMobileCta() {
    const mobileCta = document.getElementById('mobileCta');
    if (!mobileCta) return;

    const heroSection = document.getElementById('hero');

    window.addEventListener('scroll', () => {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        if (window.scrollY > heroBottom - 200) {
            mobileCta.classList.add('mobile-cta--visible');
        } else {
            mobileCta.classList.remove('mobile-cta--visible');
        }
    }, { passive: true });
}


/* ================================================
   STICKY CONTACT BAR
   ================================================ */
function initStickyContact() {
    const stickyContact = document.getElementById('stickyContact');
    if (!stickyContact) return;

    const contactSection = document.getElementById('contact');
    if (!contactSection) return;

    window.addEventListener('scroll', () => {
        const contactTop = contactSection.getBoundingClientRect().top;
        if (contactTop <= window.innerHeight) {
            stickyContact.style.transform = 'translateY(100%)';
        } else {
            stickyContact.style.transform = 'translateY(0)';
        }
    }, { passive: true });
}


/* ================================================
   SMOOTH SCROLL
   ================================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            const navHeight = document.getElementById('nav').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}


/* ================================================
   HERO ANIMATION (GSAP Timeline)
   ================================================ */
function initHeroAnimation() {
    const tl = gsap.timeline({ delay: 0.3 });

    // 1. Photo fade in + scale
    tl.fromTo('.hero__photo', { opacity: 0, scale: 1.05 }, {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power3.out'
    });

    // 2. Label
    tl.to('.hero__label', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.8');

    // 3. Name lines stagger
    tl.to('.hero__name-line', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out'
    }, '-=0.5');

    // 4. Subtitle
    tl.to('.hero__subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.3');

    // 5. CTA buttons
    tl.to('.hero__cta', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.2');

    // 6. Stats stagger
    tl.to('.hero__stat', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out'
    }, '-=0.4');

    // 7. (sticky contact bar is separate, no hero animation needed)

    // Counter animation for stats
    document.querySelectorAll('.hero__stat-number').forEach(el => {
        const target = parseInt(el.getAttribute('data-count'));
        gsap.to(el, {
            textContent: target,
            duration: 2,
            delay: 1.5,
            ease: 'power1.out',
            snap: { textContent: 1 },
            onUpdate: function() {
                el.textContent = Math.round(parseFloat(el.textContent));
            }
        });
    });
}


/* ================================================
   SCROLL ANIMATIONS (ScrollTrigger)
   ================================================ */
function initScrollAnimations() {
    // Use matchMedia for mobile-specific behavior
    ScrollTrigger.matchMedia({
        // Desktop & Tablet
        '(min-width: 769px)': function () {
            setupScrollAnimations(true);
        },
        // Mobile
        '(max-width: 768px)': function () {
            setupScrollAnimations(false);
        }
    });
}

function setupScrollAnimations(isDesktop) {
    const triggerConfig = {
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: 'play none none none'
    };

    // Section labels - slide in from left
    gsap.utils.toArray('.section-label').forEach(el => {
        gsap.to(el, {
            scrollTrigger: { trigger: el, ...triggerConfig },
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // Fade up elements (standard)
    gsap.utils.toArray('.about__text, .about__details, .about__skills, .about__image-wrapper, .filmography__category-title, .gallery__item, .contact__info, .contact__buttons, .contact__image-wrapper').forEach(el => {
        gsap.to(el, {
            scrollTrigger: { trigger: el, ...triggerConfig },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // ---- TEXT CLIP REVEAL ---- //
    gsap.utils.toArray('.anim-clip-reveal').forEach(el => {
        gsap.to(el, {
            scrollTrigger: { trigger: el, ...triggerConfig },
            clipPath: 'inset(0% 0 0 0)',
            duration: 1,
            ease: 'power3.out'
        });
    });

    // ---- IMAGE CURTAIN REVEAL ---- //
    gsap.utils.toArray('.anim-curtain').forEach(el => {
        const overlay = el.querySelector(':before') || el;
        const tl = gsap.timeline({
            scrollTrigger: { trigger: el, ...triggerConfig }
        });
        // Phase 1: Curtain slides in covering image (right to left reveal)
        tl.fromTo(el, { '--curtain': '100%' }, {
            '--curtain': '0%',
            duration: 0.6,
            ease: 'power2.in'
        });
        // Phase 2: Curtain slides out revealing image
        tl.to(el, {
            '--curtain-out': '100%',
            duration: 0.6,
            ease: 'power2.out'
        });
    });

    // ---- DIVIDER EXPAND ---- //
    gsap.utils.toArray('.anim-divider').forEach(el => {
        gsap.fromTo(el,
            { '--divider-width': '0%' },
            {
                scrollTrigger: { trigger: el, ...triggerConfig },
                '--divider-width': '100%',
                duration: 1.2,
                ease: 'power2.out'
            }
        );
    });

    // Featured cards - stagger
    gsap.utils.toArray('.featured__card').forEach((card, i) => {
        gsap.to(card, {
            scrollTrigger: { trigger: card, ...triggerConfig },
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power2.out'
        });
    });

    // Filmography items - wipe stagger
    gsap.utils.toArray('.filmography__column').forEach(column => {
        const items = column.querySelectorAll('.filmography__item');
        gsap.to(items, {
            scrollTrigger: { trigger: column, ...triggerConfig },
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out'
        });
    });

    // About image parallax (desktop only)
    if (isDesktop) {
        const aboutImg = document.querySelector('.about__image img');
        if (aboutImg) {
            gsap.to(aboutImg, {
                scrollTrigger: {
                    trigger: '.about',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: -40,
                ease: 'none'
            });
        }
    }
}


/* ================================================
   LIGHTBOX (Gallery)
   ================================================ */
let currentLightboxIndex = 0;
let galleryImages = [];

function openLightbox(item) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const img = item.querySelector('img');

    galleryImages = Array.from(document.querySelectorAll('.gallery__item img'));
    currentLightboxIndex = galleryImages.indexOf(img);

    lightboxImg.src = img.src;
    lightbox.classList.add('lightbox--active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
    if (event.target.classList.contains('lightbox') || event.target.classList.contains('lightbox__close')) {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('lightbox--active');
        document.body.style.overflow = '';
    }
}

function changeLightbox(direction) {
    event.stopPropagation();
    currentLightboxIndex += direction;
    if (currentLightboxIndex < 0) currentLightboxIndex = galleryImages.length - 1;
    if (currentLightboxIndex >= galleryImages.length) currentLightboxIndex = 0;

    const lightboxImg = document.getElementById('lightboxImg');
    lightboxImg.style.animation = 'none';
    lightboxImg.offsetHeight;
    lightboxImg.style.animation = 'lightboxZoom 0.3s ease';
    lightboxImg.src = galleryImages[currentLightboxIndex].src;
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox.classList.contains('lightbox--active')) return;

    if (e.key === 'Escape') {
        lightbox.classList.remove('lightbox--active');
        document.body.style.overflow = '';
    } else if (e.key === 'ArrowLeft') {
        changeLightbox(-1);
    } else if (e.key === 'ArrowRight') {
        changeLightbox(1);
    }

    // Video lightbox
    const videoLightbox = document.getElementById('videoLightbox');
    if (videoLightbox && videoLightbox.classList.contains('lightbox--active') && e.key === 'Escape') {
        closeVideoLightbox(e);
    }
});


/* ================================================
   VIDEO LIGHTBOX
   ================================================ */
function openVideoLightbox(src) {
    const lightbox = document.getElementById('videoLightbox');
    const video = document.getElementById('lightboxVideo');
    video.querySelector('source').src = src;
    video.load();
    lightbox.classList.add('lightbox--active');
    document.body.style.overflow = 'hidden';
    video.play();
}

function closeVideoLightbox(event) {
    if (event.target.classList.contains('lightbox') || event.target.classList.contains('lightbox__close')) {
        const lightbox = document.getElementById('videoLightbox');
        const video = document.getElementById('lightboxVideo');
        video.pause();
        video.currentTime = 0;
        lightbox.classList.remove('lightbox--active');
        document.body.style.overflow = '';
    }
}


/* ================================================
   PHONE NUMBER LOCK
   ================================================ */
const _p = [48,49,48,45,57,56,51,51,45,49,50,54,56];
const _k = [51,49,48,56].map(c => String.fromCharCode(c)).join('');

function _d() {
    return _p.map(c => String.fromCharCode(c)).join('');
}

function unlockPhone(el) {
    if (sessionStorage.getItem('phoneUnlocked') === 'true') {
        revealAllPhones();
        return;
    }

    const pwd = prompt('비밀번호를 입력하세요');
    if (pwd === null) return;

    if (pwd === _k) {
        sessionStorage.setItem('phoneUnlocked', 'true');
        revealAllPhones();
    } else {
        alert('비밀번호가 틀렸습니다.');
    }
}

function revealAllPhones() {
    const num = _d();
    document.querySelectorAll('.phone-locked').forEach(el => {
        el.classList.remove('phone-locked');
        el.onclick = null;
        const span = el.querySelector('span');
        if (span) {
            span.textContent = num;
        } else {
            el.textContent = num;
        }
        el.href = 'tel:' + num;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('phoneUnlocked') === 'true') {
        revealAllPhones();
    }
});


/* ================================================
   LOADING SCREEN
   ================================================ */
function initLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('page-loader--hidden');
        }, 1800);
    });
}


/* ================================================
   BACK TO TOP
   ================================================ */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            btn.classList.add('back-to-top--visible');
        } else {
            btn.classList.remove('back-to-top--visible');
        }
    }, { passive: true });
}


/* ================================================
   CUSTOM CURSOR (PC only)
   ================================================ */
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    // Only on devices with fine pointer (mouse)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX - 4 + 'px';
        cursor.style.top = mouseY - 4 + 'px';
    });

    // Smooth follower
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        follower.style.left = followerX - 18 + 'px';
        follower.style.top = followerY - 18 + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effect on interactive elements
    document.querySelectorAll('a, button, .featured__card, .gallery__item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor--hover');
            follower.classList.add('cursor-follower--hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor--hover');
            follower.classList.remove('cursor-follower--hover');
        });
    });
}


