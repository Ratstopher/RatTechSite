// Wait for DOM ;)
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Initialize all components
    initParticles();
    initSmoothScroll();
    initScrollAnimations();
    initCounters();
    initChatWidget();
    initTestimonialSlider();
});

// Particles Animation
function initParticles() {
    if (!document.getElementById('particles-js')) return;
    
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 80 },
            "color": { "value": "#ffffff" },
            "shape": { "type": "circle" },
            "opacity": {
                "value": 0.5,
                "random": false
            },
            "size": {
                "value": 3,
                "random": true
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#ffffff",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 6
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "repulse"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                }
            }
        }
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el);
    });
}

// Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const increment = target / 200;
        
        function updateCounter() {
            const current = parseFloat(counter.innerText);
            if (current < target) {
                counter.innerText = (current + increment).toFixed(1);
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target;
            }
        }
        
        updateCounter();
    });
}

// Chat Widget
function initChatWidget() {
    const chatToggle = document.querySelector('.chat-toggle');
    const chatBox = document.querySelector('.chat-box');
    const closeChat = document.querySelector('.close-chat');

    if (chatToggle && chatBox && closeChat) {
        chatToggle.addEventListener('click', () => {
            chatBox.classList.toggle('hidden');
        });

        closeChat.addEventListener('click', () => {
            chatBox.classList.add('hidden');
        });
    }
}

// Testimonial Slider
function initTestimonialSlider() {
    const slider = {
        currentSlide: 0,
        slides: document.querySelectorAll('.testimonial'),
        prevButton: document.querySelector('.slider-nav .prev'),
        nextButton: document.querySelector('.slider-nav .next'),

        init() {
            if (!this.slides.length) return;
            
            this.showSlide(0);
            
            if (this.prevButton && this.nextButton) {
                this.prevButton.addEventListener('click', () => this.navigate(-1));
                this.nextButton.addEventListener('click', () => this.navigate(1));
            }

            // Auto-advance slides
            setInterval(() => this.navigate(1), 5000);
        },

        showSlide(index) {
            this.slides.forEach(slide => {
                slide.classList.remove('active');
            });
            this.slides[index].classList.add('active');
        },

        navigate(direction) {
            this.currentSlide = (this.currentSlide + direction + this.slides.length) % this.slides.length;
            this.showSlide(this.currentSlide);
        }
    };

    slider.init();
}

// is it loaded
console.log('Script loaded'); 