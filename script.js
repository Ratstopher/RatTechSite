// Wait for DOM ;)
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Particles
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ffffff"
            },
            "shape": {
                "type": "circle"
            },
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
                "speed": 6,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false
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
                },
                "resize": true
            }
        },
        "retina_detect": true
    });

    // Smooth Scroll
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            section.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Scroll Animation 
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .stat-item, .testimonial').forEach((el) => {
        observer.observe(el);
    });

    // Counter 
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 200;
        
        const updateCounter = () => {
            const count = +counter.innerText;
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCounter, 1);
            } else {
                counter.innerText = target;
            }
        };
        
        updateCounter();
    });

    // Chat Widg
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

    const testimonialSlider = {
        currentSlide: 0,
        slides: document.querySelectorAll('.testimonial'),
        prevButton: document.querySelector('.slider-nav .prev'),
        nextButton: document.querySelector('.slider-nav .next'),

        init() {
            console.log('Initializing slider');
            console.log('Found slides:', this.slides.length);
            console.log('Prev button:', this.prevButton);
            console.log('Next button:', this.nextButton);

            if (!this.slides.length) {
                console.error('No slides found');
                return;
            }
            
            // Show first slide
            this.showSlide(0);
            
            // Add event listeners
            if (this.prevButton && this.nextButton) {
                this.prevButton.addEventListener('click', () => this.navigate(-1));
                this.nextButton.addEventListener('click', () => this.navigate(1));
                console.log('Event listeners added');
            } else {
                console.error('Navigation buttons not found');
            }
        },

        showSlide(index) {
            console.log('Showing slide:', index);
            // Hide all slides
            this.slides.forEach((slide, i) => {
                slide.style.opacity = '0';
                slide.style.display = 'none';
                console.log(`Slide ${i} hidden`);
            });

            // Show current slide
            this.slides[index].style.display = 'block';
            setTimeout(() => {
                this.slides[index].style.opacity = '1';
                console.log(`Slide ${index} shown`);
            }, 10);
        },

        navigate(direction) {
            console.log('Navigating:', direction);
            this.currentSlide = (this.currentSlide + direction + this.slides.length) % this.slides.length;
            this.showSlide(this.currentSlide);
        }
    };

    testimonialSlider.init();
});

// is it loaded
console.log('Script loaded'); 