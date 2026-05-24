// ==================== Mobile Menu Toggle ====================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ==================== Smooth Scrolling ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// ==================== Intersection Observer for Animations ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and feature sections
document.querySelectorAll('.what-card, .feature-card, .why-card, .team-card, .bug-report').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ==================== Video Lazy Loading ====================
document.querySelectorAll('video').forEach(video => {
    const playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Video autoplay failed:', error);
        });
    }
});

// ==================== Bug Report Form Handling ====================
const bugForm = document.getElementById('bugReportForm');
const formMessage = document.getElementById('formMessage');

if (bugForm) {
    bugForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Collect form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            device: document.getElementById('device').value,
            android: document.getElementById('android').value,
            type: document.getElementById('type').value,
            feature: document.getElementById('feature').value,
            severity: document.getElementById('severity').value,
            description: document.getElementById('description').value,
            steps: document.getElementById('steps').value,
            expected: document.getElementById('expected').value,
            actual: document.getElementById('actual').value,
            message: document.getElementById('message').value,
            consent: document.getElementById('consent').checked
        };

        // Validate required fields
        if (!formData.name || !formData.email || !formData.device || !formData.android ||
            !formData.type || !formData.feature || !formData.severity || !formData.description) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Disable submit button
        const submitBtn = bugForm.querySelector('.btn-submit');
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';

        try {
            // Send data to backend
            const response = await fetch('send_email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                showFormMessage('✓ Bug report submitted successfully! Thank you for helping improve SecureVault.', 'success');
                bugForm.reset();
                document.getElementById('consent').checked = false;
            } else {
                showFormMessage('Error: ' + (result.message || 'Failed to submit report. Please try again.'), 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showFormMessage('Connection error. Please check your internet and try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';

    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// ==================== Navbar Background on Scroll ====================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 52, 96, 0.98)';
        navbar.style.boxShadow = '0 5px 30px rgba(0, 212, 255, 0.2)';
    } else {
        navbar.style.background = 'rgba(15, 52, 96, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 212, 255, 0.1)';
    }
});

// ==================== Parallax Effect ====================
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;

    // Parallax effect for hero section
    const heroBefore = document.querySelector('.hero::before');
    if (heroBefore) {
        const elements = document.querySelectorAll('.hero');
        elements.forEach(el => {
            if (scrollPosition < 1000) {
                el.style.backgroundPositionY = (scrollPosition * 0.5) + 'px';
            }
        });
    }
});

// ==================== Active Navigation Link ====================
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
            link.style.color = 'var(--accent)';
        } else {
            link.style.color = '';
        }
    });
});

// ==================== Counter Animation ====================
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const startTime = Date.now();

        function updateCount() {
            const currentTime = Date.now() - startTime;
            const progress = Math.min(currentTime / duration, 1);
            const current = Math.floor(target * progress);
            counter.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                counter.textContent = target;
            }
        }

        updateCount();
    });
}

// Trigger counter animation when section comes into view
const statsSection = document.querySelector('.why-choose');
if (statsSection) {
    const statsObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            animateCounters();
            statsObserver.unobserve(statsSection);
        }
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

// ==================== Form Input Validation ====================
const formInputs = document.querySelectorAll('.bug-form input, .bug-form textarea, .bug-form select');

formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.borderColor = 'var(--accent)';
    });

    input.addEventListener('blur', function() {
        this.parentElement.style.borderColor = '';
    });
});

// ==================== Character Count for Textarea ====================
const textareas = document.querySelectorAll('.bug-form textarea');

textareas.forEach(textarea => {
    textarea.addEventListener('input', function() {
        const maxLength = this.getAttribute('maxlength');
        if (maxLength) {
            const remaining = maxLength - this.value.length;
            if (remaining < 50) {
                this.style.borderColor = 'var(--warning)';
            } else {
                this.style.borderColor = '';
            }
        }
    });
});

// ==================== Device Detection ====================
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Adjust download button text based on device
const downloadBtn = document.querySelector('.btn-download');
if (downloadBtn && isMobileDevice()) {
    downloadBtn.addEventListener('click', function(e) {
        // On mobile, allow direct download
        return true;
    });
}

// ==================== Page Load Animation ====================
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    document.body.style.animation = 'fadeIn 0.5s ease';
});

// ==================== Service Worker Registration (Optional) ====================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('Service Worker registration failed:', err);
    });
}

// ==================== Console Messages ====================
console.log('%cSecureVault v1', 'font-size: 20px; color: #00d4ff; font-weight: bold;');
console.log('%cAI-Powered Security Adviser', 'font-size: 14px; color: #00ff88;');
console.log('%cStill Under Development & Testing', 'color: #ffaa00; font-weight: bold;');
console.log('%cReport bugs at: securevaultappofficial@gmail.com', 'color: #00d4ff;');

// ==================== Keyboard Navigation ====================
document.addEventListener('keydown', function(e) {
    // Alt+S to scroll to download section
    if (e.altKey && e.key === 's') {
        document.getElementById('download').scrollIntoView({ behavior: 'smooth' });
        e.preventDefault();
    }

    // Alt+T to scroll to team section
    if (e.altKey && e.key === 't') {
        document.getElementById('team').scrollIntoView({ behavior: 'smooth' });
        e.preventDefault();
    }
});

// ==================== Progress Bar ====================
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(to right, #00d4ff, #00ff88);
    width: 0;
    z-index: 2000;
    transition: width 0.2s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', function() {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

// ==================== Email Validation Enhanced ====================
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ==================== Local Storage for Form Draft ====================
const bugFormFields = ['name', 'email', 'device', 'android', 'description'];

// Load saved form data
bugFormFields.forEach(fieldId => {
    const savedValue = localStorage.getItem(`bugForm_${fieldId}`);
    const field = document.getElementById(fieldId);
    if (field && savedValue) {
        field.value = savedValue;
    }
});

// Save form data as user types
bugFormFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
        field.addEventListener('input', function() {
            localStorage.setItem(`bugForm_${fieldId}`, this.value);
        });
    }
});

// Clear saved form data after successful submission
if (bugForm) {
    bugForm.addEventListener('submit', async function(e) {
        // Original submission code runs...
        // Then after success:
        setTimeout(() => {
            if (formMessage.classList.contains('success')) {
                bugFormFields.forEach(fieldId => {
                    localStorage.removeItem(`bugForm_${fieldId}`);
                });
            }
        }, 100);
    });
}

// ==================== Accessibility: Skip to Content ====================
const skipLink = document.createElement('a');
skipLink.href = '#features';
skipLink.textContent = 'Skip to main content';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--accent);
    color: #000;
    padding: 8px;
    text-decoration: none;
    border-radius: 0 0 4px 0;
    z-index: 100;
`;
skipLink.addEventListener('focus', function() {
    this.style.top = '0';
});
skipLink.addEventListener('blur', function() {
    this.style.top = '-40px';
});
document.body.prepend(skipLink);

// ==================== Dark Mode Toggle (Optional) ====================
function initDarkMode() {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'false') {
        document.body.classList.remove('dark-mode');
    }
}

// Initialize dark mode on page load
initDarkMode();

// ==================== Error Tracking ====================
window.addEventListener('error', function(e) {
    console.error('Error:', e.message, e.filename, e.lineno);
});

window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
});
