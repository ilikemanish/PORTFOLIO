document.addEventListener('DOMContentLoaded', function() {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* 1. LOADER */
    setTimeout(function() {
        const loader = document.getElementById('initialLoader');
        if (loader) loader.classList.add('hidden');
        if (typeof AOS !== 'undefined') {
            AOS.init({ duration: 800, once: true, offset: 50, easing: 'ease-out-cubic' });
        }
    }, 400);

    /* 2. GREETING */
    (function updateGreeting() {
        const greetingSpan = document.getElementById('dynamicGreeting');
        if (!greetingSpan) return;
        const hour = new Date().getHours();
        let timeGreeting = 'Good Evening';
        if (hour >= 5 && hour < 12) timeGreeting = 'Good Morning';
        else if (hour >= 12 && hour < 17) timeGreeting = 'Good Afternoon';
        else if (hour >= 17 && hour < 21) timeGreeting = 'Good Evening';
        else timeGreeting = 'Good Night';
        greetingSpan.textContent = timeGreeting;
    })();

    /* 3. LEARNING TICKER */
    (function initLearningTicker() {
        const learningValueEl = document.getElementById('learningValue');
        if (!learningValueEl) return;
        const items = ['Machine Learning', 'AWS Basics', 'Microsoft Fabric', 'Snowflake'];
        learningValueEl.innerHTML = items.map((item, i) =>
            `<span class="lt-item${i === 0 ? ' active' : ''}">${item}</span>`
        ).join('');
        let idx = 0;
        setInterval(function() {
            const all = learningValueEl.querySelectorAll('.lt-item');
            if (!all.length) return;
            const current = all[idx];
            current.classList.remove('active');
            current.classList.add('out');
            setTimeout(function() { current.classList.remove('out'); }, 600);
            idx = (idx + 1) % all.length;
            const next = all[idx];
            next.classList.remove('active', 'out');
            void next.offsetWidth;
            next.classList.add('active');
        }, 2600);
    })();

    /* POWER BI VIDEOS */
    (function initAllPowerBIVideos() {
        const videoContainers = document.querySelectorAll('.powerbi-video-container');
        videoContainers.forEach(function(container) {
            const video = container.querySelector('video');
            if (!video) return;

            video.loop = true;
            video.setAttribute('loop', 'loop');
            video.muted = true;
            video.setAttribute('muted', 'muted');
            video.playsInline = true;
            video.setAttribute('playsinline', 'playsinline');

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                video.removeAttribute('autoplay');
                video.pause();
                return;
            }

            const tryPlay = function() {
                const p = video.play();
                if (p && typeof p.catch === 'function') {
                    p.catch(function() { video.setAttribute('controls', 'controls'); });
                }
            };
            if (video.readyState >= 1) tryPlay();
            else video.addEventListener('loadedmetadata', tryPlay, { once: true });

            video.addEventListener('ended', function() {
                try {
                    video.currentTime = 0;
                    const p = video.play();
                    if (p && typeof p.catch === 'function') p.catch(function(){});
                } catch (e) {}
            });
            video.addEventListener('pause', function() {
                if (!container.matches(':hover') && video.loop && !video.ended) {
                    const p = video.play();
                    if (p && typeof p.catch === 'function') p.catch(function(){});
                }
            });

            const vObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        tryPlay();
                        vObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.25 });
            vObserver.observe(container);

            container.addEventListener('mouseenter', function() { if (!video.paused) video.pause(); });
            container.addEventListener('mouseleave', function() {
                if (video.paused) {
                    const p = video.play();
                    if (p && typeof p.catch === 'function') p.catch(function(){});
                }
            });
            video.addEventListener('error', function() {
                const poster = video.getAttribute('poster');
                if (poster) {
                    container.style.backgroundImage = "url('" + poster + "')";
                    container.style.backgroundSize = 'cover';
                    container.style.backgroundPosition = 'center';
                    container.style.backgroundRepeat = 'no-repeat';
                }
            });
        });
    })();

    /* 4. SOUND EFFECTS */
    let audioCtx = null;
    let soundEnabled = false;
    function getAudioCtx() {
        if (!audioCtx) {
            try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
            catch (e) { audioCtx = null; }
        }
        return audioCtx;
    }
    function playClick(freq) {
        if (!soundEnabled) return;
        const ctx = getAudioCtx();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq || 880;
        osc.connect(gain); gain.connect(ctx.destination);
        const t = ctx.currentTime;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.05, t + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
        osc.start(t); osc.stop(t + 0.11);
    }
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const soundIcon = document.getElementById('soundIcon');
    if (soundToggleBtn) {
        const savedSound = localStorage.getItem('soundEnabled') === '1';
        if (savedSound) {
            soundEnabled = true;
            soundToggleBtn.classList.add('sound-on');
            soundIcon.classList.remove('fa-volume-xmark');
            soundIcon.classList.add('fa-volume-high');
        }
        soundToggleBtn.addEventListener('click', function() {
            soundEnabled = !soundEnabled;
            this.classList.toggle('sound-on', soundEnabled);
            if (soundEnabled) {
                soundIcon.classList.remove('fa-volume-xmark');
                soundIcon.classList.add('fa-volume-high');
                playClick(1100);
            } else {
                soundIcon.classList.remove('fa-volume-high');
                soundIcon.classList.add('fa-volume-xmark');
            }
            localStorage.setItem('soundEnabled', soundEnabled ? '1' : '0');
        });
        document.querySelectorAll('.btn, .project-link-btn, .drop-link, .slide-btn, .hire-btn, .filter-tag, .modal-close, .github-toggle-btn, .project-nav-btn, .copy-btn, .resume-filter, .resume-collapse-btn, .resume-copy-btn').forEach(function(el) {
            el.addEventListener('mouseenter', function() { playClick(1400); });
            el.addEventListener('click', function() { playClick(760); });
        });
    }

    /* KONAMI CODE */
    (function initKonami() {
        const sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
        let idx = 0;
        let goldActive = false;
        const toast = document.getElementById('konamiToast');
        function fireConfetti() {
            if (typeof confetti === 'undefined') return;
            const duration = 3200;
            const end = Date.now() + duration;
            const colors = ['#ffd700', '#ffa500', '#ffec8b', '#ffffff', '#00f0ff', '#b05cff'];
            (function frame() {
                confetti({ particleCount: 4, angle: 60, spread: 65, origin: { x: 0, y: 0.7 }, colors: colors, scalar: 1.05 });
                confetti({ particleCount: 4, angle: 120, spread: 65, origin: { x: 1, y: 0.7 }, colors: colors, scalar: 1.05 });
                if (Date.now() < end) requestAnimationFrame(frame);
            })();
            confetti({ particleCount: 180, spread: 100, origin: { y: 0.5 }, colors: colors, startVelocity: 42, scalar: 1.15 });
        }
        function toggleGoldMode() {
            if (goldActive) return;
            goldActive = true;
            document.body.classList.add('gold-mode');
            fireConfetti();
            if (toast) {
                toast.classList.add('show');
                setTimeout(function() { toast.classList.remove('show'); }, 10000);
            }
            if (window.__radarChartInstance && window.__updateRadarTheme) {
                const currentMode = localStorage.getItem('themeMode') || 'dark';
                window.__updateRadarTheme(currentMode);
            }
            setTimeout(function() {
                document.body.classList.remove('gold-mode');
                goldActive = false;
                if (window.__radarChartInstance && window.__updateRadarTheme) {
                    const currentMode = localStorage.getItem('themeMode') || 'dark';
                    window.__updateRadarTheme(currentMode);
                }
            }, 10000);
        }
        document.addEventListener('keydown', function(e) {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            if (key === sequence[idx]) {
                idx++;
                if (idx === sequence.length) { idx = 0; toggleGoldMode(); }
            } else {
                idx = (key === sequence[0]) ? 1 : 0;
            }
        });
    })();

    /* 5. SCROLL LOGIC */
    const scrollIndicator = document.getElementById('scrollIndicator');
    const backToTop = document.getElementById('backToTop');
    const progressBar = document.getElementById('scrollProgressBar');
    const headerEl = document.getElementById('mainHeader');
    const parallaxW1 = document.getElementById('parallax-w1');
    const parallaxW2 = document.getElementById('parallax-w2');
    const parallaxHero = document.getElementById('parallax-hero');
    const heroSection = document.getElementById('home');
    const ghStack = document.getElementById('githubStack');
    let isScrolling = false;

    function updateGithubToggleVisibility() {
        if (!ghStack || !heroSection) return;
        const threshold = heroSection.offsetTop + heroSection.offsetHeight - 150;
        if (window.scrollY >= threshold) {
            ghStack.classList.add('revealed');
        } else {
            ghStack.classList.remove('revealed');
        }
    }

    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const y = window.scrollY;
                if (headerEl) {
                    headerEl.classList.toggle('scrolled', y > 10);
                    headerEl.classList.toggle('header-hidden', y > 350);
                }
                if (scrollIndicator) scrollIndicator.classList.toggle('hidden', y > 50);
                if (backToTop) backToTop.classList.toggle('visible', y > 500);
                if (progressBar) {
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    progressBar.style.width = (docHeight > 0 ? (y / docHeight) * 100 : 0) + '%';
                }
                if (y < 800) {
                    if (parallaxW1) parallaxW1.style.transform = `translateY(${y * 0.15}px)`;
                    if (parallaxW2) parallaxW2.style.transform = `translateY(${y * -0.1}px)`;
                    if (parallaxHero) parallaxHero.style.transform = `translateY(${y * 0.05}px)`;
                }
                updateHireBarVisibility();
                updateGithubToggleVisibility();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    setTimeout(updateGithubToggleVisibility, 100);
    window.addEventListener('resize', updateGithubToggleVisibility, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            history.replaceState(null, null, ' ');
        });
    }

    /* 6. PARTICLES */
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 70, density: { enable: true, value_area: 800 } },
                color: { value: ['#00f0ff', '#b05cff'] },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
                size: { value: 3.5, random: true, anim: { enable: false } },
                line_linked: { enable: true, distance: 160, color: '#00f0ff', opacity: 0.35, width: 1.5 },
                move: { enable: true, speed: 1.8, direction: 'none', random: true, straight: false, out_mode: 'bounce', bounce: true }
            },
            interactivity: {
                detect_on: 'window',
                events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
                modes: { grab: { distance: 180, line_linked: { opacity: 0.8 } }, push: { particles_nb: 4 } }
            },
            retina_detect: true
        });
    }

    /* 7. MODAL TRANSITIONS */
    const modalVeil = document.getElementById('modalVeil');
    const allModals = document.querySelectorAll('.modal-overlay');
    const closeBtns = document.querySelectorAll('.modal-close');
    let activeStoryScrubCleanup = null;

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        if (!document.querySelector('.modal-overlay.active')) {
            document.body.style.overflow = 'auto';
        }
        if (modal.classList.contains('story-modal')) {
            modal.querySelectorAll('.story-step').forEach(s => {
                s.classList.remove('visible');
                const bars = s.querySelectorAll('.story-bar');
                bars.forEach(b => b.style.height = '0%');
            });
            if (activeStoryScrubCleanup) { activeStoryScrubCleanup(); activeStoryScrubCleanup = null; }
        }
    }
    function closeAllModals() { allModals.forEach(function(m) { closeModal(m); }); }
    function openModalSmooth(modalEl) {
        if (!modalEl) return;
        const currentlyOpen = document.querySelector('.modal-overlay.active');
        if (currentlyOpen && currentlyOpen !== modalEl) {
            if (modalVeil) modalVeil.classList.add('active');
            setTimeout(function() {
                closeAllModals();
                void modalEl.offsetWidth;
                modalEl.classList.add('active');
                document.body.style.overflow = 'hidden';
                setTimeout(function() { if (modalVeil) modalVeil.classList.remove('active'); }, 90);
            }, 180);
        } else {
            modalEl.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    window.__openModalSmooth = openModalSmooth;

    closeBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const modal = btn.closest('.modal-overlay');
            if (modal) closeModal(modal);
        });
    });
    allModals.forEach(function(modal) {
        modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(modal); });
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const lightbox = document.getElementById('certLightbox');
            if (lightbox && lightbox.classList.contains('active')) { closeLightbox(); return; }
            document.querySelectorAll('.modal-overlay.active').forEach(function(modal) { closeModal(modal); });
        }
    });

    /* 8. SKILL CARDS */
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(function(item) {
        item.addEventListener('click', function() {
            techItems.forEach(function(other) { if (other !== item) other.classList.remove('active'); });
            this.classList.toggle('active');
            const self = this;
            if (self.classList.contains('active')) {
                setTimeout(function() { self.classList.remove('active'); }, 2500);
            }
        });
    });

    /* 9. HAMBURGER */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropLinks = document.querySelectorAll('.drop-link');
    const sections = document.querySelectorAll('section');
    hamburgerBtn.addEventListener('click', function() {
        hamburgerBtn.classList.toggle('active');
        dropdownMenu.classList.toggle('active');
    });
    dropLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            hamburgerBtn.classList.remove('active');
            dropdownMenu.classList.remove('active');
        });
    });
    document.addEventListener('click', function(e) {
        if (!hamburgerBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            hamburgerBtn.classList.remove('active');
            dropdownMenu.classList.remove('active');
        }
    });
    const scrollObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                dropLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) link.classList.add('active');
                });
            }
        });
    }, { root: null, rootMargin: '-30% 0px -50% 0px', threshold: 0 });
    sections.forEach(function(sec) { scrollObserver.observe(sec); });

    /* 10. 3D REVEAL */
    const revealTargets = document.querySelectorAll('.terminal-box, .premium-metric-card, .card-3d-node, .info-premium-node, .mock-dashboard-card, .testimonial-item, .chain-item, .skill-item');
    revealTargets.forEach(function(el) { el.classList.add('reveal-3d'); });
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                if (entry.target.classList.contains('terminal-box')) entry.target.classList.add('aos-animate');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0, rootMargin: '0px 0px 100px 0px' });
    revealTargets.forEach(function(el) { revealObserver.observe(el); });

    /* 11. THEME */
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const themeModes = ['dark', 'light', 'contrast'];
    let themeMode = localStorage.getItem('themeMode') || localStorage.getItem('theme') || 'dark';
    if (!themeModes.includes(themeMode)) themeMode = 'dark';
    function applyTheme(mode) {
        document.body.classList.remove('light-theme', 'contrast-theme');
        if (mode === 'light') document.body.classList.add('light-theme');
        else if (mode === 'contrast') document.body.classList.add('contrast-theme');
        if (!themeIcon) return;
        themeIcon.classList.remove('fa-sun', 'fa-moon', 'fa-circle-half-stroke');
        if (mode === 'light') themeIcon.classList.add('fa-sun');
        else if (mode === 'contrast') themeIcon.classList.add('fa-moon');
        else themeIcon.classList.add('fa-circle-half-stroke');
        if (window.__radarChartInstance) window.__updateRadarTheme(mode);
        localStorage.setItem('themeMode', mode);
    }
    if (themeToggleBtn) {
        applyTheme(themeMode);
        themeToggleBtn.addEventListener('click', function() {
            const idx = themeModes.indexOf(themeMode);
            themeMode = themeModes[(idx + 1) % themeModes.length];
            applyTheme(themeMode);
        });
    }

    /* 12. PORTFOLIO FILTER */
    const filterTags = document.querySelectorAll('.filter-tag');
    const boxContainer = document.getElementById('projectPlaceholderBox');
    const mockCards = document.querySelectorAll('.mock-dashboard-card');
    if (filterTags.length > 0 && boxContainer) {
        const activeTag = document.querySelector('.filter-tag.active');
        const initialActiveFilter = activeTag ? activeTag.getAttribute('data-target') : 'major';
        mockCards.forEach(function(card) {
            card.style.display = card.getAttribute('data-filter') === initialActiveFilter ? 'flex' : 'none';
        });
        filterTags.forEach(function(tag) {
            tag.addEventListener('click', function() {
                const target = tag.getAttribute('data-target');
                filterTags.forEach(function(t) { t.classList.remove('active'); });
                tag.classList.add('active');
                boxContainer.style.opacity = '0.3';
                setTimeout(function() {
                    mockCards.forEach(function(card) {
                        if (card.getAttribute('data-filter') === target) {
                            card.style.display = 'flex';
                            card.classList.remove('in-view');
                            requestAnimationFrame(function() { card.classList.add('in-view'); });
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    boxContainer.style.opacity = '1';
                }, 250);
            });
        });
    }

    /* 13. DETAILS MODAL OPENERS + PROJECT NAV */
    document.querySelectorAll('.btn-details').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const target = document.getElementById(btn.getAttribute('data-modal'));
            if (target) openModalSmooth(target);
        });
    });
    document.querySelectorAll('.project-nav-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const target = document.getElementById(btn.getAttribute('data-nav-project'));
            if (target) openModalSmooth(target);
        });
    });

    /* 14. RESUME MODAL + INTERACTIVE SWITCH */
    const openResumeBtn = document.getElementById('openResumeViewerBtn');
    const openInteractiveResumeBtn = document.getElementById('openInteractiveResumeBtn');
    const resumeModal = document.getElementById('resumeViewerModal');
    const interactiveResumeModal = document.getElementById('interactiveResumeModal');
    function openResumeModal() { if (resumeModal) openModalSmooth(resumeModal); }
    function openInteractiveResumeModal() { if (interactiveResumeModal) openModalSmooth(interactiveResumeModal); }
    if (openResumeBtn) {
        openResumeBtn.addEventListener('click', function(e) { e.preventDefault(); openResumeModal(); });
    }
    if (openInteractiveResumeBtn) {
        openInteractiveResumeBtn.addEventListener('click', function(e) { e.preventDefault(); openInteractiveResumeModal(); });
    }
    window.__openResumeModal = openResumeModal;
    window.__openInteractiveResumeModal = openInteractiveResumeModal;

    const switchToInteractiveBtn = document.getElementById('switchToInteractiveBtn');
    const switchToPdfBtn = document.getElementById('switchToPdfBtn');
    if (switchToInteractiveBtn) {
        switchToInteractiveBtn.addEventListener('click', function() {
            closeModal(resumeModal);
            setTimeout(function() { openModalSmooth(interactiveResumeModal); }, 220);
        });
    }
    if (switchToPdfBtn) {
        switchToPdfBtn.addEventListener('click', function() {
            closeModal(interactiveResumeModal);
            setTimeout(function() { openModalSmooth(resumeModal); }, 220);
        });
    }

    /* INTERACTIVE RESUME LOGIC */
    (function initInteractiveResume() {
        const body = document.getElementById('resumeInteractiveBody');
        if (!body) return;

        // Collapsible sections
        body.querySelectorAll('.resume-section').forEach(function(section) {
            const header = section.querySelector('.resume-section-header');
            const btn = section.querySelector('.resume-collapse-btn');
            if (!header) return;
            header.addEventListener('click', function(e) {
                if (e.target.closest('a, button:not(.resume-collapse-btn)')) return;
                section.classList.toggle('collapsed');
            });
            if (btn) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    section.classList.toggle('collapsed');
                });
            }
        });

        // Filters
        const filters = document.querySelectorAll('.resume-filter');
        const sections = body.querySelectorAll('.resume-section');
        filters.forEach(function(f) {
            f.addEventListener('click', function() {
                const target = f.getAttribute('data-rfilter');
                filters.forEach(function(x) { x.classList.remove('active'); });
                f.classList.add('active');
                sections.forEach(function(s) {
                    if (target === 'all') {
                        s.classList.remove('hidden');
                    } else {
                        s.classList.toggle('hidden', s.getAttribute('data-rsection') !== target);
                    }
                });
            });
        });

        // Print
        const printBtn = document.getElementById('resumePrintBtn');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                window.print();
            });
        }

        // Copy as JSON
        const copyJsonBtn = document.getElementById('copyAsJsonBtn');
        if (copyJsonBtn) {
            copyJsonBtn.addEventListener('click', function() {
                const data = {
                    name: 'Manish Kashyap',
                    role: 'Aspiring Data Analyst',
                    email: 'manishkshyp0123@gmail.com',
                    location: 'India',
                    phone: '+91 95681 10788',
                    github: 'https://github.com/ilikemanish',
                    education: [
                        { degree: 'B.Tech in Computer Science', institution: 'Teerthanker Mahaveer University, Moradabad', duration: '2023 – 2027', specialization: 'AI, ML, Deep Learning' },
                        { degree: 'Class 12 (CBSE)', institution: "St Anthony's Sr Sec School, Dugawar", year: '2023' },
                        { degree: 'Class 10 (CBSE)', institution: "St Anthony's Sr Sec School, Dugawar", year: '2021' }
                    ],
                    experience: [
                        { role: 'Data Analyst Intern', company: '3Skill', duration: '2 Months', tools: ['Excel', 'SQL', 'Python', 'Power BI'] }
                    ],
                    skills: {
                        technical: { Python: 90, SQL: 85, Excel: 90, 'Power BI': 80, Tableau: 75, Statistics: 70, 'Machine Learning': 60 },
                        soft: ['Critical Thinking', 'Team Leading', 'Decision Making', 'Data Storytelling', 'Collaboration', 'Problem Solving']
                    },
                    projects: [
                        { name: 'Blinkit Sales & Outlet Performance', stack: 'Power BI, DAX' },
                        { name: 'Smoking Health Risk Analysis', stack: 'Power BI, DAX' },
                        { name: 'Netflix SQL Data Analysis', stack: 'PostgreSQL' },
                        { name: 'Online Book Store Analysis', stack: 'PostgreSQL' },
                        { name: 'Swiggy Sales Dashboard', stack: 'Microsoft Excel' },
                        { name: 'Decathlon Sales & Customer Analytics', stack: 'Microsoft Excel' }
                    ],
                    languages: ['Hindi', 'English']
                };
                const json = JSON.stringify(data, null, 2);
                navigator.clipboard.writeText(json).then(function() {
                    copyJsonBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                    setTimeout(function() {
                        copyJsonBtn.innerHTML = '<i class="fa-solid fa-code"></i> Copy as JSON';
                    }, 2200);
                }).catch(function() {
                    copyJsonBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> Failed';
                    setTimeout(function() {
                        copyJsonBtn.innerHTML = '<i class="fa-solid fa-code"></i> Copy as JSON';
                    }, 2200);
                });
            });
        }

        // Copy as Markdown
        const copyMdBtn = document.getElementById('copyAsMdBtn');
        if (copyMdBtn) {
            copyMdBtn.addEventListener('click', function() {
                const md = `# Manish Kashyap
**Aspiring Data Analyst**

📧 manishkshyp0123@gmail.com · 📍 India · 🐙 [github.com/ilikemanish](https://github.com/ilikemanish)

## Education
- **B.Tech in Computer Science** — Teerthanker Mahaveer University, Moradabad *(2023 – 2027)*
  Specialization: AI, ML, Deep Learning
- **Class 12 (CBSE)** — St Anthony's Sr Sec School, Dugawar *(2023)*
- **Class 10 (CBSE)** — St Anthony's Sr Sec School, Dugawar *(2021)*

## Experience
- **Data Analyst Intern** — 3Skill *(2 Months)*
  Tools: Excel, SQL, Python, Power BI

## Technical Skills
- **Python** 90% · **SQL** 85% · **Excel** 90%
- **Power BI** 80% · **Tableau** 75%
- **Statistics** 70% · **Machine Learning** 60%

## Soft Skills
Critical Thinking, Team Leading, Decision Making, Data Storytelling, Collaboration, Problem Solving

## Key Projects
- **Blinkit Sales & Outlet Performance** — Power BI, DAX
- **Smoking Health Risk Analysis** — Power BI, DAX
- **Netflix SQL Data Analysis** — PostgreSQL
- **Online Book Store Analysis** — PostgreSQL
- **Swiggy Sales Dashboard** — Microsoft Excel
- **Decathlon Sales & Customer Analytics** — Microsoft Excel

## Languages
Hindi, English
`;
                navigator.clipboard.writeText(md).then(function() {
                    copyMdBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                    setTimeout(function() {
                        copyMdBtn.innerHTML = '<i class="fa-solid fa-file-lines"></i> Copy as Markdown';
                    }, 2200);
                }).catch(function() {
                    copyMdBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> Failed';
                    setTimeout(function() {
                        copyMdBtn.innerHTML = '<i class="fa-solid fa-file-lines"></i> Copy as Markdown';
                    }, 2200);
                });
            });
        }
    })();

    /* 15. METRICS COUNTER */
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;
    function animateCounters() {
        counters.forEach(function(counter) {
            const target = +counter.getAttribute('data-target');
            const duration = 600;
            let startTime = null;
            function step(ts) {
                if (!startTime) startTime = ts;
                const progress = Math.min((ts - startTime) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                counter.innerText = Math.floor(ease * target);
                if (progress < 1) window.requestAnimationFrame(step);
                else counter.innerText = target;
            }
            window.requestAnimationFrame(step);
        });
    }
    const metricsObserver = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting && !hasCounted) {
            hasCounted = true;
            animateCounters();
            metricsObserver.disconnect();
        }
    }, { threshold: 0.4 });
    const impactSection = document.querySelector('.impact-section');
    if (impactSection) metricsObserver.observe(impactSection);

    /* 16. SLIDER + LIGHTBOX */
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let currentSlide = 0;
    let slideInterval;
    function showSlide(i) {
        if (!slides.length) return;
        slides.forEach(function(s) { s.classList.remove('active'); });
        currentSlide = i;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        slides[currentSlide].classList.add('active');
    }
    function nextSlideFn() { showSlide(currentSlide + 1); }
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', function() { nextSlideFn(); resetSliderTimer(); });
        prevBtn.addEventListener('click', function() { showSlide(currentSlide - 1); resetSliderTimer(); });
    }
    function startSliderTimer() { slideInterval = setInterval(nextSlideFn, 4500); }
    function resetSliderTimer() { clearInterval(slideInterval); startSliderTimer(); }
    startSliderTimer();
    document.addEventListener("visibilitychange", function() {
        if (document.hidden) clearInterval(slideInterval); else startSliderTimer();
    });

    /* CERTIFICATE LIGHTBOX */
    const certLightbox = document.getElementById('certLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxZoomIn = document.getElementById('lightboxZoomIn');
    const lightboxZoomOut = document.getElementById('lightboxZoomOut');
    const lightboxReset = document.getElementById('lightboxReset');
    const lightboxDownload = document.getElementById('lightboxDownload');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxImgWrap = document.getElementById('lightboxImgWrap');

    const certImages = Array.from(document.querySelectorAll('#certSlider .slide img'));
    let lightboxIndex = 0;
    let lightboxScale = 1;
    let lightboxTranslateX = 0;
    let lightboxTranslateY = 0;
    let isDraggingLightbox = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartTranslateX = 0;
    let dragStartTranslateY = 0;

    function applyLightboxTransform() {
        lightboxImg.style.transform = `translate(${lightboxTranslateX}px, ${lightboxTranslateY}px) scale(${lightboxScale})`;
    }
    function resetLightboxTransform() {
        lightboxScale = 1;
        lightboxTranslateX = 0;
        lightboxTranslateY = 0;
        applyLightboxTransform();
    }
    function updateLightboxContent() {
        if (!certImages.length) return;
        const img = certImages[lightboxIndex];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || ('Certificate ' + (lightboxIndex + 1));
        if (lightboxDownload) {
            lightboxDownload.href = img.src;
            lightboxDownload.download = 'certificate-' + (lightboxIndex + 1) + '.jpg';
        }
        if (lightboxCounter) lightboxCounter.textContent = (lightboxIndex + 1) + ' / ' + certImages.length;
        resetLightboxTransform();
    }
    function openLightbox(index) {
        lightboxIndex = index;
        updateLightboxContent();
        certLightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        showSlide(index);
    }
    function closeLightbox() {
        certLightbox.classList.remove('active');
        if (!document.querySelector('.modal-overlay.active')) {
            document.body.style.overflow = 'auto';
        }
        resetLightboxTransform();
        resetSliderTimer();
    }
    function lightboxNextImg() {
        lightboxIndex = (lightboxIndex + 1) % certImages.length;
        updateLightboxContent();
        showSlide(lightboxIndex);
    }
    function lightboxPrevImg() {
        lightboxIndex = (lightboxIndex - 1 + certImages.length) % certImages.length;
        updateLightboxContent();
        showSlide(lightboxIndex);
    }

    if (certImages.length) {
        certImages.forEach(function(img, i) {
            img.addEventListener('click', function() { openLightbox(i); });
        });
    }
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', lightboxPrevImg);
    if (lightboxNext) lightboxNext.addEventListener('click', lightboxNextImg);
    if (lightboxZoomIn) lightboxZoomIn.addEventListener('click', function() {
        lightboxScale = Math.min(5, lightboxScale + 0.25);
        applyLightboxTransform();
    });
    if (lightboxZoomOut) lightboxZoomOut.addEventListener('click', function() {
        lightboxScale = Math.max(0.5, lightboxScale - 0.25);
        if (lightboxScale <= 1) { lightboxTranslateX = 0; lightboxTranslateY = 0; }
        applyLightboxTransform();
    });
    if (lightboxReset) lightboxReset.addEventListener('click', resetLightboxTransform);

    if (certLightbox) {
        certLightbox.addEventListener('click', function(e) {
            if (e.target === certLightbox) closeLightbox();
        });
    }

    if (lightboxImgWrap) {
        lightboxImgWrap.addEventListener('wheel', function(e) {
            if (!certLightbox.classList.contains('active')) return;
            e.preventDefault();
            const delta = -e.deltaY * 0.0015;
            lightboxScale = Math.min(5, Math.max(0.5, lightboxScale + delta));
            if (lightboxScale <= 1) { lightboxTranslateX = 0; lightboxTranslateY = 0; }
            applyLightboxTransform();
        }, { passive: false });

        lightboxImgWrap.addEventListener('pointerdown', function(e) {
            if (lightboxScale <= 1) return;
            isDraggingLightbox = true;
            lightboxImgWrap.classList.add('grabbing');
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            dragStartTranslateX = lightboxTranslateX;
            dragStartTranslateY = lightboxTranslateY;
            lightboxImgWrap.setPointerCapture(e.pointerId);
        });
        lightboxImgWrap.addEventListener('pointermove', function(e) {
            if (!isDraggingLightbox) return;
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            lightboxTranslateX = dragStartTranslateX + dx;
            lightboxTranslateY = dragStartTranslateY + dy;
            applyLightboxTransform();
        });
        lightboxImgWrap.addEventListener('pointerup', function(e) {
            isDraggingLightbox = false;
            lightboxImgWrap.classList.remove('grabbing');
            try { lightboxImgWrap.releasePointerCapture(e.pointerId); } catch (err) {}
        });
        lightboxImgWrap.addEventListener('pointercancel', function(e) {
            isDraggingLightbox = false;
            lightboxImgWrap.classList.remove('grabbing');
        });
    }

    document.addEventListener('keydown', function(e) {
        if (!certLightbox || !certLightbox.classList.contains('active')) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); lightboxNextImg(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); lightboxPrevImg(); }
        else if (e.key === '+' || e.key === '=') { e.preventDefault(); lightboxZoomIn.click(); }
        else if (e.key === '-' || e.key === '_') { e.preventDefault(); lightboxZoomOut.click(); }
        else if (e.key === '0') { e.preventDefault(); resetLightboxTransform(); }
    });

    /* 17. GLOW CARDS TILT */
    const cards = document.querySelectorAll('.glow-card:not(.mock-dashboard-card), .premium-metric-card');
    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
            if (card.hasAttribute('data-tilt')) return;
            const midX = rect.width / 2, midY = rect.height / 2;
            const rotateY = ((x - midX) / midX) * 6;
            const rotateX = -((y - midY) / midY) * 6;
            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        });
        card.addEventListener('mouseleave', function() {
            if (card.hasAttribute('data-tilt')) return;
            card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    if (isFinePointer) {
        document.querySelectorAll('.mock-dashboard-card').forEach(function(card) {
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', x + 'px');
                card.style.setProperty('--mouse-y', y + 'px');
            });
        });
    }

    /* 18. COPY EMAIL */
    const copyBtn = document.getElementById('copyEmailBtn');
    const emailText = document.getElementById('emailText');
    if (copyBtn && emailText) {
        copyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigator.clipboard.writeText(emailText.innerText).then(function() {
                copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                setTimeout(function() { copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>'; }, 2500);
            });
        });
    }

    /* 19. GITHUB STATS */
    const githubCounter = document.getElementById('githubCounter');
    const githubPlus = document.getElementById('githubPlus');
    const githubText = document.getElementById('githubText');
    fetch('https://api.github.com/users/ilikemanish')
        .then(r => r.json())
        .then(function(data) {
            if (data.public_repos !== undefined && githubCounter) {
                githubCounter.setAttribute('data-target', data.public_repos);
                if (githubCounter.innerText !== '0') githubCounter.innerText = data.public_repos;
                if (githubPlus) githubPlus.style.display = 'none';
                if (githubText) githubText.innerText = 'GitHub Repositories';
            }
        })
        .catch(function() {
            if (githubCounter) {
                githubCounter.setAttribute('data-target', 12);
                if (githubPlus) githubPlus.style.display = 'none';
                if (githubText) githubText.innerText = 'GitHub Repositories';
            }
        });

    /* 20. VANILLA TILT + ABOUT TILT + MAGNETIC */
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), { max: 15, speed: 400, glare: true, 'max-glare': 0.2 });
    }
    const aboutTiltCard = document.getElementById('aboutTiltCard');
    if (aboutTiltCard && isFinePointer) {
        aboutTiltCard.addEventListener('mousemove', function(e) {
            const rect = aboutTiltCard.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;
            const midX = rect.width / 2, midY = rect.height / 2;
            const rotateY = ((x - midX) / midX) * 8;
            const rotateX = -((y - midY) / midY) * 8;
            aboutTiltCard.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        aboutTiltCard.addEventListener('mouseleave', function() {
            aboutTiltCard.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
        });
    }
    const magneticElements = document.querySelectorAll('.btn, .social-links a, .logo');
    if (isFinePointer) {
        magneticElements.forEach(function(el) {
            el.addEventListener('mousemove', function(e) {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px) scale(1.05)`;
            });
            el.addEventListener('mouseleave', function() { el.style.transform = ''; });
        });
    }

    /* 21. SCROLL-SCRUBBED STORY MODALS */
    function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
    function resetStoryModal(modalEl) {
        modalEl.querySelectorAll('.story-step').forEach(s => {
            s.classList.remove('visible');
            s.querySelectorAll('.story-bar').forEach(b => b.style.height = '0%');
            s.querySelectorAll('.story-bar-val').forEach(v => v.style.opacity = '0');
        });
        const content = modalEl.querySelector('.modal-content');
        if (content) content.scrollTop = 0;
    }
    function setupScrollScrub(modalEl) {
        if (activeStoryScrubCleanup) activeStoryScrubCleanup();
        const content = modalEl.querySelector('.modal-content');
        const steps = modalEl.querySelectorAll('.story-step');
        if (!content || !steps.length) return;

        steps.forEach(step => {
            const bars = step.querySelectorAll('.story-bar');
            bars.forEach(bar => {
                const h = bar.style.getPropertyValue('--h');
                if (h) {
                    const parsed = parseFloat(h);
                    if (!isNaN(parsed)) bar.dataset.targetH = parsed;
                }
            });
        });

        function update() {
            const contentRect = content.getBoundingClientRect();
            const viewportTop = contentRect.top;
            const viewportH = content.clientHeight;

            steps.forEach(step => {
                const rect = step.getBoundingClientRect();
                const stepTopRel = rect.top - viewportTop;
                const triggerStart = viewportH;
                const triggerEnd = viewportH * 0.35;
                const progress = clamp((triggerStart - stepTopRel) / (triggerStart - triggerEnd), 0, 1);

                if (progress > 0.05) step.classList.add('visible');
                else step.classList.remove('visible');

                const bars = step.querySelectorAll('.story-bar');
                bars.forEach(bar => {
                    const target = parseFloat(bar.dataset.targetH || 0);
                    bar.style.height = (target * progress) + '%';
                });
                const vals = step.querySelectorAll('.story-bar-val');
                vals.forEach(v => {
                    v.style.opacity = progress > 0.7 ? '1' : '0';
                });
            });
        }

        let ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                update();
                ticking = false;
            });
        }
        content.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });

        activeStoryScrubCleanup = function() {
            content.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };

        setTimeout(update, 250);
        setTimeout(update, 550);
    }

    document.querySelectorAll('.btn-story').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const modal = document.getElementById(btn.getAttribute('data-story'));
            if (!modal) return;
            resetStoryModal(modal);
            openModalSmooth(modal);
            setTimeout(function() { setupScrollScrub(modal); }, 400);
        });
    });
    document.querySelectorAll('.story-modal .modal-close').forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (activeStoryScrubCleanup) { activeStoryScrubCleanup(); activeStoryScrubCleanup = null; }
        });
    });

    /* 22. SKILLS RADAR CHART */
    let radarChartInstance = null;
    const skillRadarData = [
        { label: 'Python', value: 90, projects: 5 },
        { label: 'SQL', value: 85, projects: 4 },
        { label: 'Excel', value: 90, projects: 6 },
        { label: 'Power BI', value: 80, projects: 5 },
        { label: 'Tableau', value: 75, projects: 2 },
        { label: 'Statistics', value: 70, projects: 1 }
    ];
    function getCSSVar(name) {
        return getComputedStyle(document.body).getPropertyValue(name).trim() || '';
    }
    function initRadarChart() {
        const canvas = document.getElementById('skillsRadarChart');
        if (!canvas || typeof Chart === 'undefined') return;
        const isContrast = document.body.classList.contains('contrast-theme');
        const isLight = document.body.classList.contains('light-theme');
        const gridColor = isContrast ? 'rgba(255,255,255,0.32)' : (isLight ? 'rgba(15,23,42,0.1)' : 'rgba(255,255,255,0.09)');
        const labelColor = isContrast ? '#ffffff' : (isLight ? '#0f172a' : '#f8fafc');
        const accent = getCSSVar('--accent-emerald') || '#00f0ff';
        const accent2 = getCSSVar('--accent-blue') || '#b05cff';
        radarChartInstance = new Chart(canvas.getContext('2d'), {
            type: 'radar',
            data: {
                labels: skillRadarData.map(s => s.label),
                datasets: [{
                    label: 'Proficiency',
                    data: skillRadarData.map(s => s.value),
                    backgroundColor: 'rgba(0,240,255,0.16)',
                    borderColor: accent,
                    borderWidth: 2.5,
                    pointBackgroundColor: accent2,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1.5,
                    pointRadius: 6,
                    pointHoverRadius: 11,
                    pointHoverBackgroundColor: accent,
                    pointHoverBorderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1400, easing: 'easeOutQuart' },
                events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove', 'touchend'],
                interaction: { mode: 'nearest', intersect: true },
                scales: {
                    r: {
                        beginAtZero: true, max: 100,
                        ticks: { display: false, stepSize: 25 },
                        grid: { color: gridColor, circular: true },
                        angleLines: { color: gridColor },
                        pointLabels: { color: labelColor, font: { size: 12, weight: '700', family: 'Outfit' } }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(9,14,23,0.96)',
                        borderColor: accent, borderWidth: 1,
                        titleColor: accent, bodyColor: '#f8fafc',
                        padding: 12, displayColors: false,
                        titleFont: { size: 13, weight: '700' },
                        bodyFont: { size: 12, weight: '600' },
                        callbacks: {
                            label: function(ctx) {
                                const skill = skillRadarData[ctx.dataIndex];
                                return [
                                    skill.value + '% Proficiency',
                                    skill.projects + ' project' + (skill.projects === 1 ? '' : 's') + ' made'
                                ];
                            }
                        }
                    }
                }
            }
        });
        window.__radarChartInstance = radarChartInstance;
    }
    function updateRadarChartTheme(mode) {
        if (!radarChartInstance) return;
        const isContrast = mode === 'contrast';
        const isLight = mode === 'light';
        const gridColor = isContrast ? 'rgba(255,255,255,0.32)' : (isLight ? 'rgba(15,23,42,0.1)' : 'rgba(255,255,255,0.09)');
        const labelColor = isContrast ? '#ffffff' : (isLight ? '#0f172a' : '#f8fafc');
        const accent = getCSSVar('--accent-emerald') || '#00f0ff';
        const accent2 = getCSSVar('--accent-blue') || '#b05cff';
        radarChartInstance.options.scales.r.grid.color = gridColor;
        radarChartInstance.options.scales.r.angleLines.color = gridColor;
        radarChartInstance.options.scales.r.pointLabels.color = labelColor;
        radarChartInstance.data.datasets[0].borderColor = accent;
        radarChartInstance.data.datasets[0].pointBackgroundColor = accent2;
        radarChartInstance.data.datasets[0].pointHoverBackgroundColor = accent;
        radarChartInstance.update();
    }
    window.__updateRadarTheme = updateRadarChartTheme;

    const radarSection = document.getElementById('skillsRadarSection');
    let radarInitialized = false;
    if (radarSection) {
        const radarObs = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting && !radarInitialized) {
                radarInitialized = true;
                initRadarChart();
                radarObs.disconnect();
            }
        }, { threshold: 0.15 });
        radarObs.observe(radarSection);
    }

    /* 23. HIRE BAR */
    const hireBar = document.getElementById('hireBar');
    const hireCloseBtn = document.getElementById('hireCloseBtn');
    const hireResumeBtn = document.getElementById('hireResumeBtn');
    let hireDismissed = sessionStorage.getItem('hireBarDismissed') === '1';
    function updateHireBarVisibility() {
        if (!hireBar) return;
        if (hireDismissed) { hireBar.classList.remove('visible'); return; }
        const y = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const nearFooter = y > docHeight - 500;
        if (y > 700 && !nearFooter) hireBar.classList.add('visible');
        else hireBar.classList.remove('visible');
    }
    if (hireBar) {
        window.addEventListener('resize', updateHireBarVisibility, { passive: true });
        setTimeout(updateHireBarVisibility, 500);
    }
    if (hireCloseBtn) {
        hireCloseBtn.addEventListener('click', function() {
            hireBar.classList.remove('visible');
            hireDismissed = true;
            sessionStorage.setItem('hireBarDismissed', '1');
        });
    }
    if (hireResumeBtn) {
        hireResumeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openInteractiveResumeModal();
        });
    }

    /* 24. GITHUB FEED */
    const ghToggle = document.getElementById('githubToggleBtn');
    const ghWidget = document.getElementById('githubFeedWidget');
    const ghBody = document.getElementById('githubFeedBody');
    const fallbackRepos = [
        { name: 'Blinkit_Sales_Analysis_PowerBI', description: 'An interactive Power BI dashboard analyzing Blinkit sales, product categories, outlet performance, location trends, and key business KPIs.', language: 'Power BI', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/ilikemanish/Blinkit_Sales_Analysis_PowerBI' },
        { name: 'Smoking_Health_Risk_Analysis_PowerBI', description: 'An interactive Power BI dashboard analysing 2,500 patient records across smoking exposure, organ condition, and health-risk indicators.', language: 'Power BI', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/ilikemanish/Smoking_Health_Risk_Analysis_PowerBI' },
        { name: 'Netflix-SQL-Data-Analysis', description: 'A PostgreSQL-based analysis exploring content types, ratings, genres, and release trends to answer 15 practical business questions.', language: 'SQL', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/ilikemanish/Netflix-SQL-Data-Analysis' },
        { name: 'Online_Book_Store_Analysis_Using_SQL', description: 'An end-to-end data analysis project using PostgreSQL to analyze books, customers, orders, sales, and inventory.', language: 'SQL', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/ilikemanish/Online_Book_Store_Analysis_Using_SQL' },
        { name: 'Swiggy-Sales-Analysis-Dashboard', description: 'An interactive Microsoft Excel dashboard analyzing Swiggy food delivery data to track revenue and customer preferences.', language: 'HTML', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/Manish-kashyap/Swiggy-Sales-Analysis-Dashboard' },
        { name: 'Decathlon-Retail-Sales-Customer-Analytics-Dashboard', description: 'An interactive Microsoft Excel dashboard analyzing sales performance, customer behavior, and KPIs.', language: 'HTML', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/Manish-kashyap/Decathlon-Retail-Sales-Customer-Analytics-Dashboard' }
    ];
    function getLangColor(lang) {
        const colors = {
            Python: '#3572A5', SQL: '#e38c00', 'Jupyter Notebook': '#DA5B0B',
            JavaScript: '#f1e05a', HTML: '#e34c26', CSS: '#563d7c',
            TypeScript: '#3178c6', PLpgSQL: '#336790', 'Power BI': '#F2C811'
        };
        return colors[lang] || '#00f0ff';
    }
    function escapeHtml(s) {
        if (s === null || s === undefined) return '';
        return String(s).replace(/[&<>"']/g, function(c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function renderRepos(repos) {
        if (!ghBody) return;
        if (!Array.isArray(repos) || !repos.length) {
            ghBody.innerHTML = '<div class="gh-error">No repositories found.</div>';
            return;
        }
        ghBody.innerHTML = repos.map(function(r) {
            const langColor = getLangColor(r.language);
            const lang = r.language ? escapeHtml(r.language) : 'N/A';
            const desc = r.description ? escapeHtml(r.description) : 'No description provided.';
            const name = escapeHtml(r.name);
            const url = escapeHtml(r.html_url || '#');
            const stars = typeof r.stargazers_count === 'number' ? r.stargazers_count : 0;
            const forks = typeof r.forks_count === 'number' ? r.forks_count : 0;
            return '' +
                '<a class="gh-repo" href="' + url + '" target="_blank" rel="noopener noreferrer">' +
                    '<div class="gh-repo-name"><i class="fa-solid fa-bookmark"></i><span>' + name + '</span></div>' +
                    '<div class="gh-repo-desc">' + desc + '</div>' +
                    '<div class="gh-repo-meta">' +
                        '<span class="gh-repo-lang"><span class="gh-lang-dot" style="background:' + langColor + ';"></span>' + lang + '</span>' +
                        '<span class="gh-repo-stat"><i class="fa-regular fa-star"></i>' + stars + '</span>' +
                        '<span class="gh-repo-stat"><i class="fa-solid fa-code-fork"></i>' + forks + '</span>' +
                    '</div>' +
                '</a>';
        }).join('');
    }
    let ghLoaded = false;
    function loadGithubFeed() {
        if (ghLoaded || !ghBody) return;
        ghBody.innerHTML = '<div class="gh-loading"><i class="fa-solid fa-spinner"></i>Loading activity...</div>';
        const controller = new AbortController();
        const t = setTimeout(function() { controller.abort(); }, 7000);
        fetch('https://api.github.com/users/ilikemanish/repos?sort=updated&per_page=6', { signal: controller.signal })
            .then(function(res) {
                clearTimeout(t);
                if (!res.ok) throw new Error('API error ' + res.status);
                return res.json();
            })
            .then(function(data) {
                if (!Array.isArray(data) || !data.length) throw new Error('No repos');
                renderRepos(data.slice(0, 6));
                ghLoaded = true;
            })
            .catch(function() {
                clearTimeout(t);
                renderRepos(fallbackRepos);
                ghLoaded = true;
            });
    }
    if (ghToggle && ghWidget) {
        ghToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = ghWidget.classList.contains('active');
            if (isOpen) {
                ghWidget.classList.remove('active');
                ghToggle.classList.remove('active');
                ghToggle.setAttribute('aria-expanded', 'false');
            } else {
                ghWidget.classList.add('active');
                ghToggle.classList.add('active');
                ghToggle.setAttribute('aria-expanded', 'true');
                loadGithubFeed();
            }
        });
        document.addEventListener('click', function(e) {
            if (!ghWidget.contains(e.target) && !ghToggle.contains(e.target)) {
                if (ghWidget.classList.contains('active')) {
                    ghWidget.classList.remove('active');
                    ghToggle.classList.remove('active');
                    ghToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && ghWidget.classList.contains('active')) {
                ghWidget.classList.remove('active');
                ghToggle.classList.remove('active');
                ghToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* 25. AVAILABILITY BADGE */
    const availabilityConfig = {
        status: 'Open to full-time',
        updated: 'Updated this week'
    };
    const avStatusText = document.getElementById('avStatusText');
    const avUpdatedText = document.getElementById('avUpdatedText');
    if (avStatusText) avStatusText.textContent = availabilityConfig.status;
    if (avUpdatedText) avUpdatedText.textContent = availabilityConfig.updated;
});