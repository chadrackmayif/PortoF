// Smooth scroll pour les liens de navigation
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

// Animation au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observer les cartes de compétences et contacts
document.querySelectorAll('.skill-card, .contact-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// Gestion du formulaire de contact
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les données du formulaire
        const formData = new FormData(this);
        const nom = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Validation simple
        if (nom.trim() === '' || email.trim() === '' || message.trim() === '') {
            alert('Veuillez remplir tous les champs');
            return;
        }
        
        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Veuillez entrer une adresse email valide');
            return;
        }
        
        // Afficher un message de succès
        alert(`Merci ${nom}! Votre message a été envoyé avec succès.\nNous vous répondrons à: ${email}`);
        
        // Réinitialiser le formulaire
        this.reset();
        
        // Vous pouvez ajouter ici un appel à un serveur pour envoyer l'email
        // Exemple avec fetch:
        // fetch('/api/send-email', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ nom, email, message })
        // })
        // .then(response => response.json())
        // .then(data => {
        //     alert('Votre message a été envoyé!');
        //     this.reset();
        // })
        // .catch(error => {
        //     alert('Erreur lors de l\'envoi du message');
        //     console.error('Error:', error);
        // });
    });
}

// Fonction pour ajouter un effet de parallaxe (optionnel)
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPosition = `0 ${window.pageYOffset * 0.5}px`;
    }
});

// Active la classe 'active' sur le lien de navigation actuel
window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Pré-chargement des images
window.addEventListener('load', () => {
    const profilePhoto = document.querySelector('.profile-photo');
    if (profilePhoto && profilePhoto.src === 'photo.jpg') {
        console.log('Photo non trouvée. Veuillez ajouter une image nommée "photo.jpg" dans le dossier.');
    }
});

// Affichage d'une notification quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio chargé avec succès!');
    
    // Animation au chargement
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 0.8s ease';
    }
});

// Fonction pour copier les informations de contact
function copyToClipboard(text, type) {
    navigator.clipboard.writeText(text).then(() => {
        alert(`${type} copié dans le presse-papiers!`);
    }).catch(() => {
        alert('Erreur lors de la copie');
    });
}

// Permet de cliquer sur les contacts pour les copier
document.querySelectorAll('.contact-card a').forEach(link => {
    link.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href.startsWith('tel:')) {
            copyToClipboard(href.replace('tel:', ''), 'Numéro');
        } else if (href.startsWith('mailto:')) {
            copyToClipboard(href.replace('mailto:', ''), 'Email');
        }
    });
});

// Responsive Navigation Menu Toggle
function setupMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navContainer = document.querySelector('.nav-container');
    
    // Créer le bouton hamburger si l'écran est petit
    if (window.innerWidth <= 768 && !document.querySelector('.hamburger')) {
        const hamburger = document.createElement('div');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = '☰';
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        navContainer.appendChild(hamburger);
    }
}

window.addEventListener('resize', setupMobileMenu);
setupMobileMenu();
