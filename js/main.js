/* =========================================================
   Hemant Verma — Academic Website interactions
   ========================================================= */
(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Theme (light / dark) ---------- */
    const THEME_KEY = 'hv-theme';

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = document.querySelector('#themeToggle i');
        if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    function getStoredTheme() {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Apply as early as possible
    applyTheme(getStoredTheme());

    document.addEventListener('DOMContentLoaded', () => {
        /* ---------- Ensure dynamic elements exist (works on all pages) ---------- */
        const nav = document.querySelector('nav');

        // Theme toggle button
        let themeToggle = document.getElementById('themeToggle');
        if (!themeToggle && nav) {
            themeToggle = document.createElement('button');
            themeToggle.id = 'themeToggle';
            themeToggle.className = 'theme-toggle';
            themeToggle.setAttribute('aria-label', 'Toggle dark mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            const navRight = document.querySelector('.nav-right');
            (navRight || nav).appendChild(themeToggle);
        }
        applyTheme(getStoredTheme());
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                localStorage.setItem(THEME_KEY, next);
                applyTheme(next);
            });
        }

        // Scroll progress bar
        let progress = document.querySelector('.scroll-progress');
        if (!progress) {
            progress = document.createElement('div');
            progress.className = 'scroll-progress';
            document.body.prepend(progress);
        }

        // Back-to-top button
        let backToTop = document.querySelector('.back-to-top');
        if (!backToTop) {
            backToTop = document.createElement('div');
            backToTop.className = 'back-to-top';
            backToTop.innerHTML = '<a href="#home" title="Back to top"><i class="fas fa-arrow-up"></i></a>';
            document.body.appendChild(backToTop);
        }

        /* ---------- Mobile menu ---------- */
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                navLinks.classList.toggle('active');
            });
            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('active');
                }
            });
        }

        /* ---------- Smooth scroll + close menu for in-page links ---------- */
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href.length < 2) return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
                    if (navLinks) navLinks.classList.remove('active');
                }
            });
        });

        /* ---------- Header shadow + progress + back-to-top on scroll ---------- */
        const header = document.querySelector('header');
        function onScroll() {
            const top = window.pageYOffset || document.documentElement.scrollTop;
            if (header) header.classList.toggle('scrolled', top > 10);

            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.width = docHeight > 0 ? (top / docHeight) * 100 + '%' : '0%';

            backToTop.classList.toggle('show', top > 400);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        /* ---------- Reveal on scroll ---------- */
        const revealEls = document.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window && !prefersReducedMotion) {
            const revealObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
            revealEls.forEach((el) => revealObserver.observe(el));
        } else {
            revealEls.forEach((el) => el.classList.add('visible'));
        }

        /* ---------- Scroll-spy: highlight active nav link ---------- */
        const sections = document.querySelectorAll('section[id]');
        const spyLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
        if (sections.length && spyLinks.length && 'IntersectionObserver' in window) {
            const spyObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        spyLinks.forEach((link) => {
                            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                        });
                    }
                });
            }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
            sections.forEach((s) => spyObserver.observe(s));
        }

        /* ---------- Publication filter ---------- */
        const filterBtns = document.querySelectorAll('.filter-btn');
        const pubGroups = document.querySelectorAll('.pub-year-group');
        if (filterBtns.length && pubGroups.length) {
            filterBtns.forEach((btn) => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach((b) => b.classList.remove('active'));
                    btn.classList.add('active');
                    const filter = btn.getAttribute('data-filter');
                    pubGroups.forEach((group) => {
                        const show = filter === 'all' || group.getAttribute('data-year') === filter;
                        group.style.display = show ? '' : 'none';
                    });
                });
            });
        }

        /* ---------- Animated count-up for stats ---------- */
        const counters = document.querySelectorAll('.num[data-count]');
        if (counters.length) {
            const runCount = (el) => {
                const target = parseInt(el.getAttribute('data-count'), 10) || 0;
                const suffix = el.getAttribute('data-suffix') || '';
                if (prefersReducedMotion) { el.textContent = target + suffix; return; }
                const duration = 1100;
                const start = performance.now();
                (function tick(now) {
                    const p = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.round(target * eased) + suffix;
                    if (p < 1) requestAnimationFrame(tick);
                })(start);
            };
            if ('IntersectionObserver' in window) {
                const countObs = new IntersectionObserver((entries, obs) => {
                    entries.forEach((e) => { if (e.isIntersecting) { runCount(e.target); obs.unobserve(e.target); } });
                }, { threshold: 0.5 });
                counters.forEach((c) => countObs.observe(c));
            } else {
                counters.forEach(runCount);
            }
        }

        /* ---------- Copy BibTeX ---------- */
        document.querySelectorAll('.cite-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.publication-item');
                const pre = item && item.querySelector('.bibtex');
                if (!pre || !navigator.clipboard) return;
                navigator.clipboard.writeText(pre.textContent.trim()).then(() => {
                    const original = btn.innerHTML;
                    btn.classList.add('copied');
                    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = original; }, 1600);
                });
            });
        });

        /* ---------- Contact form (Formspree) ---------- */
        const contactForm = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');
        // Hide the form until a real Formspree ID is configured (see README)
        if (contactForm && contactForm.action.indexOf('YOUR_FORM_ID') !== -1) {
            contactForm.style.display = 'none';
        }
        if (contactForm && formStatus) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (contactForm.action.indexOf('YOUR_FORM_ID') !== -1) {
                    formStatus.className = 'form-status err';
                    formStatus.textContent = '⚠ Contact form isn’t connected yet — add your Formspree form ID (see README).';
                    return;
                }
                formStatus.className = 'form-status';
                formStatus.textContent = 'Sending…';
                try {
                    const res = await fetch(contactForm.action, {
                        method: 'POST',
                        body: new FormData(contactForm),
                        headers: { Accept: 'application/json' }
                    });
                    if (res.ok) {
                        contactForm.reset();
                        formStatus.className = 'form-status ok';
                        formStatus.textContent = '✓ Thanks! Your message has been sent.';
                    } else {
                        throw new Error('Request failed');
                    }
                } catch (err) {
                    formStatus.className = 'form-status err';
                    formStatus.textContent = '✗ Something went wrong — please email me directly.';
                }
            });
        }

        /* ---------- Typed role effect in hero ---------- */
        const roleEl = document.getElementById('role-text');
        if (roleEl) {
            const roles = [
                'Computational Semiconductor Physics',
                'First-Principles DFT & Electron–Phonon Coupling',
                'NEGF Quantum Transport for 2D Devices',
                'TCAD-Oriented Device Modeling'
            ];
            if (prefersReducedMotion) {
                roleEl.textContent = roles[0];
            } else {
                let r = 0, c = 0, deleting = false;
                (function type() {
                    const current = roles[r];
                    roleEl.textContent = deleting ? current.slice(0, c--) : current.slice(0, c++);
                    let delay = deleting ? 45 : 80;
                    if (!deleting && c === current.length + 1) { deleting = true; delay = 1700; }
                    else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 350; }
                    setTimeout(type, delay);
                })();
            }
        }

        /* ---------- Hero particle lattice ---------- */
        const heroCanvas = document.querySelector('.hero-canvas');
        if (heroCanvas && heroCanvas.getContext && !prefersReducedMotion) {
            const ctx = heroCanvas.getContext('2d');
            const hero = heroCanvas.parentElement;
            let w = 0, h = 0, dpr = 1, particles = [], active = false;
            const mouse = { x: -9999, y: -9999 };

            function resize() {
                dpr = Math.min(window.devicePixelRatio || 1, 2);
                w = hero.offsetWidth; h = hero.offsetHeight;
                heroCanvas.width = w * dpr; heroCanvas.height = h * dpr;
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                const count = Math.max(14, Math.min(90, Math.round((w * h) / 16000)));
                particles = Array.from({ length: count }, () => ({
                    x: Math.random() * w, y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35
                }));
            }
            function step() {
                if (!active) return;
                ctx.clearRect(0, 0, w, h);
                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    p.x += p.vx; p.y += p.vy;
                    if (p.x < 0 || p.x > w) p.vx *= -1;
                    if (p.y < 0 || p.y > h) p.vy *= -1;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(165, 180, 252, 0.7)';
                    ctx.fill();
                    for (let j = i + 1; j < particles.length; j++) {
                        const q = particles[j];
                        const dx = p.x - q.x, dy = p.y - q.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 130) {
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
                            ctx.strokeStyle = 'rgba(129, 140, 248, ' + (0.18 * (1 - dist / 130)) + ')';
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }
                    }
                    const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
                    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (mdist < 170) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = 'rgba(196, 181, 253, ' + (0.28 * (1 - mdist / 170)) + ')';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
                requestAnimationFrame(step);
            }
            function start() { if (!active) { active = true; step(); } }
            function stop() { active = false; }

            hero.addEventListener('pointermove', (e) => {
                const r = hero.getBoundingClientRect();
                mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
            });
            hero.addEventListener('pointerleave', () => { mouse.x = -9999; mouse.y = -9999; });
            let resizeTimer;
            window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 200); });
            resize();
            start();
            if ('IntersectionObserver' in window) {
                new IntersectionObserver((entries) => {
                    entries.forEach((en) => { en.isIntersecting ? start() : stop(); });
                }, { threshold: 0 }).observe(hero);
            }
        }

        /* ---------- Card tilt + cursor glow ---------- */
        const finePointer = window.matchMedia('(pointer: fine)').matches;
        if (finePointer && !prefersReducedMotion) {
            document.querySelectorAll('.research-item, .software-card').forEach((card) => {
                card.addEventListener('pointermove', (e) => {
                    const r = card.getBoundingClientRect();
                    const px = (e.clientX - r.left) / r.width;
                    const py = (e.clientY - r.top) / r.height;
                    const rx = (py - 0.5) * -7;
                    const ry = (px - 0.5) * 7;
                    card.style.transform = 'translateY(-8px) perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
                    card.style.setProperty('--mx', (px * 100) + '%');
                    card.style.setProperty('--my', (py * 100) + '%');
                });
                card.addEventListener('pointerleave', () => { card.style.transform = ''; });
            });
        }

        /* ---------- Atom avatar: photoexcitation on click ---------- */
        const heroAvatar = document.getElementById('heroAvatar');
        if (heroAvatar) {
            let exciteTimer;
            heroAvatar.addEventListener('click', () => {
                heroAvatar.classList.add('excited');
                clearTimeout(exciteTimer);
                exciteTimer = setTimeout(() => heroAvatar.classList.remove('excited'), 1400);
            });
        }

        /* ---------- Copy email on click ---------- */
        document.querySelectorAll('.contact-item').forEach((item) => {
            const icon = item.querySelector('i.fa-envelope');
            const p = item.querySelector('p');
            if (icon && p && navigator.clipboard) {
                p.title = 'Click to copy';
                p.addEventListener('click', () => {
                    const text = p.textContent.includes(':') ? p.textContent.split(':')[1].trim() : p.textContent.trim();
                    navigator.clipboard.writeText(text).then(() => {
                        const original = p.textContent;
                        p.textContent = 'Copied to clipboard!';
                        setTimeout(() => { p.textContent = original; }, 1600);
                    });
                });
            }
        });

        /* ---------- Dynamic footer year ---------- */
        document.querySelectorAll('[data-current-year]').forEach((el) => {
            el.textContent = new Date().getFullYear();
        });
    });
})();
