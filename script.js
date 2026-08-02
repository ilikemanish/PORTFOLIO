document.addEventListener('DOMContentLoaded', function() {
    
    // 1. PREMIUM LOADER - Disappears 0.4s after execution
    setTimeout(function() { 
        const loader = document.getElementById('initialLoader');
        if (loader) loader.classList.add('hidden'); 
    }, 400);

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

    // 3. SCROLL DOWN INDICATOR LOGIC
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            // Hide when scrolled more than 50px
            if (window.scrollY > 50) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        });
    }

    // 4. SKILLS CLICK TO VIEW PROFICIENCY
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
                }, 300);
            }
        });
    });

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

    // 6. SCROLLSPY NAVIGATION
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

    // 7. PARTICLES.JS
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 800 } },
                color: { value: '#00f5a0' }, shape: { type: 'circle' },
                opacity: { value: 0.5, random: false }, size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#0079ff', opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
                modes: { grab: { distance: 140, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
            },
            retina_detect: true,
        });
    }

    // 8. THEME TOGGLE
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

    // 9. PORTFOLIO FILTER
    const filterTags = document.querySelectorAll('.filter-tag');
    const boxContainer = document.getElementById('projectPlaceholderBox');
    const mockCards = document.querySelectorAll('.mock-dashboard-card');

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
                    } else {
                        card.style.display = 'none';
                    }
                });
                boxContainer.style.opacity = '1';
            }, 250);
        });
    });

    // 10. MODALS
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

    // 11. METRICS COUNTER
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

    // 12. SLIDER
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

    // 13. GLOW CARDS
    var cards = document.querySelectorAll('.glow-card:not(.mock-dashboard-card)');
    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
        });
    });

    // 14. COPY EMAIL
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

    // 15. GITHUB STATS
    var githubCounter = document.getElementById('githubCounter');
    var githubPlus = document.getElementById('githubPlus');
    var githubText = document.getElementById('githubText');
    
    fetch('https://api.github.com/users/Manish-kashyap')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.public_repos) {
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
            githubCounter.setAttribute('data-target', 12);
            githubCounter.innerText = '0';
            githubPlus.style.display = 'none';
            githubText.innerText = 'GitHub Repositories';
        });

    // 16. VANILLA TILT
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]:not(.mock-dashboard-card)'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.2,
        });
    }

    // 17. ESC key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            var activeModals = document.querySelectorAll('.modal-overlay.active');
            activeModals.forEach(function(modal) {
                closeModal(modal);
            });
        }
    });
});
