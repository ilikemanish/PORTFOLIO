document.addEventListener('DOMContentLoaded', function() {
    
    // 1. LOADER - Hide after 0.3s
    window.addEventListener('load', function() {
        const loader = document.getElementById('initialLoader');
        setTimeout(function() { 
            loader.classList.add('hidden'); 
        }, 300);
    });

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

    // 3. SKILLS CLICK TO VIEW PROFICIENCY
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
                    if (cardFilter === filterTarget