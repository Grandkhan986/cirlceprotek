// Menu dynamique centralisé - CircleProtek
// Toutes les modifications du menu se font ici !

const MENU_CONFIG = {
    logo: {
        text: "CircleProtek",
        homeLink: "index.html"
    },
    items: [
        {
            id: "home",
            text: "Home",
            href: "#home",
            icon: "🏠"
        },
        {
            id: "test", 
            text: "Quizz",
            href: "#test",
            icon: "📝"
        },
        {
            id: "newsroom",
            text: "Newsroom", 
            href: "#newsroom",
            icon: "📰"
        },
        {
            id: "shop",
            text: "Shop now",
            href: "#shop", 
            icon: "🛒"
        },
        {
            id: "contact",
            text: "Contact",
            href: "#contact",
            icon: "📞"
        }
    ],
    footer: {
        quickLinks: [
            { text: "Home", href: "#home" },
            { text: "Quizz", href: "#test" },
            { text: "Newsroom", href: "#newsroom" },
            { text: "Articles", href: "articles.html" },
            { text: "Shop", href: "#shop" },
            { text: "Contact", href: "#contact" }
        ]
    }
};

class DynamicMenu {
    constructor(config = MENU_CONFIG) {
        this.config = config;
        this.currentPage = this.detectCurrentPage();
        this.basePath = this.detectBasePath();
    }

    detectCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('articles.html')) return 'newsroom';
        if (path.includes('/articles/')) return 'newsroom';
        return 'home';
    }

    detectBasePath() {
        const path = window.location.pathname;
        if (path.includes('/articles/html/')) return '../../';
        if (path.includes('/articles/')) return '../';
        return '';
    }

    adjustHref(href) {
        // Si on est dans une page d'article, ajuster les liens
        if (this.basePath && href.startsWith('#')) {
            return `${this.basePath}index.html${href}`;
        }
        if (this.basePath && href === 'articles.html') {
            return `${this.basePath}articles.html`;
        }
        return href;
    }

    generateDesktopNav() {
        const items = this.config.items.map(item => {
            const isActive = item.id === this.currentPage ? 'active' : '';
            const href = this.adjustHref(item.href);
            return `<li><a href="${href}" class="nav-link ${isActive}">${item.text}</a></li>`;
        }).join('');

        return `
            <nav class="nav">
                <ul class="nav-links">
                    ${items}
                </ul>
            </nav>
        `;
    }

    generateMobileNav() {
        const items = this.config.items.map(item => {
            const href = this.adjustHref(item.href);
            return `<li><a href="${href}" class="mobile-nav-link">${item.text}</a></li>`;
        }).join('');

        return `
            <nav class="mobile-nav">
                <ul class="mobile-nav-links">
                    ${items}
                </ul>
            </nav>
        `;
    }

    generateHeader() {
        const logoHref = this.adjustHref(this.config.logo.homeLink);
        
        return `
            <header class="header">
                <div class="container">
                    <div class="nav-brand">
                        <a href="${logoHref}" class="logo">${this.config.logo.text}</a>
                    </div>
                    ${this.generateDesktopNav()}
                    <div class="nav-toggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </header>
            ${this.generateMobileNav()}
        `;
    }

    generateFooterLinks() {
        const links = this.config.footer.quickLinks.map(link => {
            const href = this.adjustHref(link.href);
            return `<li><a href="${href}">${link.text}</a></li>`;
        }).join('');

        return `
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    ${links}
                </ul>
            </div>
        `;
    }

    // Initialiser le menu dynamique
    init() {
        // Remplacer le header existant ou créer un nouveau
        const existingHeader = document.querySelector('.header');
        const existingMobileNav = document.querySelector('.mobile-nav');
        
        if (existingHeader) {
            const headerContainer = document.createElement('div');
            headerContainer.innerHTML = this.generateHeader();
            
            // Remplacer le header
            existingHeader.replaceWith(headerContainer.querySelector('.header'));
            
            // Remplacer la navigation mobile
            if (existingMobileNav) {
                existingMobileNav.replaceWith(headerContainer.querySelector('.mobile-nav'));
            } else {
                // Ajouter la navigation mobile après le header
                document.querySelector('.header').insertAdjacentHTML('afterend', this.generateMobileNav());
            }
        } else {
            // Aucun header existant - créer un nouveau menu au début du body
            const headerContainer = document.createElement('div');
            headerContainer.innerHTML = this.generateHeader();
            
            // Insérer le header au début du body
            document.body.insertBefore(headerContainer.querySelector('.header'), document.body.firstChild);
            
            // Ajouter la navigation mobile après le header
            document.querySelector('.header').insertAdjacentHTML('afterend', this.generateMobileNav());
        }

        // Remplacer les liens du footer si ils existent
        const footerQuickLinks = document.querySelector('.footer-section h4');
        if (footerQuickLinks && footerQuickLinks.textContent.includes('Quick')) {
            const footerSection = footerQuickLinks.closest('.footer-section');
            if (footerSection) {
                footerSection.outerHTML = this.generateFooterLinks();
            }
        }

        // Réactiver les événements du menu mobile
        this.initMobileMenu();
        
        console.log('🎯 Menu dynamique initialisé !');
    }

    initMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const mobileNav = document.querySelector('.mobile-nav');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        if (navToggle && mobileNav) {
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
    }
}

// Auto-initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', function() {
    const dynamicMenu = new DynamicMenu();
    dynamicMenu.init();
});

// Export pour utilisation avancée
window.DynamicMenu = DynamicMenu;
window.MENU_CONFIG = MENU_CONFIG;