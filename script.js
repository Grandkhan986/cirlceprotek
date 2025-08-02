// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    
    // Éléments de navigation
    const navToggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Éléments du formulaire
    const contactForm = document.querySelector('.contact-form');
    
    // Éléments des boutons produits
    const productButtons = document.querySelectorAll('.product-card .btn');
    
    // Menu mobile - déléguer au menu.js si disponible
    if (window.DynamicMenu) {
        // Le menu.js gère déjà la navigation mobile
        console.log('🎯 Navigation mobile gérée par menu.js');
    } else {
        // Fallback si menu.js n'est pas chargé
        setupMobileNavigation(navToggle, mobileNav, mobileNavLinks);
    }
    
    // Gestion des liens actifs selon la section visible
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Mettre à jour les liens de navigation desktop
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });
        
        // Mettre à jour les liens de navigation mobile
        mobileNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    // Écouter le scroll pour mettre à jour la navigation active
    window.addEventListener('scroll', updateActiveNav);
    
    // Smooth scrolling pour tous les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Gestion du formulaire de contact
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les données du formulaire
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Sending message...', 'info');
            
            // Simulate sending delay
            setTimeout(() => {
                showNotification('Your message has been sent successfully! We will respond soon.', 'success');
                contactForm.reset();
            }, 2000);
        });
    }
    
    // Gestion des boutons "Ajouter au panier"
    productButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            // Animation du bouton
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Notification
            showNotification(`${productTitle} (${productPrice}) has been added to cart!`, 'success');
        });
    });
    
    // Fonction pour valider l'email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Fonction pour afficher les notifications
    function showNotification(message, type = 'info') {
        // Créer l'élément de notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Styles de la notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 350px;
            font-weight: 500;
        `;
        
        // Ajouter la notification au body
        document.body.appendChild(notification);
        
        // Animer l'entrée
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Supprimer la notification après 4 secondes
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    // Animation des éléments au scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.news-card, .product-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 50) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initialiser l'animation au scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Initialiser les animations
    animateOnScroll();
    
    // Effet de parallaxe léger pour la section hero
    window.addEventListener('scroll', function() {
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Gestion des liens de navigation externes
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
    
    // Préchargement des images (pour les futures vraies images)
    function preloadImages() {
        const imageUrls = [
            // Ajouter ici les URLs des vraies images quand elles seront disponibles
        ];
        
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
    
    // Initialiser le préchargement
    preloadImages();
    
    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        // Fermer le menu mobile sur redimensionnement
        if (window.innerWidth > 768) {
            navToggle.classList.remove('active');
            mobileNav.classList.remove('active');
        }
        
        // Mettre à jour la navigation active
        updateActiveNav();
    });
    
    // Initialiser la navigation active
    updateActiveNav();
    
    // Gestion du focus pour l'accessibilité
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('using-keyboard');
    });
    
    // Ajouter les styles pour l'accessibilité
    const accessibilityStyles = `
        .using-keyboard *:focus {
            outline: 2px solid #2563eb !important;
            outline-offset: 2px !important;
        }
        
        .notification {
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    // Ajouter les styles au head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = accessibilityStyles;
    document.head.appendChild(styleSheet);
    
    // JavaScript error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        // In production, you might want to send these errors to a monitoring service
    });
    
    // Welcome message in console
    console.log('🚀 CircleProtek site loaded successfully!');
    console.log('💻 Developed with ❤️ for optimal user experience');
    
    // Fonction de fallback pour la navigation mobile
    function setupMobileNavigation(navToggle, mobileNav, mobileNavLinks) {
        if (!navToggle || !mobileNav) return;
        
        // Toggle du menu mobile
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
        
        // Fermer le menu mobile quand on clique sur un lien
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
        
        // Fermer le menu mobile quand on clique en dehors
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !mobileNav.contains(event.target)) {
                navToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });
    }
    
});

// Security Test Questions
const securityQuestions = [
    {
        question: "Do you have security cameras monitoring your home's entry points?",
        options: [
            { text: "Yes, multiple cameras with 24/7 recording", value: 3 },
            { text: "Yes, some cameras but limited coverage", value: 2 },
            { text: "Planning to install soon", value: 1 },
            { text: "No security cameras", value: 0 }
        ]
    },
    {
        question: "How often do you update your home WiFi password?",
        options: [
            { text: "Every 3 months or less", value: 3 },
            { text: "Every 6 months", value: 2 },
            { text: "Once a year", value: 1 },
            { text: "Never or rarely", value: 0 }
        ]
    },
    {
        question: "Do you use a smart home security system?",
        options: [
            { text: "Yes, comprehensive system with monitoring", value: 3 },
            { text: "Yes, basic system without monitoring", value: 2 },
            { text: "Only smart locks or doorbell", value: 1 },
            { text: "No smart security system", value: 0 }
        ]
    },
    {
        question: "How do you manage your family's passwords?",
        options: [
            { text: "Password manager for all accounts", value: 3 },
            { text: "Password manager for important accounts", value: 2 },
            { text: "Written down or memorized", value: 1 },
            { text: "Same password for multiple accounts", value: 0 }
        ]
    },
    {
        question: "Do your children have screen time monitoring?",
        options: [
            { text: "Yes, with content filtering and time limits", value: 3 },
            { text: "Yes, time limits only", value: 2 },
            { text: "Occasional monitoring", value: 1 },
            { text: "No monitoring", value: 0 }
        ]
    },
    {
        question: "How do you secure your home when traveling?",
        options: [
            { text: "Security system, timers, and neighbor check", value: 3 },
            { text: "Security system and timers", value: 2 },
            { text: "Basic precautions (locks, mail hold)", value: 1 },
            { text: "No special precautions", value: 0 }
        ]
    },
    {
        question: "Do you have backup systems for important data?",
        options: [
            { text: "Multiple backups (cloud + physical)", value: 3 },
            { text: "Regular cloud backups", value: 2 },
            { text: "Occasional backups", value: 1 },
            { text: "No backup system", value: 0 }
        ]
    },
    {
        question: "How do you handle suspicious emails or calls?",
        options: [
            { text: "Never click links, verify independently", value: 3 },
            { text: "Usually cautious, sometimes verify", value: 2 },
            { text: "Sometimes fall for convincing scams", value: 1 },
            { text: "Often unsure what's suspicious", value: 0 }
        ]
    },
    {
        question: "Do you have emergency contact and evacuation plans?",
        options: [
            { text: "Written plans practiced regularly", value: 3 },
            { text: "Basic plans discussed with family", value: 2 },
            { text: "Informal understanding only", value: 1 },
            { text: "No specific plans", value: 0 }
        ]
    },
    {
        question: "How secure are your social media privacy settings?",
        options: [
            { text: "Maximum privacy, minimal personal info", value: 3 },
            { text: "Friends only, some personal info", value: 2 },
            { text: "Mixed settings, moderate sharing", value: 1 },
            { text: "Public or default settings", value: 0 }
        ]
    },
    {
        question: "Do you monitor your credit reports and financial accounts?",
        options: [
            { text: "Weekly monitoring with alerts", value: 3 },
            { text: "Monthly monitoring", value: 2 },
            { text: "Quarterly or occasional checks", value: 1 },
            { text: "Rarely or never check", value: 0 }
        ]
    },
    {
        question: "How do you secure your physical mail and packages?",
        options: [
            { text: "Locked mailbox and secure delivery", value: 3 },
            { text: "Prompt pickup and secure storage", value: 2 },
            { text: "Regular pickup but unsecured", value: 1 },
            { text: "Mail left unsecured for days", value: 0 }
        ]
    }
];

let currentQuestionIndex = 0;
let testAnswers = [];
let testScore = 0;

function displayQuestion() {
    const question = securityQuestions[currentQuestionIndex];
    const questionTitle = document.getElementById('questionTitle');
    const questionOptions = document.getElementById('questionOptions');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    const totalQuestionsSpan = document.getElementById('totalQuestions');
    const progressFill = document.getElementById('progressFill');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Update question content
    questionTitle.textContent = question.question;
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    totalQuestionsSpan.textContent = securityQuestions.length;
    
    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / securityQuestions.length) * 100;
    progressFill.style.width = progress + '%';
    
    // Generate options
    questionOptions.innerHTML = '';
    question.options.forEach((option, index) => {
        const label = document.createElement('label');
        label.className = 'option';
        label.innerHTML = `
            <input type="radio" name="question" value="${option.value}">
            <span>${option.text}</span>
        `;
        questionOptions.appendChild(label);
    });
    
    // Restore previous answer if exists
    if (testAnswers[currentQuestionIndex] !== undefined) {
        const savedAnswer = testAnswers[currentQuestionIndex];
        const radioButton = document.querySelector(`input[name="question"][value="${savedAnswer}"]`);
        if (radioButton) {
            radioButton.checked = true;
        }
    }
    
    // Update button states
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.textContent = currentQuestionIndex === securityQuestions.length - 1 ? 'Finish Test' : 'Next';
    
    // Add event listeners to options
    const radioButtons = document.querySelectorAll('input[name="question"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            nextBtn.disabled = false;
        });
    });
    
    // Check if current question is answered
    const isAnswered = testAnswers[currentQuestionIndex] !== undefined;
    nextBtn.disabled = !isAnswered;
}

function nextQuestion() {
    // Save current answer
    const selectedOption = document.querySelector('input[name="question"]:checked');
    if (selectedOption) {
        testAnswers[currentQuestionIndex] = parseInt(selectedOption.value);
    }
    
    // Move to next question or show results
    if (currentQuestionIndex < securityQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        showResults();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function showResults() {
    // Calculate score
    testScore = testAnswers.reduce((sum, answer) => sum + answer, 0);
    const maxScore = securityQuestions.length * 3;
    const percentage = Math.round((testScore / maxScore) * 100);
    
    // Hide test content and show results
    document.querySelector('.test-content').style.display = 'none';
    document.querySelector('.test-progress').style.display = 'none';
    document.getElementById('testResults').style.display = 'block';
    
    // Update results
    document.getElementById('finalScore').textContent = percentage;
    
    // Determine security level and recommendations
    let level, description, recommendations;
    
    if (percentage >= 80) {
        level = 'Excellent';
        description = 'Your family has excellent security practices! You\'re well-protected against most threats.';
        recommendations = [
            'Consider advanced threat monitoring',
            'Regular security system updates',
            'Share your security knowledge with others'
        ];
    } else if (percentage >= 60) {
        level = 'Good';
        description = 'Your family has good security foundations, but there are some areas for improvement.';
        recommendations = [
            'Upgrade to a comprehensive security system',
            'Implement stronger password policies',
            'Add more surveillance coverage',
            'Regular security awareness training'
        ];
    } else if (percentage >= 40) {
        level = 'Fair';
        description = 'Your family security needs significant improvement to adequately protect against threats.';
        recommendations = [
            'Install a complete home security system',
            'Set up password manager for all accounts',
            'Implement regular backup procedures',
            'Create emergency response plans',
            'Improve social media privacy settings'
        ];
    } else {
        level = 'Poor';
        description = 'Your family is at high risk. Immediate action is needed to improve security.';
        recommendations = [
            'Urgently install basic security systems',
            'Change all passwords immediately',
            'Set up financial account monitoring',
            'Create and practice emergency plans',
            'Limit sharing of personal information',
            'Consider professional security consultation'
        ];
    }
    
    // Update result display
    document.getElementById('scoreLevel').textContent = level;
    document.getElementById('resultDescription').textContent = description;
    
    // Update recommendations
    const recommendationList = document.getElementById('recommendationList');
    recommendationList.innerHTML = '';
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        recommendationList.appendChild(li);
    });
    
    // Update score circle color based on level
    const scoreCircle = document.querySelector('.score-circle');
    if (percentage >= 80) {
        scoreCircle.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    } else if (percentage >= 60) {
        scoreCircle.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)';
    } else if (percentage >= 40) {
        scoreCircle.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
    } else {
        scoreCircle.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    }
}

function restartTest() {
    // Reset test state
    currentQuestionIndex = 0;
    testAnswers = [];
    testScore = 0;
    
    // Show test content and hide results
    document.querySelector('.test-content').style.display = 'block';
    document.querySelector('.test-progress').style.display = 'block';
    document.getElementById('testResults').style.display = 'none';
    
    // Display first question
    displayQuestion();
}

// Initialize test when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('questionTitle')) {
        displayQuestion();
    }
}); 