// Fonctions exécutées après le chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Définit l'année actuelle dans le footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Initialiser le compte à rebours
    initCountdown();
    
    // Initialiser le défilement doux
    initSmoothScroll();
    
    // Initialiser la FAQ (accordéon)
    initFaq();
    
    // NOTE: La fonctionnalité du header flottant a été commentée car elle a été supprimée du HTML.
    // initFloatingHeader(); 
    
    // Initialiser les animations d'entrée
    initScrollAnimations();
    
    // Démarrer le système de notifications basé sur le défilement
    initSocialProofOnScroll();
    
    // Initialiser le rastreamento de visualização de seção para o Facebook Pixel
    initSectionViewTracking();
});

// Initialise la date de la promotion
setDynamicPromoDate();

// Compte à rebours RÉEL jusqu'à minuit (heure de Paris GMT+2 / Heure d'été)
function initCountdown() {
    const countdownElement = document.getElementById('countdown');
    const countdownFinalElement = document.getElementById('countdown-final');

    function updateRealCountdown() {
        const now = new Date();
        // Utiliser l'heure européenne/parisienne
        const nowParis = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Paris"}));

        const tomorrowParis = new Date(nowParis);
        tomorrowParis.setDate(nowParis.getDate() + 1);
        tomorrowParis.setHours(0, 0, 0, 0); // Prochain minuit à Paris

        const timeLeft = tomorrowParis.getTime() - nowParis.getTime();

        let hours, minutes, seconds, displayText;

        if (timeLeft <= 0) {
            displayText = "OFFRE TERMINÉE !";
            if (countdownElement) countdownElement.classList.add("countdown-ended");
            if (countdownFinalElement) countdownFinalElement.classList.add("countdown-ended");
        } else {
            hours = Math.floor((timeLeft / (1000 * 60 * 60)));
            minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            displayText = 
                `${hours.toString().padStart(2, '0')}:` +
                `${minutes.toString().padStart(2, '0')}:` +
                `${seconds.toString().padStart(2, '0')}`;
        }
        
        if (countdownElement) {
            countdownElement.innerHTML = displayText;
        }
        if (countdownFinalElement) {
            countdownFinalElement.innerHTML = displayText;
        }
    }
    
    updateRealCountdown();
    setInterval(updateRealCountdown, 1000);
}

// Défilement doux pour les liens d'ancrage
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Accordéon pour les questions fréquentes
function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Fermer toutes les autres réponses
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Alterner l'état de la réponse actuelle
            item.classList.toggle('active');
        });
    });
}

// NOTE: La fonctionnalité du header flottant a été commentée car elle a été supprimée du HTML.
// Header flottant
// function initFloatingHeader() {
//     const header = document.getElementById('floating-header');
    
//     if (!header) return;
    
//     window.addEventListener('scroll', () => {
//         if (window.scrollY > 200) {
//             header.classList.add('visible');
//         } else {
//             header.classList.remove('visible');
//         }
//     });
// }

// Animations au défilement de la page
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
    
    function checkScroll() {
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150; // Déclenche l'animation lorsque l'élément est à 150px du bas de la fenêtre
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    
    // Vérifie au chargement
    checkScroll();
    
    // Vérifie au défilement
    window.addEventListener('scroll', checkScroll);
}

// Configure la date de la promotion pour que le dernier jour soit AUJOURD'HUI.
function setDynamicPromoDate() {
    const promoTextElements = document.querySelectorAll('.promo-dates-text');
    // const countdownDateElements = document.querySelectorAll('.current-date'); // Not currently used

    const today = new Date();
    // Ensure the locale is English for date display
    const dayFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric' });
    const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' });

    const todayFormatted = `${dayFormatter.format(today)} ${monthFormatter.format(today)}`;

    if (promoTextElements.length > 0) {
        // Translation and adjustment of the promotion text
        const dynamicDateHTML = 
            `expire <span class="promo-final-day-highlight">TODAY, ${todayFormatted}</span>`;
        
        promoTextElements.forEach(element => {
            element.innerHTML = dynamicDateHTML;
        });
    }

    // Update .current-date if ever used (not found in current HTML for this feature)
    // if (countdownDateElements.length > 0) {
    //     countdownDateElements.forEach(el => el.textContent = todayFormatted);
    // }
}

// Fonction pour démarrer les notifications basée sur le défilement jusqu'à la section du produit
function initSocialProofOnScroll() {
    const productSection = document.getElementById('product');
    if (!productSection) return;

    let notificationsStarted = false; // Flag to ensure notifications only start once

    const checkProductSectionVisibility = () => {
        if (notificationsStarted) return; // If already started, do nothing

        const sectionTop = productSection.getBoundingClientRect().top;
        const sectionBottom = productSection.getBoundingClientRect().bottom;
        const viewportHeight = window.innerHeight;

        // If the section is at least partially visible in the viewport
        if (sectionTop < viewportHeight && sectionBottom > 0) {
            // Start notifications
            getUserCity();
            notificationsStarted = true; // Set flag to true
            // Remove this listener after the first activation to prevent multiple starts
            window.removeEventListener('scroll', checkProductSectionVisibility);
            console.log('Social proof notifications started.');
        }
    };

    // Check visibility on load (in case the section is already visible)
    checkProductSectionVisibility();
    // Add listener to check on scroll
    window.addEventListener('scroll', checkProductSectionVisibility, { passive: true });
}

// Function to get user's city by IP
function getUserCity() {
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            if (data && data.city) {
                startSocialProofNotifications(data.city);
            } else {
                // Default city if unable to get
                startSocialProofNotifications('New York'); // Changed default to a US city
            }
        })
        .catch(error => {
            console.error('Error fetching location:', error);
            // Use default city in case of error
            startSocialProofNotifications('New York'); // Changed default to a US city
        });
}

// List of common female names in the US
const femaleNames = [
    'Mary Smith', 'Patricia Johnson', 'Jennifer Williams', 'Linda Brown',
    'Elizabeth Jones', 'Barbara Garcia', 'Susan Miller', 'Jessica Davis',
    'Sarah Rodriguez', 'Karen Martinez', 'Nancy Hernandez', 'Lisa Lopez',
    'Betty Gonzalez', 'Dorothy Wilson', 'Sandra Anderson', 'Ashley Thomas',
    'Kimberly Taylor', 'Donna Moore', 'Emily Martin', 'Michelle Jackson',
    'Amanda Lee', 'Melissa Perez', 'Deborah Thompson', 'Stephanie White', 
    'Laura Harris', 'Rebecca Clark', 'Sharon Lewis', 'Cynthia Robinson',
    'Kathleen Walker', 'Amy Young', 'Shirley Allen', 'Angela King'
];

// List of time periods (translated to English)
const timePeriods = [
    '1 minute ago',
    '2 minutes ago',
    '5 minutes ago',
    '7 minutes ago',
    '12 minutes ago',
    '15 minutes ago',
    '20 minutes ago',
    '30 minutes ago',
    'a few minutes ago'
];

// Function to start social proof notifications
function startSocialProofNotifications(city) {
    // Show first notification after 10 seconds
    setTimeout(() => showSocialProofNotification(city), 10000);

    // Show subsequent notifications every 20 to 35 seconds
    setInterval(() => {
        showSocialProofNotification(city);
    }, Math.random() * 15000 + 20000); // Random interval between 20s and 35s
}

// Function to display a social proof notification
function showSocialProofNotification(city) {
    const notificationElement = document.getElementById('socialProofNotification');
    const messageElement = document.getElementById('notificationMessage');
    const timeElement = document.getElementById('notificationTime');

    if (!notificationElement || !messageElement || !timeElement) {
        console.error('Notification elements not found.');
        return;
    }

    // Choose a random name, message, and time period
    const randomName = femaleNames[Math.floor(Math.random() * femaleNames.length)];
    const randomTime = timePeriods[Math.floor(Math.random() * timePeriods.length)];
    
    // Construct the message in English
    // Example: "Jennifer Williams from New York just got her ECONOMICAL MARRIAGE PROTOCOL 7K."
    messageElement.textContent = `${randomName} from ${city} just got their ECONOMICAL MARRIAGE PROTOCOL 7K.`;
    timeElement.textContent = randomTime;

    // Display the notification
    notificationElement.classList.add('show');

    // Hide the notification after 7 seconds
    setTimeout(() => {
        notificationElement.classList.remove('show');
    }, 7000);
}

// Function to close the social proof notification (called by the 'x' button)
function closeSocialProof() {
    const notificationElement = document.getElementById('socialProofNotification');
    if (notificationElement) {
        notificationElement.classList.remove('show');
    }
}

// Assurez-vous que le header flottant est commenté ou supprimé s'il n'est plus dans le HTML
// pour éviter des erreurs si la fonction initFloatingHeader est décommentée par erreur.
// document.addEventListener('DOMContentLoaded', function() {
//    const floatingHeader = document.getElementById('floating-header');
//    if (!floatingHeader) {
//        console.warn("Element 'floating-header' not found. If not intentional, check your HTML or initFloatingHeader function.");
//    }
// }); 

// Rastreamento de Visualização de Seção para o Facebook Pixel
function initSectionViewTracking() {
    const sections = document.querySelectorAll('section[id]');
    const trackedSectionsFB = new Set(); // To track sections already viewed by Facebook Pixel
    const trackedSectionsGA4 = new Set(); // To track sections already viewed by GA4
    const trackedAddToCartGA4 = new Set(); // To track if add_to_cart for pricing has already been sent

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.5 // 50% of the section visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;

                // Facebook Pixel Tracking
                if (typeof fbq !== 'undefined' && !trackedSectionsFB.has(sectionId)) {
                    fbq('trackCustom', 'ViewSection', { section_id: sectionId });
                    console.log(`Facebook Pixel: ViewSection - ${sectionId}`);
                    trackedSectionsFB.add(sectionId);
                }

                // GA4 Tracking - view_section
                if (typeof gtag !== 'undefined' && !trackedSectionsGA4.has(sectionId)) {
                    gtag('event', 'view_section', {
                        'section_id': sectionId
                    });
                    console.log(`GA4: view_section - ${sectionId}`);
                    trackedSectionsGA4.add(sectionId);
                }

                // GA4 Tracking - add_to_cart for pricing section
                if (sectionId === 'pricing' && typeof gtag !== 'undefined' && !trackedAddToCartGA4.has(sectionId)) {
                    gtag('event', 'add_to_cart', {
                        // Você pode adicionar parâmetros de item aqui se desejar, por exemplo:
                        // 'currency': 'EUR',
                        // 'value': 19.90, // Exemplo de valor, ajuste conforme necessário
                        // 'items': [{
                        // 'item_id': 'PLAN_COMPLET',
                        // 'item_name': 'Plan Complet - Mariage Économique'
                        // }]
                    });
                    console.log('GA4: add_to_cart (triggered by viewing pricing section)');
                    trackedAddToCartGA4.add(sectionId); // Garante que add_to_cart para pricing seja enviado apenas uma vez
                }
                
                // Opcional: parar de observar esta seção após o rastreamento para economizar recursos
                // if (trackedSectionsFB.has(sectionId) && trackedSectionsGA4.has(sectionId)) {
                //     if (sectionId === 'pricing' && trackedAddToCartGA4.has(sectionId)) {
                // observer.unobserve(entry.target);
                //     } else if (sectionId !== 'pricing') {
                // observer.unobserve(entry.target);
                //     }
                // }
            }
        });
    };

    const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
} 