document.addEventListener('DOMContentLoaded', function() {
    
    // 1. PREMIUM LOADER
    setTimeout(function() { 
        const loader = document.getElementById('initialLoader');
        if (loader) loader.classList.add('hidden'); 
    }, 300);

    // Initialize AOS
    AOS.init({ duration: 300, once: true, offset: 10 });

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

    // 3. SCROLL DOWN INDICATOR + BACK TO TOP + PROGRESS BAR + HEADER SHADOW
    const scrollIndicator = document.getElementById('scrollIndicator');
    const backToTop = document.getElementById('backToTop');
    const progressBar = document.getElementById('scrollProgressBar');
    const headerEl = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        if (scrollIndicator) {
            if (scrollY > 50) scrollIndicator.classList.add('hidden');
            else scrollIndicator.classList.remove('hidden');
        }
        if (backToTop) {
            if (scrollY > 500) backToTop.classList.add('visible');
            else backToTop.classList.remove('visible');
        }
        if (headerEl) {
            if (scrollY > 10) headerEl.classList.add('scrolled');
            else headerEl.classList.remove('scrolled');
        }
        if (progressBar) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
            progressBar.style.width = pct + '%';
        }
    }, { passive: true });

    // 4. GLOBAL PARTICLES - NEURAL NETWORK STYLE
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 1000 } },
                color: { value: '#00f5a0' },
                shape: { type: 'circle' },
                opacity: { 
                    value: 0.4, 
                    random: true, 
                    anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } 
                },
                size: { 
                    value: 3, 
                    random: true, 
                    anim: { enable: false } 
                },
                line_linked: { 
                    enable: true, 
                    distance: 150, 
                    color: '#0079ff', 
                    opacity: 0.3, 
                    width: 1 
                },
                move: { 
                    enable: true, 
                    speed: 1.5, 
                    direction: 'none', 
                    random: true, 
                    straight: false, 
                    out_mode: 'out', 
                    bounce: false 
                }
            },
            interactivity: {
                detect_on: 'window',
                events: { 
                    onhover: { enable: true, mode: 'repulse' }, 
                    onclick: { enable: true, mode: 'push' }, 
                    resize: true 
                },
                modes: { 
                    repulse: { distance: 100, duration: 0.4 }, 
                    push: { particles_nb: 3 } 
                }
            },
            retina_detect: true
        });
    }

    // 5. SKILLS CLICK TO VIEW PROFICIENCY (3D flip)
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
                }, 1400);
            }
        });
    });

    // 6. RESUME VIEWER
    const openResumeBtn = document.getElementById('openResumeViewerBtn');
    const resumeModal = document.getElementById('resumeViewerModal');
    if (openResumeBtn && resumeModal) {
        openResumeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            resumeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // 7. SCROLLSPY NAVIGATION
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const observerOptions = { root: null, rootMargin: '-30% 0px -50% 0px', threshold: 0 };
    const scrollObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    sections.forEach(function(sec) { scrollObserver.observe(sec); });

    // 8. SCROLL-TRIGGERED 3D REVEAL
    const revealTargets = document.querySelectorAll('.metric-card, .card-3d-node, .info-premium-node, .mock-dashboard-card, .testimonial-item');
    revealTargets.forEach(function(el) { el.classList.add('reveal-3d'); });
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealTargets.forEach(function(el) { revealObserver.observe(el); });

    // 9. THEME TOGGLE
    const themeToggle = document.getElementById('themeToggle');
    function updateThemeIcon() {
        if (!themeToggle) return;
        themeToggle.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
    }
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') document.body.classList.add('light-theme');
        updateThemeIcon();
        themeToggle.addEventListener('click', function() {
            themeToggle.classList.add('animating');
            document.body.classList.toggle('light-theme');
            localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
            updateThemeIcon();
            setTimeout(function() { themeToggle.classList.remove('animating'); }, 500);
        });
    }

    // 10. PORTFOLIO FILTER
    const filterTags = document.querySelectorAll('.filter-tag');
    const boxContainer = document.getElementById('projectPlaceholderBox');
    const mockCards = document.querySelectorAll('.mock-dashboard-card');

    if(filterTags.length > 0) {
        var initialActiveFilter = document.querySelector('.filter-tag.active').getAttribute('data-target');
        mockCards.forEach(function(card) {
            if (card.getAttribute('data-filter') === initialActiveFilter) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });

        filterTags.forEach(function(tag) {
            tag.addEventListener('click', function() {
                var filterTarget = tag.getAttribute('data-target');
                filterTags.forEach(function(t) { t.classList.remove('active'); });
                tag.classList.add('active');
                boxContainer.style.opacity = '0.3';
                setTimeout(function() {
                    mockCards.forEach(function(card) {
                        var cardFilter = card.getAttribute('data-filter');
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
    var detailBtns = document.querySelectorAll('.btn-details');
    var closeBtns = document.querySelectorAll('.modal-close');
    var modals = document.querySelectorAll('.modal-overlay');

    detailBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var targetModalId = btn.getAttribute('data-modal');
            var targetModal = document.getElementById(targetModalId);
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
            var modal = btn.closest('.modal-overlay');
            if (modal) { closeModal(modal); }
        });
    });

    modals.forEach(function(modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) { closeModal(modal); }
        });
    });

    // 12. METRICS COUNTER
    var counters = document.querySelectorAll('.counter');
    var animationDuration = 1500;
    
    function animateCounters() {
        counters.forEach(function(counter) {
            var target = +counter.getAttribute('data-target');
            var startTime = null;
            function updateCount(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / animationDuration, 1);
                var current = Math.floor(progress * target);
                counter.innerText = current;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target;
                }
            }
            requestAnimationFrame(updateCount);
        });
    }

    var metricsObserver = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
            animateCounters();
            metricsObserver.disconnect();
        }
    }, { threshold: 0.3 });
    var impactSection = document.querySelector('.impact-section');
    if (impactSection) { metricsObserver.observe(impactSection); }

    // 13. SLIDER
    var slides = document.querySelectorAll('.slide');
    var prevBtn = document.getElementById('prevSlide');
    var nextBtn = document.getElementById('nextSlide');
    var currentSlide = 0;
    var slideInterval;
    
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
    
    function startSliderTimer() { slideInterval = setInterval(nextSlideFn, 5000); }
    function resetSliderTimer() { clearInterval(slideInterval); startSliderTimer(); }
    startSliderTimer();

    // 14. GLOW CARDS
    var cards = document.querySelectorAll('.glow-card:not(.mock-dashboard-card)');
    var isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');

            if (card.hasAttribute('data-tilt')) return;

            var midX = rect.width / 2;
            var midY = rect.height / 2;
            var rotateY = ((x - midX) / midX) * 6;
            var rotateX = -((y - midY) / midY) * 6;
            card.style.transform = 'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-2px)';
        });
        card.addEventListener('mouseleave', function() {
            if (card.hasAttribute('data-tilt')) return;
            card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    // 15. COPY EMAIL
    var copyBtn = document.getElementById('copyEmailBtn');
    var emailText = document.getElementById('emailText');
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
    var githubCounter = document.getElementById('githubCounter');
    var githubPlus = document.getElementById('githubPlus');
    var githubText = document.getElementById('githubText');
    
    fetch('https://api.github.com/users/Manish-kashyap')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.public_repos && githubCounter) {
                githubCounter.setAttribute('data-target', data.public_repos);
                githubCounter.innerText = '0';
                githubPlus.style.display = 'none';
                githubText.innerText = 'GitHub Repositories';
                var newObserver = new IntersectionObserver(function(entries) {
                    if (entries[0].isIntersecting) {
                        animateCounters();
                        newObserver.disconnect();
                    }
                }, { threshold: 0.3 });
                if (impactSection) newObserver.observe(impactSection);
            }
        })
        .catch(function() {
            if(githubCounter) {
                githubCounter.setAttribute('data-target', 12);
                githubCounter.innerText = '0';
                githubPlus.style.display = 'none';
                githubText.innerText = 'GitHub Repositories';
            }
        });

    // 17. VANILLA TILT
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]:not(.mock-dashboard-card)'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.2,
        });
    }

    // 18. ESC key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            var activeModals = document.querySelectorAll('.modal-overlay.active');
            activeModals.forEach(function(modal) {
                closeModal(modal);
            });
        }
    });

    // 19. HERO PHOTO 3D PARALLAX ON MOUSE MOVE
    var heroImageContainer = document.querySelector('.hero-image-container');
    var heroPhotoCard = document.getElementById('heroPhotoCard');
    if (heroImageContainer && heroPhotoCard && isFinePointer) {
        heroImageContainer.addEventListener('mousemove', function(e) {
            var rect = heroImageContainer.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var midX = rect.width / 2;
            var midY = rect.height / 2;
            var rotateY = ((x - midX) / midX) * 12;
            var rotateX = -((y - midY) / midY) * 12;
            heroPhotoCard.style.animation = 'none';
            heroPhotoCard.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
        });
        heroImageContainer.addEventListener('mouseleave', function() {
            heroPhotoCard.style.transform = '';
            heroPhotoCard.style.animation = 'heroFloat 6s ease-in-out infinite';
        });
    }

    // 20. ABOUT PHOTO SUBTLE 3D TILT
    var aboutTiltCard = document.getElementById('aboutTiltCard');
    if (aboutTiltCard && isFinePointer) {
        aboutTiltCard.addEventListener('mousemove', function(e) {
            var rect = aboutTiltCard.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var midX = rect.width / 2;
            var midY = rect.height / 2;
            var rotateY = ((x - midX) / midX) * 8;
            var rotateX = -((y - midY) / midY) * 8;
            aboutTiltCard.style.transform = 'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        });
        aboutTiltCard.addEventListener('mouseleave', function() {
            aboutTiltCard.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
        });
    }

    // 21. MAGNETIC BUTTONS
    var magneticBtns = document.querySelectorAll('.btn');
    if (isFinePointer) {
        magneticBtns.forEach(function(btn) {
            btn.addEventListener('mousemove', function(e) {
                var rect = btn.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.18) + 'px, ' + (y * 0.35) + 'px) translateY(-3px) scale(1.02)';
            });
            btn.addEventListener('mouseleave', function() {
                btn.style.transform = '';
            });
        });
    }
});