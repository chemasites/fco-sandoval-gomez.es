// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    mainNav.classList.toggle('active');
    this.classList.toggle('active');
    const expanded = mainNav.classList.contains('active');
    this.setAttribute('aria-expanded', expanded);
    document.body.style.overflow = expanded ? 'hidden' : '';
});

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    if (mainNav.classList.contains('active') &&
        !mainNav.contains(e.target) &&
        !menuToggle.contains(e.target)) {
        mainNav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

// Native dialogs provide focus containment and keep the background inert.
const dialogTriggers = new WeakMap();
function showDialog(dialog, trigger = document.activeElement) {
    if (dialog.open) return;
    dialogTriggers.set(dialog, trigger);
    dialog.showModal();
    dialog.classList.add('active');
    document.body.style.overflow = 'hidden';
    dialog.querySelector('button')?.focus();
}

for (const dialog of document.querySelectorAll('dialog')) {
    dialog.addEventListener('close', () => {
        dialog.classList.remove('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        dialogTriggers.get(dialog)?.focus();
    });
}

let currentIndex = 0;
let articleImages = [];
function initArticleLightbox() {
    const article = document.querySelector('.article-page');
    if (!article) return;
    articleImages = Array.from(article.querySelectorAll('img')).filter(img => !img.closest('.article-hero, a'));
    const label = { es: 'Ampliar imagen', en: 'Enlarge image', it: 'Ingrandisci immagine' }[document.documentElement.lang] || 'Ampliar imagen';
    articleImages.forEach((img, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'image-trigger';
        button.setAttribute('aria-label', img.alt ? `${label}: ${img.alt}` : `${label} ${index + 1}`);
        button.setAttribute('aria-haspopup', 'dialog');
        img.before(button);
        button.append(img);
        button.addEventListener('click', () => openLightbox(index, button));
    });
}

function openLightbox(index, trigger) {
    if (!Number.isInteger(index) || !articleImages[index]) return;
    currentIndex = index;
    updateLightboxImage();
    showDialog(document.getElementById('lightbox'), trigger);
}

function closeLightbox(event) {
    if (!event || event.target.classList.contains('lightbox') || event.target.closest('.lightbox-close')) {
        document.getElementById('lightbox').close();
    }
}

function navigateLightbox(event, direction) {
    event.stopPropagation();
    event.preventDefault();
    currentIndex = (currentIndex + direction + articleImages.length) % articleImages.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const img = articleImages[currentIndex];
    const enlarged = document.getElementById('lightbox-img');
    enlarged.src = img.dataset.fullSrc || img.currentSrc || img.src;
    enlarged.alt = img.alt;
    document.getElementById('lightbox-caption').textContent = img.closest('figure')?.querySelector('figcaption')?.textContent || img.alt;
    document.getElementById('lightbox-counter').textContent = `${currentIndex + 1} / ${articleImages.length}`;
}
initArticleLightbox();
document.getElementById('lightbox').addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') navigateLightbox(e, -1);
    if (e.key === 'ArrowRight') navigateLightbox(e, 1);
});

// Theme toggle functions
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('theme-dark');
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch { /* Theme still works without storage. */ }
}

// Initialize theme toggle button
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// External links: open in new tab with icon
// Permalinks are absolute, so a local preview must still treat the site's own domain as internal.
const siteHostname = new URL(document.querySelector('link[rel="canonical"]')?.href || window.location.href).hostname;
document.querySelectorAll('a[href^="http"]').forEach(function(link) {
    // Skip pagination and other internal navigation
    if (link.closest('.pagination')) return;

    if (link.hostname !== window.location.hostname && link.hostname !== siteHostname) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        // Don't add icon to elements that already have one (SVG inside or special card classes)
        var hasIcon = link.querySelector('svg') ||
            link.classList.contains('link-card') ||
            link.classList.contains('contact-card') ||
            link.closest('.link-card') ||
            link.closest('.contact-card');
        if (!hasIcon) {
            link.classList.add('external-link');
        }
    }
});

// Optimize images in article content (markdown images)
document.querySelectorAll('.prose img').forEach(function(img) {
    if (!img.hasAttribute('loading')) img.loading = 'lazy';
    if (!img.hasAttribute('decoding')) img.decoding = 'async';
});

// Image skeleton loading: handle cached images and dynamically loaded content
function initImageSkeletons() {
    document.querySelectorAll('.img-skeleton').forEach(function(skeleton) {
        const img = skeleton.querySelector('img');
        if (img) {
            // If image is already loaded (cached), mark as loaded immediately
            if (img.complete && img.naturalHeight !== 0) {
                skeleton.classList.add('loaded');
            } else {
                // Add onload handler
                img.addEventListener('load', () => skeleton.classList.add('loaded'));
                img.addEventListener('error', () => skeleton.classList.add('loaded'));
                if (img.complete) skeleton.classList.add('loaded');
            }
        }
    });
}

// Run on DOM ready
initImageSkeletons();

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        menuToggle.focus();
    }
});
