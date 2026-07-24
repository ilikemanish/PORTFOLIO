document.addEventListener('DOMContentLoaded', function() {
    
    // 1. EXACT 0.4s LOADER
    window.addEventListener('load', function() {
        const loader = document.getElementById('initialLoader');
        setTimeout(function() { loader.classList.add('hidden'); }, 400);
    });

    AOS.init({ duration: 300, once: true, offset: 10 });

    // 2. TIMING-BASED GREETING
    const greetingSpan = document.getElementById('dynamicGreeting');
    if (greetingSpan) {
        const hour = new Date().getHours();
        let timeGreeting = 'Good evening';
        if (hour < 12) timeGreeting = 'Good morning';
        else if (hour < 18) timeGreeting = 'Good afternoon';
        greetingSpan.innerText = timeGreeting;
    }

    // 3. SKILLS CLICK TO VIEW PROFICIENCY - Show for 0.3 sec then auto-hide
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            // Remove active class from all other tech items
            techItems.forEach(function(other) {
                if (other !== item) {
                    other.classList.remove('active');
                }
            });
            // Toggle active on clicked item
            this.classList.toggle('active');
            
            // Auto remove after 0.3 seconds (300ms) if still active
            const self = this;
            if (self.classList.contains('active')) {
                setTimeout(function() {
                    self.classList.remove('active');
                }, 300);
            }
        });
    });

    // 4. RESUME VIEWER
    const openResumeBtn = document.getElementById('openResumeViewerBtn');
    const resumeModal = document.getElementById('resumeViewerModal');

    if (openResumeBtn && resumeModal) {
        openResumeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            resumeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // 5. SCROLLSPY NAVIGATION
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

    // 6. PARTICLES.JS
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

    // 7. THEME TOGGLE
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

    // 8. PORTFOLIO FILTER
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

    // 9. MODALS
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
            var modal = btn.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    modals.forEach(function(modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // 10. METRICS COUNTER
    var counters = document.querySelectorAll('.counter');
    var speed = 100;
    function animateCounters() {
        counters.forEach(function(counter) {
            function updateCount() {
                var target = +counter.getAttribute('data-target');
                var count = +counter.innerText;
                var inc = target / speed;
                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            }
            updateCount();
        });
    }

    var metricsObserver = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
            animateCounters();
            metricsObserver.disconnect();
        }
    }, { threshold: 0.5 });
    var impactSection = document.querySelector('.impact-section');
    if (impactSection) {
        metricsObserver.observe(impactSection);
    }

    // 11. SLIDER
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

    // 12. CURSOR
    var cursor = document.getElementById('customCursor');
    if (window.innerWidth > 768 && cursor) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        var clickables = document.querySelectorAll('a, button, .glow-card, input, textarea, .tech-item, .project-link-btn, .copy-btn');
        clickables.forEach(function(el) {
            el.addEventListener('mouseenter', function() { cursor.classList.add('hover'); });
            el.addEventListener('mouseleave', function() { cursor.classList.remove('hover'); });
        });
    }

    // 13. GLOW CARDS
    var cards = document.querySelectorAll('.glow-card');
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

    // 15. GITHUB STATS (Static fallback)
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
                }, { threshold: 0.5 });
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
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.2,
        });
    }

});