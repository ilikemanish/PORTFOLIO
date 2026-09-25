document.addEventListener('DOMContentLoaded', function() {
            
    // 1. PREMIUM LOADER
    setTimeout(function() { 
        const loader = document.getElementById('initialLoader');
        if (loader) loader.classList.add('hidden'); 
        
        AOS.init({ 
            duration: 800, 
            once: true, 
            offset: 50,
            easing: 'ease-out-cubic' 
        });
    }, 600);

    // 2. TIMING-BASED GREETING
    function updateGreeting() {
        const greetingSpan = document.getElementById('dynamicGreeting');
        if (greetingSpan) {
            const hour = new Date().getHours();
            let timeGreeting = 'Good Evening';
            if (hour >= 5 && hour < 12) timeGreeting = 'Good Morning';
            else if (hour >= 12 && hour < 17) timeGreeting = 'Good Afternoon';
            else if (hour >= 17 && hour < 21) timeGreeting = 'Good Evening';
            else timeGreeting = 'Good Night';
            greetingSpan.textContent = timeGreeting;
        }
    }
    updateGreeting();

    // 3. SCROLL DOWN INDICATOR + BACK TO TOP + PROGRESS BAR + HEADER FADE + PARALLAX LOGIC
    const scrollIndicator = document.getElementById('scrollIndicator');
    const backToTop = document.getElementById('backToTop');
    const progressBar = document.getElementById('scrollProgressBar');
    const headerEl = document.getElementById('mainHeader');
    
    const parallaxW1 = document.getElementById('parallax-w1');
    const parallaxW2 = document.getElementById('parallax-w2');
    const parallaxHero = document.getElementById('parallax-hero');
    
    let isScrolling = false;
    
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const currentScrollY = window.scrollY;
                
                if (headerEl) {
                    if (currentScrollY > 10) headerEl.classList.add('scrolled');
                    else headerEl.classList.remove('scrolled');

                    if (currentScrollY > 350) headerEl.classList.add('header-hidden');
                    else headerEl.classList.remove('header-hidden');
                }
                
                if (scrollIndicator) {
                    if (currentScrollY > 50) scrollIndicator.classList.add('hidden');
                    else scrollIndicator.classList.remove('hidden');
                }
                
                if (backToTop) {
                    if (currentScrollY > 500) backToTop.classList.add('visible');
                    else backToTop.classList.remove('visible');
                }
                
                if (progressBar) {
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const pct = docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0;
                    progressBar.style.width = pct + '%';
                }
                
                if (currentScrollY < 800) { 
                    if (parallaxW1) parallaxW1.style.transform = `translateY(${currentScrollY * 0.15}px)`;
                    if (parallaxW2) parallaxW2.style.transform = `translateY(${currentScrollY * -0.1}px)`;
                    if (parallaxHero) parallaxHero.style.transform = `translateY(${currentScrollY * 0.05}px)`;
                }
                
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    // FULL REDIRECT FOR BACK TO TOP BUTTON
    if(backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            history.replaceState(null, null, ' '); // Clean URL Display
        });
    }

    // 4. NEURAL NETWORK PARTICLES JS UPDATE
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
                events: { 
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' }, 
                    resize: true 
                },
                modes: { 
                    grab: { distance: 180, line_linked: { opacity: 0.8 } }, 
                    push: { particles_nb: 4 } 
                }
            },
            retina_detect: true
        });
    }

    // 5. RESUME VIEWER
    const openResumeBtn = document.getElementById('openResumeViewerBtn');
    const resumeModal = document.getElementById('resumeViewerModal');
    if (openResumeBtn && resumeModal) {
        openResumeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            resumeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // 6. SKILLS CLICK TO VIEW PROFICIENCY
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            techItems.forEach(function(other) {
                if (other !== item) {
                    other.classList.remove('active');
                }
            });
            this.classList.toggle('active');
            
            const self = this;
            if (self.classList.contains('active')) {
                setTimeout(function() {
                    self.classList.remove('active');
                }, 2500); 
            }
        });
    });

    // 7. NEW HAMBURGER MENU & DROPDOWN LOGIC
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropLinks = document.querySelectorAll('.drop-link');
    const sections = document.querySelectorAll('section');

    // Toggle menu open/close
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        dropdownMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    dropLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            dropdownMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburgerBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            hamburgerBtn.classList.remove('active');
            dropdownMenu.classList.remove('active');
        }
    });

    // Scrollspy logic to automatically select the active drop-link
    const observerOptions = { root: null, rootMargin: '-30% 0px -50% 0px', threshold: 0 };
    const scrollObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                dropLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    sections.forEach(function(sec) { scrollObserver.observe(sec); });

    // 8. SCROLL-TRIGGERED 3D REVEAL & TERMINAL ANIMATION
    const revealTargets = document.querySelectorAll('.terminal-box, .premium-metric-card, .card-3d-node, .info-premium-node, .mock-dashboard-card, .testimonial-item, .chain-item, .skill-item');
    revealTargets.forEach(function(el) { el.classList.add('reveal-3d'); });
    
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                if (entry.target.classList.contains('terminal-box')) {
                    entry.target.classList.add('aos-animate');
                }
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0, rootMargin: '0px 0px 100px 0px' });
    revealTargets.forEach(function(el) { revealObserver.observe(el); });

    // 9. THEME TOGGLE
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    
    function updateThemeIcon() {
        if (!themeToggleBtn || !themeIcon) return;
        const isLight = document.body.classList.contains('light-theme');
        
        if (isLight) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    if (themeToggleBtn) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') document.body.classList.add('light-theme');
        
        updateThemeIcon();
        
        themeToggleBtn.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
            updateThemeIcon();
        });
    }

    // 10. PORTFOLIO FILTER
    const filterTags = document.querySelectorAll('.filter-tag');
    const boxContainer = document.getElementById('projectPlaceholderBox');
    const mockCards = document.querySelectorAll('.mock-dashboard-card');

    if(filterTags.length > 0) {
        let initialActiveFilter = document.querySelector('.filter-tag.active').getAttribute('data-target');
        mockCards.forEach(function(card) {
            if (card.getAttribute('data-filter') === initialActiveFilter) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });

        filterTags.forEach(function(tag) {
            tag.addEventListener('click', function() {
                let filterTarget = tag.getAttribute('data-target');
                filterTags.forEach(function(t) { t.classList.remove('active'); });
                tag.classList.add('active');
                boxContainer.style.opacity = '0.3';
                setTimeout(function() {
                    mockCards.forEach(function(card) {
                        let cardFilter = card.getAttribute('data-filter');
                        if (cardFilter === filterTarget) {
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

    // 11. MODALS
    const detailBtns = document.querySelectorAll('.btn-details');
    const closeBtns = document.querySelectorAll('.modal-close');
    const modals = document.querySelectorAll('.modal-overlay');

    detailBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const targetModalId = btn.getAttribute('data-modal');
            const targetModal = document.getElementById(targetModalId);
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    closeBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const modal = btn.closest('.modal-overlay');
            if (modal) { closeModal(modal); }
        });
    });

    modals.forEach(function(modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) { closeModal(modal); }
        });
    });

    // 12. METRICS COUNTER
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;
    
    function animateCounters() {
        counters.forEach(function(counter) {
            const target = +counter.getAttribute('data-target');
            const duration = 600; // 600ms = 0.6 seconds stopwatch effect
            let startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                counter.innerText = Math.floor(easeProgress * target);
                
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    counter.innerText = target; 
                }
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
    if (impactSection) { metricsObserver.observe(impactSection); }

    // 13. PREMIUM 3D SLIDER 
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let currentSlide = 0;
    let slideInterval;
    
    function showSlide(index) {
        if (!slides.length) return;
        slides.forEach(function(slide) { slide.classList.remove('active'); });
        currentSlide = index;
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
        if (document.hidden) {
            clearInterval(slideInterval);
        } else {
            startSliderTimer();
        }
    });

    // 14. GLOW CARDS TILT LOGIC
    const cards = document.querySelectorAll('.glow-card:not(.mock-dashboard-card), .premium-metric-card');
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');

            if (card.hasAttribute('data-tilt')) return;

            const midX = rect.width / 2;
            const midY = rect.height / 2;
            const rotateY = ((x - midX) / midX) * 6;
            const rotateX = -((y - midY) / midY) * 6;
            card.style.transform = 'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-2px)';
        });
        card.addEventListener('mouseleave', function() {
            if (card.hasAttribute('data-tilt')) return;
            card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    // 15. COPY EMAIL
    const copyBtn = document.getElementById('copyEmailBtn');
    const emailText = document.getElementById('emailText');
    if (copyBtn && emailText) {
        copyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigator.clipboard.writeText(emailText.innerText).then(function() {
                copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                setTimeout(function() {
                    copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
                }, 2500);
            });
        });
    }

    // 16. GITHUB STATS
    const githubCounter = document.getElementById('githubCounter');
    const githubPlus = document.getElementById('githubPlus');
    const githubText = document.getElementById('githubText');
    
    fetch('https://api.github.com/users/ilikemanish')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.public_repos !== undefined && githubCounter) {
                githubCounter.setAttribute('data-target', data.public_repos);
                if(githubCounter.innerText !== '0') {
                    githubCounter.innerText = data.public_repos;
                }
                githubPlus.style.display = 'none';
                githubText.innerText = 'GitHub Repositories';
            }
        })
        .catch(function() {
            if(githubCounter) {
                githubCounter.setAttribute('data-target', 12);
                githubPlus.style.display = 'none';
                githubText.innerText = 'GitHub Repositories';
            }
        });

    // 17. VANILLA TILT
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.2,
        });
    }

    // 18. ESC key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModals = document.querySelectorAll('.modal-overlay.active');
            activeModals.forEach(function(modal) {
                closeModal(modal);
            });
        }
    });

    // 19. ABOUT PHOTO SUBTLE 3D TILT
    const aboutTiltCard = document.getElementById('aboutTiltCard');
    if (aboutTiltCard && isFinePointer) {
        aboutTiltCard.addEventListener('mousemove', function(e) {
            const rect = aboutTiltCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const midX = rect.width / 2;
            const midY = rect.height / 2;
            const rotateY = ((x - midX) / midX) * 8;
            const rotateX = -((y - midY) / midY) * 8;
            aboutTiltCard.style.transform = 'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        });
        aboutTiltCard.addEventListener('mouseleave', function() {
            aboutTiltCard.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
        });
    }

    // 20. MAGNETIC BUTTONS & SOCIALS & NAV
    const magneticElements = document.querySelectorAll('.btn, .social-links a, .logo');
    if (isFinePointer) {
        magneticElements.forEach(function(el) {
            el.addEventListener('mousemove', function(e) {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.25) + 'px) scale(1.05)';
            });
            el.addEventListener('mouseleave', function() {
                el.style.transform = '';
            });
        });
    }
});