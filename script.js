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
    // const countdownDateElements = document.querySelectorAll('.current-date'); // Non utilisé actuellement

    const today = new Date();
    // S'assurer que la locale est française pour l'affichage des dates
    const dayFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric' });
    const monthFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'long' });

    const todayFormatted = `${dayFormatter.format(today)} ${monthFormatter.format(today)}`;

    if (promoTextElements.length > 0) {
        // Traduction et ajustement du texte de la promotion
        const dynamicDateHTML = 
            `expirent <span class="promo-final-day-highlight">AUJOURD'HUI, ${todayFormatted}</span>`;
        
        promoTextElements.forEach(element => {
            element.innerHTML = dynamicDateHTML;
        });
    }

    // Mettre à jour .current-date si jamais utilisé (pas trouvé dans le HTML actuel pour cette fonctionnalité)
    // if (countdownDateElements.length > 0) {
    //     countdownDateElements.forEach(el => el.textContent = todayFormatted);
    // }
}

// Fonction pour démarrer les notifications basée sur le défilement jusqu'à la section du produit
function initSocialProofOnScroll() {
    const productSection = document.getElementById('product');
    if (!productSection) return;

    let notificationsStarted = false; // Drapeau pour s'assurer que les notifications ne démarrent qu'une fois

    const checkProductSectionVisibility = () => {
        if (notificationsStarted) return; // Si déjà démarré, ne rien faire

        const sectionTop = productSection.getBoundingClientRect().top;
        const sectionBottom = productSection.getBoundingClientRect().bottom;
        const viewportHeight = window.innerHeight;

        // Si la section est au moins partiellement visible dans la fenêtre d'affichage
        if (sectionTop < viewportHeight && sectionBottom > 0) {
            // Démarrer les notifications
            getUserCity();
            notificationsStarted = true; // Mettre le drapeau à vrai
            // Supprimer cet écouteur après la première activation pour éviter les démarrages multiples
            window.removeEventListener('scroll', checkProductSectionVisibility);
            console.log('Notifications de preuve sociale démarrées.');
        }
    };

    // Vérifier la visibilité au chargement (au cas où la section serait déjà visible)
    checkProductSectionVisibility();
    // Ajouter un écouteur pour vérifier lors du défilement
    window.addEventListener('scroll', checkProductSectionVisibility, { passive: true });
}

// Fonction pour obtenir la ville de l'utilisateur par IP
function getUserCity() {
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            if (data && data.city) {
                startSocialProofNotifications(data.city);
            } else {
                // Ville par défaut si impossible à obtenir
                startSocialProofNotifications('Paris');
            }
        })
        .catch(error => {
            console.error('Erreur lors de l\'obtention de la localisation:', error);
            // Utiliser la ville par défaut en cas d'erreur
            startSocialProofNotifications('Paris');
        });
}

// Liste de prénoms féminins communs (déjà en français)
const femaleNames = [
    'Marie Dubois', 'Sophie Bernard', 'Claire Garcia', 'Anne Martin',
    'Nathalie Petit', 'Isabelle Thomas', 'Caroline Robert', 'Stéphanie Duval',
    'Sandrine Moreau', 'Virginie Laurent', 'Émilie Roussel', 'Laurence Nicolas',
    'Valérie Garnier', 'Christine Faure', 'Sylvie Lefevre', 'Françoise Andre',
    'Catherine Leroy', 'Martine Roux', 'Véronique Simon', 'Agnès Lambert'
];

// Liste des périodes (traduites en français)
const timePeriods = [
    'il y a 1 minute',
    'il y a 2 minutes',
    'il y a 5 minutes',
    'il y a 7 minutes',
    'il y a 12 minutes',
    'il y a 15 minutes',
    'il y a 20 minutes',
    'il y a 30 minutes',
    'il y a quelques minutes'
];

// Fonction pour démarrer les notifications de preuve sociale
function startSocialProofNotifications(city) {
    // Afficher la première notification après 10 secondes
    setTimeout(() => showSocialProofNotification(city), 10000);

    // Afficher les notifications suivantes toutes les 20 à 35 secondes
    setInterval(() => {
        showSocialProofNotification(city);
    }, Math.random() * 15000 + 20000); // Intervalle aléatoire entre 20s et 35s
}

// Fonction pour afficher une notification de preuve sociale
function showSocialProofNotification(city) {
    const notificationElement = document.getElementById('socialProofNotification');
    const messageElement = document.getElementById('notificationMessage');
    const timeElement = document.getElementById('notificationTime');

    if (!notificationElement || !messageElement || !timeElement) {
        console.error('Éléments de notification non trouvés.');
        return;
    }

    // Choisir un nom, un message et une période aléatoires
    const randomName = femaleNames[Math.floor(Math.random() * femaleNames.length)];
    const randomTime = timePeriods[Math.floor(Math.random() * timePeriods.length)];
    
    // Construire le message
    // Exemple : "Virginie Laurent de Paris vient d'acquérir son Protocole de mariage économique 7k"
    messageElement.textContent = `${randomName} de ${city} vient d'acquérir son Protocole de mariage économique 7k.`;
    timeElement.textContent = randomTime;

    // Afficher la notification
    notificationElement.classList.add('show');

    // Masquer la notification après 7 secondes
    setTimeout(() => {
        notificationElement.classList.remove('show');
    }, 7000);
}

// Fonction pour fermer la notification de preuve sociale (appelée par le bouton 'x')
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
//        console.warn("L'élément 'floating-header' n'a pas été trouvé. Si ce n'est pas intentionnel, vérifiez votre HTML ou la fonction initFloatingHeader.");
//    }
// }); 

// Rastreamento de Visualização de Seção para o Facebook Pixel
function initSectionViewTracking() {
    const sections = document.querySelectorAll('section[id]');
    const trackedSectionsFB = new Set(); // Para rastrear seções já vistas pelo Facebook Pixel
    const trackedSectionsGA4 = new Set(); // Para rastrear seções já vistas pelo GA4
    const trackedAddToCartGA4 = new Set(); // Para rastrear se o add_to_cart para pricing já foi enviado

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.5 // 50% da seção visível
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;

                // Rastreamento do Facebook Pixel
                if (typeof fbq !== 'undefined' && !trackedSectionsFB.has(sectionId)) {
                    fbq('trackCustom', 'ViewSection', { section_id: sectionId });
                    console.log(`Facebook Pixel: ViewSection - ${sectionId}`);
                    trackedSectionsFB.add(sectionId);
                }

                // Rastreamento do GA4 - view_section
                if (typeof gtag !== 'undefined' && !trackedSectionsGA4.has(sectionId)) {
                    gtag('event', 'view_section', {
                        'section_id': sectionId
                    });
                    console.log(`GA4: view_section - ${sectionId}`);
                    trackedSectionsGA4.add(sectionId);
                }

                // Rastreamento do GA4 - add_to_cart para a seção pricing
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