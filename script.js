// Funções executadas após o carregamento da página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar contador regressivo
    initCountdown();
    
    // Inicializar smooth scroll
    initSmoothScroll();
    
    // Inicializar FAQ (acordeão)
    initFaq();
    
    // Mostrar header flutuante após rolagem
    initFloatingHeader();
    
    // Inicializar animações de entrada
    initScrollAnimations();
    
    // Iniciar o sistema de notificações
    getUserCity();
});

// Inicializa a data da promoção
setDynamicPromoDate();

// Contador regressivo REAL até a meia-noite (Horário de Brasília GMT-3)
function initCountdown() {
    const countdownElement = document.getElementById('countdown');
    const countdownFinalElement = document.getElementById('countdown-final'); // Novo elemento

    function updateRealCountdown() {
        const now = new Date();
        const nowBrasilia = new Date(now.toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));

        const tomorrowBrasilia = new Date(nowBrasilia);
        tomorrowBrasilia.setDate(nowBrasilia.getDate() + 1);
        tomorrowBrasilia.setHours(0, 0, 0, 0); // Próxima meia-noite em Brasília

        const timeLeft = tomorrowBrasilia.getTime() - nowBrasilia.getTime();

        let hours, minutes, seconds, displayText;

        if (timeLeft <= 0) {
            displayText = "OFERTA ENCERRADA!";
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

// Scroll suave para links de âncora
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

// Acordeão para perguntas frequentes
function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Fechar todas as outras respostas
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Alternar o estado da resposta atual
            item.classList.toggle('active');
        });
    });
}

// Header flutuante
function initFloatingHeader() {
    const header = document.getElementById('floating-header');
    
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            header.classList.add('visible');
        } else {
            header.classList.remove('visible');
        }
    });
}

// Animações ao rolar a página
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
    
    function checkScroll() {
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    
    // Verifica ao carregar
    checkScroll();
    
    // Verifica ao rolar
    window.addEventListener('scroll', checkScroll);
}

// Configura a data da promoção para que o último dia seja HOJE.
function setDynamicPromoDate() {
    const promoTextElements = document.querySelectorAll('.promo-dates-text');
    const countdownDateElements = document.querySelectorAll('.current-date'); // Usado para outros contadores, se houver

    const today = new Date();
    const dayFormatter = new Intl.DateTimeFormat('pt-BR', { day: 'numeric' });
    const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long' });

    const todayFormatted = `${dayFormatter.format(today)} de ${monthFormatter.format(today)}`;

    if (promoTextElements.length > 0) {
        const dynamicDateHTML = 
            `expiram <span class="promo-final-day-highlight">HOJE, ${todayFormatted}</span>`;
        
        promoTextElements.forEach(element => {
            element.innerHTML = dynamicDateHTML;
        });
    }

    // Atualiza .current-date com a data de hoje (para consistência, se usado em outros lugares)
    if (countdownDateElements.length > 0) {
        countdownDateElements.forEach(el => el.textContent = todayFormatted);
    }
}

// Função para obter a cidade do usuário pelo IP
function getUserCity() {
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            if (data && data.city) {
                startSocialProofNotifications(data.city);
            } else {
                // Cidade padrão se não conseguir obter
                startSocialProofNotifications('São Paulo');
            }
        })
        .catch(error => {
            console.error('Erro ao obter localização:', error);
            // Usar cidade padrão em caso de erro
            startSocialProofNotifications('São Paulo');
        });
}

// Lista de nomes femininos brasileiros comuns
const femaleNames = [
    'Ana Silva', 'Maria Oliveira', 'Juliana Santos', 'Fernanda Costa', 
    'Camila Souza', 'Beatriz Almeida', 'Larissa Pereira', 'Carolina Ferreira', 
    'Mariana Lima', 'Gabriela Rodrigues', 'Isabela Martins', 'Amanda Cardoso',
    'Letícia Barbosa', 'Natália Ribeiro', 'Patrícia Carvalho', 'Bruna Gomes',
    'Débora Nascimento', 'Jéssica Araújo', 'Luana Vieira', 'Tatiane Rocha'
];

// Lista de mensagens de compra
const purchaseMessages = [
    'acabou de comprar o guia completo',
    'comprou o plano completo há',
    'adquiriu o guia do casamento econômico há',
    'acabou de aproveitar a oferta completa',
    'acaba de garantir seu pacote completo há'
];

// Lista de períodos de tempo
const timePeriods = [
    '1 minuto',
    '2 minutos',
    '5 minutos',
    '7 minutos',
    '12 minutos',
    '15 minutos',
    '20 minutos',
    '30 minutos',
    'alguns minutos'
];

// Função para iniciar as notificações de prova social
function startSocialProofNotifications(city) {
    // Exibir primeira notificação após 10 segundos
    setTimeout(() => {
        showSocialProofNotification(city);
        
        // Configurar intervalo para mostrar notificações periodicamente
        setInterval(() => {
            showSocialProofNotification(city);
        }, 30000); // Uma nova notificação a cada 30 segundos
    }, 10000);
}

// Função para exibir uma notificação de prova social
function showSocialProofNotification(city) {
    // Selecionar nome, mensagem e período de tempo aleatórios
    const randomName = femaleNames[Math.floor(Math.random() * femaleNames.length)];
    const randomMessage = purchaseMessages[Math.floor(Math.random() * purchaseMessages.length)];
    const randomTime = timePeriods[Math.floor(Math.random() * timePeriods.length)];
    
    // Compor a mensagem
    const message = `<span class="notification-name">${randomName}</span> de <span class="notification-city">${city}</span> ${randomMessage}`;
    
    // Atualizar o conteúdo da notificação
    document.getElementById('notificationMessage').innerHTML = message;
    document.getElementById('notificationTime').textContent = randomTime;
    
    // Mostrar a notificação
    const notification = document.getElementById('socialProofNotification');
    notification.classList.add('show');
    
    // Ocultar a notificação após 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Função para fechar a notificação manualmente
function closeSocialProof() {
    const notification = document.getElementById('socialProofNotification');
    notification.classList.remove('show');
} 