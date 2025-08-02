// Base de données des articles
const articlesData = [];

// 🔍 MOTEUR DE RECHERCHE MODERNE
let currentArticles = []; // Articles actuellement chargés
let currentCategory = 'all'; // Catégorie actuelle

// Fonction pour générer les données d'articles à partir des fichiers
function generateArticlesData() {
    // Cette fonction sera enrichie avec les vraies données
    const sampleArticles = [
        {
            title: "Best home security cameras 2024",
            category: "cameras",
            excerpt: "Discover our selection of the most powerful security cameras to protect your home.",
            url: "articles/html/2024-best-home-security-cameras.html",
            tags: ["cameras", "security", "2024", "surveillance"]
        },
        {
            title: "GPS Tracker for Elderly",
            category: "gps-tracker",
            excerpt: "GPS tracking solutions specially designed to ensure the safety of your elderly loved ones.",
            url: "articles/html/gps-tracker-for-elderly.html",
            tags: ["gps", "seniors", "security", "family"]
        }
    ];
    
    // Ajouter plus d'articles basés sur les fichiers réels
    return sampleArticles;
}

// Fonction de catégorisation automatique
function categorizeArticle(filename) {
    const name = filename.toLowerCase();
    if (name.includes('camera') || name.includes('surveillance')) return 'cameras';
    if (name.includes('gps') || name.includes('tracker') || name.includes('track')) return 'gps-tracker';
    if (name.includes('door') || name.includes('security-door')) return 'security-doors';
    if (name.includes('home-security') || name.includes('system')) return 'systems';
    if (name.includes('guide') || name.includes('how-to')) return 'guides';
    if (name.includes('best') || name.includes('review') || name.includes('top')) return 'reviews';
    if (name.includes('tech') || name.includes('smart') || name.includes('ai')) return 'technology';
    return 'home-security';
}

// Fonction pour créer un extrait à partir du titre
function createExcerpt(title) {
    const excerpts = {
        'cameras': 'Advanced surveillance solutions to protect your home with the latest technologies.',
        'gps-tracker': 'GPS tracking devices to ensure security and real-time monitoring.',
        'security-doors': 'Portes et systèmes d\'entrée sécurisés to strengthen your home protection.',
        'systems': 'Complete security systems for integrated and smart protection.',
        'guides': 'Practical guides and expert advice to optimize your security.',
        'reviews': 'Detailed analysis and comparisons of the best security solutions.',
        'technology': 'Technological innovations and smart solutions for modern security.',
        'home-security': 'Complete solutions for securing your home and family.'
    };
    
    const category = categorizeArticle(title);
    return excerpts[category] || excerpts['home-security'];
}

// Fonction pour charger et afficher les articles
async function loadArticles(category = 'all') {
    try {
        console.log(`Chargement de la catégorie: ${category}...`);
        
        // Définir le fichier JSON à charger selon la catégorie
        let jsonFile;
        switch(category) {
            case 'cameras':
                jsonFile = 'cameras.json';
                break;
            case 'gps-tracker':
                jsonFile = 'gps-trackers.json';
                break;
            case 'security-doors':
                jsonFile = 'security-doors.json';
                break;
            case 'systems':
                jsonFile = 'systems.json';
                break;
            case 'home-security':
                jsonFile = 'home-security.json';
                break;
            default:
                // Pour "all", charger tous les fichiers
                console.log('Chargement de toutes les catégories...');
                return await loadAllCategories();
        }
        
        const response = await fetch(jsonFile, { cache: 'no-cache' });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status} pour ${jsonFile}`);
        }
        
        const data = await response.json();
        console.log(`🎯 === CATÉGORIE ${category.toUpperCase()} ===`);
        console.log(`✅ Chargé ${data.articles.length} articles de ${jsonFile}`);
        console.log(`📊 Stats:`, data.stats);
        
        // Mettre à jour les statistiques pour la catégorie
        document.getElementById('totalArticles').textContent = data.stats.total_articles.toLocaleString('fr-FR');
        
        return data.articles;
    } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
        
        // Fallback avec quelques articles d'exemple
        console.log('Utilisation des données de fallback...');
        return [
            {
                title: "Best Home Security Cameras 2024",
                category: "cameras",
                category_name: "Security Cameras", 
                category_icon: "📹",
                excerpt: "Discover our selection of the most powerful security cameras to protect your home.",
                url: "articles/html/2024-best-home-security-cameras.html",
                keywords: ["cameras", "security", "2024", "surveillance"],
                reading_time: "3-5 min"
            },
            {
                title: "GPS Tracker For Elderly",
                category: "gps-tracker",
                category_name: "GPS Trackers",
                category_icon: "📍", 
                excerpt: "GPS tracking solutions specially designed to ensure the safety of your elderly loved ones.",
                url: "articles/html/gps-tracker-for-elderly.html",
                keywords: ["gps", "seniors", "security", "family"],
                reading_time: "3-5 min"
            }
        ];
    }
}

// Nouvelle fonction pour charger toutes les catégories
async function loadAllCategories() {
    try {
        console.log('🌟 === CHARGEMENT DE TOUTES LES CATÉGORIES ===');
        const files = ['cameras.json', 'gps-trackers.json', 'security-doors.json', 'systems.json', 'home-security.json'];
        let allArticles = [];
        let totalArticles = 0;
        let categoriesLoaded = 0;
        
        for (const file of files) {
            try {
                console.log(`📥 Chargement de ${file}...`);
                const response = await fetch(file, { cache: 'no-cache' });
                if (response.ok) {
                    const data = await response.json();
                    allArticles.push(...data.articles);
                    totalArticles += data.stats.total_articles;
                    categoriesLoaded++;
                    console.log(`✅ ${file}: ${data.articles.length} articles ajoutés (total: ${allArticles.length})`);
                } else {
                    console.error(`❌ Erreur HTTP ${response.status} pour ${file}`);
                }
            } catch (fileError) {
                console.error(`❌ Erreur pour ${file}:`, fileError);
            }
        }
        
        console.log(`🎉 === CHARGEMENT TERMINÉ ===`);
        console.log(`📊 ${categoriesLoaded}/5 catégories chargées`);
        console.log(`📝 ${allArticles.length} articles au total`);
        
        // Mettre à jour les statistiques totales
        document.getElementById('totalArticles').textContent = totalArticles.toLocaleString('fr-FR');
        
        return allArticles;
    } catch (error) {
        console.error('❌ Erreur lors du chargement de toutes les catégories:', error);
        return [];
    }
}

// Fonction pour afficher les articles
function displayArticles(articles) {
    console.log('🎯 displayArticles appelée avec', articles.length, 'articles');
    
    const grid = document.getElementById('articlesGrid');
    const noResults = document.getElementById('noResults');
    
    console.log('🔍 Éléments DOM:', { grid: !!grid, noResults: !!noResults });
    
    if (articles.length === 0) {
        console.log('⚠️ Aucun article à afficher');
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    console.log('✅ Affichage de', articles.length, 'articles');
    noResults.style.display = 'none';
    
    const htmlContent = articles.map(article => `
        <div class="article-card">
            <div class="article-card-content">
                <span class="article-category">
                    ${article.category_icon || '🏠'} ${article.category_name || 'Security'}
                </span>
                <a href="${article.url}" class="article-title">${article.title}</a>
                <p class="article-excerpt">${article.excerpt}</p>
            </div>
        </div>
    `).join('');
    
    grid.innerHTML = htmlContent;
    console.log(`🎉 === AFFICHAGE RÉUSSI ===`);
    console.log(`📱 ${articles.length} articles affichés sur la page`);
}

function searchArticles() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const grid = document.getElementById('articlesGrid');
    
    console.log(`🔍 === RECHERCHE ===`);
    console.log(`📝 Requête: "${query}"`);
    console.log(`📂 Catégorie: ${currentCategory}`);
    console.log(`📊 Articles disponibles: ${currentArticles.length}`);
    
    if (!query) {
        // Si pas de recherche, afficher tous les articles de la catégorie actuelle
        console.log('🔄 Aucune recherche - affichage de tous les articles');
        displayFilteredArticles(currentArticles);
        updateStatsCounter(currentArticles.length);
        return;
    }
    
    // Recherche dans les articles actuels
    const filtered = currentArticles.filter(article => {
        const titleMatch = article.title.toLowerCase().includes(query);
        const excerptMatch = article.excerpt && article.excerpt.toLowerCase().includes(query);
        const keywordsMatch = article.keywords && article.keywords.some(tag => 
            tag.toLowerCase().includes(query)
        );
        const tagsMatch = article.tags && article.tags.some(tag => 
            tag.toLowerCase().includes(query)
        );
        const categoryMatch = article.category && article.category.toLowerCase().includes(query);
        const categoryNameMatch = article.category_name && article.category_name.toLowerCase().includes(query);
        
        return titleMatch || excerptMatch || keywordsMatch || tagsMatch || categoryMatch || categoryNameMatch;
    });
    
    console.log(`✅ ${filtered.length} articles trouvés`);
    
    // Afficher les résultats
    displayFilteredArticles(filtered);
    
    // Mettre à jour le compteur avec résultats de recherche
    updateStatsCounter(filtered.length, currentArticles.length);
}

// Fonction pour effacer la recherche
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        searchInput.style.borderColor = 'var(--border-color)';
        searchInput.style.boxShadow = 'none';
        console.log('🧹 Recherche effacée');
        displayFilteredArticles(currentArticles);
        updateStatsCounter(currentArticles.length);
    }
}

// Fonction pour mettre à jour le compteur
function updateStatsCounter(displayed, total = null) {
    const statsElement = document.getElementById('totalArticles');
    if (statsElement) {
        if (total && displayed !== total) {
            statsElement.textContent = `${displayed.toLocaleString()} / ${total.toLocaleString()}`;
        } else {
            statsElement.textContent = displayed.toLocaleString();
        }
    }
}

// Fonctions pour le bouton "Effacer"
function addClearButton() {
    if (document.getElementById('clearSearchBtn')) return; // Déjà présent
    
    const searchBox = document.querySelector('.search-box');
    const clearBtn = document.createElement('button');
    clearBtn.id = 'clearSearchBtn';
    clearBtn.innerHTML = '✕ Effacer';
    clearBtn.style.cssText = `
        padding: 0.75rem 1rem;
        background: #ff4444;
        color: white;
        border: none;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-size: 0.875rem;
        transition: var(--transition);
    `;
    
    clearBtn.addEventListener('click', function(e) {
        e.preventDefault();
        clearSearch();
        removeClearButton();
    });
    
    clearBtn.addEventListener('mouseover', function() {
        this.style.background = '#ff2222';
    });
    
    clearBtn.addEventListener('mouseout', function() {
        this.style.background = '#ff4444';
    });
    
    searchBox.appendChild(clearBtn);
}

function removeClearButton() {
    const clearBtn = document.getElementById('clearSearchBtn');
    if (clearBtn) {
        clearBtn.remove();
    }
}

// Fonction pour afficher les articles filtrés
function displayFilteredArticles(articles) {
    const grid = document.getElementById('articlesGrid');
    const noResults = document.getElementById('noResults');
    
    if (articles.length === 0) {
        console.log('⚠️ Aucun résultat trouvé');
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-light);">
                <h3>🔍 Aucun article trouvé</h3>
                <p>Essayez d'autres mots-clés ou effacez la recherche pour voir tous les articles.</p>
            </div>
        `;
        return;
    }
    
    console.log(`📱 Affichage de ${articles.length} articles filtrés`);
    
    const html = articles.map(article => `
        <div class="article-card">
            <div class="article-card-content">
                <span class="article-category">${article.category_icon || '🏠'} ${article.category_name || 'Security'}</span>
                <a href="${article.url}" class="article-title">${article.title}</a>
                <p class="article-excerpt">${article.excerpt || 'Description non disponible'}</p>
            </div>
        </div>
    `).join('');
    
    grid.innerHTML = html;
}

// Fonction d'initialisation
async function initializeArticlesPage() {
    console.log('🚀 === INITIALISATION DE LA PAGE ARTICLES ===');
    
    try {
        // Test direct avec cameras.json
        console.log('📥 Test chargement cameras.json...');
        const response = await fetch('cameras.json');
        const data = await response.json();
        
        console.log('✅ Données reçues:', {
            stats: data.stats,
            articlesCount: data.articles.length,
            firstArticle: data.articles[0]?.title
        });
        
        // Test d'affichage direct
        const grid = document.getElementById('articlesGrid');
        if (!grid) {
            console.error('❌ Element articlesGrid non trouvé !');
            return;
        }
        
        console.log('📱 Création du HTML...');
        const html = data.articles.slice(0, 10).map(article => `
            <div class="article-card">
                <div class="article-card-content">
                    <span class="article-category">📹 Cameras</span>
                    <a href="${article.url}" class="article-title">${article.title}</a>
                    <p class="article-excerpt">${article.excerpt || 'Description non disponible'}</p>
                </div>
            </div>
        `).join('');
        
        console.log('💉 Injection HTML...');
        grid.innerHTML = html;
        
        console.log('🎉 TEST TERMINÉ - Vérifiez si vous voyez 10 articles caméras');
        
        // Mise à jour des stats
        document.getElementById('totalArticles').textContent = data.articles.length.toLocaleString();
        
        // 🔍 Sauvegarder pour la recherche
        currentArticles = data.articles;
        currentCategory = 'cameras';
        
    } catch (error) {
        console.error('❌ Erreur test:', error);
    }
    
    // GESTIONNAIRES DE BOUTONS
    const filterBtns = document.querySelectorAll('.filter-btn');
    console.log('🔘 Boutons trouvés:', filterBtns.length);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', async function() {
            console.log('🔄 === CLIC SUR BOUTON ===');
            console.log('📋 Bouton:', this.textContent.trim());
            console.log('🏷️ Data-category:', this.dataset.category);
            
            // Retirer la classe active de tous les boutons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            const category = this.dataset.category;
            const grid = document.getElementById('articlesGrid');
            
            // 🧹 Effacer la recherche quand on change de catégorie
            const searchInput = document.getElementById('searchInput');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                console.log('🧹 Recherche effacée lors du changement de catégorie');
            }
            
            try {
                // Map des fichiers JSON
                const jsonFiles = {
                    'all': null,
                    'cameras': 'cameras.json',
                    'gps-tracker': 'gps-trackers.json',
                    'security-doors': 'security-doors.json',
                    'systems': 'systems.json',
                    'home-security': 'home-security.json'
                };
                
                if (category === 'all') {
                    await handleAllCategoriesLoad(grid, jsonFiles);
                } else {
                    await handleSingleCategoryLoad(category, jsonFiles, grid);
                }
                
                console.log('🎉 AFFICHAGE TERMINÉ');
                console.log(`🔍 Moteur de recherche prêt avec ${currentArticles.length} articles de la catégorie ${currentCategory}`);
                
            } catch (error) {
                console.error('❌ Erreur lors du chargement:', error);
                grid.innerHTML = '<div style="text-align: center; padding: 2rem; color: red;">❌ Erreur de chargement</div>';
            }
        });
    });
    
    // 🔍 ÉVÉNEMENTS DE RECHERCHE
    setupSearchEvents();
    
    // Navigation mobile
    setupMobileNavigation();
    
    // 🚀 INITIALISATION : Charger tous les articles au démarrage
    console.log('🚀 === INITIALISATION DE LA PAGE ===');
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    if (activeFilterBtn && activeFilterBtn.dataset.category === 'all') {
        console.log('🔄 Déclenchement automatique du chargement de tous les articles');
        // Simuler un clic sur le bouton "All" pour charger tous les articles
        activeFilterBtn.click();
    }
}

async function handleAllCategoriesLoad(grid, jsonFiles) {
    console.log('🌟 === CHARGEMENT DE TOUS LES ARTICLES ===');
    grid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--primary-color); font-size: 1.2rem;">🔄 Chargement de tous les articles...</div>';
    
    let allArticles = [];
    let totalCount = 0;
    const files = Object.values(jsonFiles).filter(f => f);
    
    // Charger chaque fichier JSON
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`📥 [${i+1}/${files.length}] Chargement de ${file}...`);
        
        const response = await fetch(file);
        const data = await response.json();
        allArticles.push(...data.articles);
        totalCount += data.articles.length;
        
        console.log(`✅ ${file}: ${data.articles.length} articles (total: ${totalCount})`);
        
        // Mise à jour progressive de l'interface
        grid.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--primary-color); font-size: 1.2rem;">
            🔄 Chargement en cours...<br>
            <span style="font-size: 0.9rem;">${totalCount} articles chargés</span>
        </div>`;
    }
    
    console.log(`🎉 === CHARGEMENT TERMINÉ ===`);
    console.log(`📊 TOTAL: ${allArticles.length} articles de ${files.length} catégories`);
    
    // Affichage de TOUS les articles
    console.log('💻 Génération du HTML pour TOUS les articles...');
    grid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--primary-color);">📝 Génération de l\'affichage...</div>';
    
    // Utiliser une approche par fragments pour les gros volumes
    const chunkSize = 1000;
    let htmlParts = [];
    
    for (let i = 0; i < allArticles.length; i += chunkSize) {
        const chunk = allArticles.slice(i, i + chunkSize);
        const chunkHtml = chunk.map(article => `
            <div class="article-card">
                <div class="article-card-content">
                    <span class="article-category">${article.category_icon || '🏠'} ${article.category_name || 'Security'}</span>
                    <a href="${article.url}" class="article-title">${article.title}</a>
                    <p class="article-excerpt">${article.excerpt || 'Description non disponible'}</p>
                </div>
            </div>
        `).join('');
        htmlParts.push(chunkHtml);
        
        console.log(`📄 Chunk ${Math.floor(i/chunkSize)+1}/${Math.ceil(allArticles.length/chunkSize)} généré`);
    }
    
    const finalHtml = htmlParts.join('');
    console.log(`📋 HTML final généré: ${Math.round(finalHtml.length/1024)}KB`);
    
    // Injection finale
    grid.innerHTML = finalHtml;
    document.getElementById('totalArticles').textContent = allArticles.length.toLocaleString();
    
    // 🔍 Sauvegarder pour la recherche
    currentArticles = allArticles;
    currentCategory = 'all';
    
    console.log(`🎉 === AFFICHAGE COMPLET ===`);
    console.log(`✅ ${allArticles.length} articles affichés et parcourables`);
    console.log(`🔍 Moteur de recherche prêt avec ${currentArticles.length} articles`);
}

async function handleSingleCategoryLoad(category, jsonFiles, grid) {
    const jsonFile = jsonFiles[category];
    if (!jsonFile) {
        console.error('❌ Fichier JSON non trouvé pour:', category);
        return;
    }
    
    console.log(`📥 Chargement de ${jsonFile}...`);
    grid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--primary-color);">🔄 Chargement...</div>';
    
    const response = await fetch(jsonFile);
    const data = await response.json();
    
    console.log(`✅ ${data.articles.length} articles chargés`);
    
    const html = data.articles.map(article => `
        <div class="article-card">
            <div class="article-card-content">
                <span class="article-category">${article.category_icon || '🏠'} ${article.category_name || 'Security'}</span>
                <a href="${article.url}" class="article-title">${article.title}</a>
                <p class="article-excerpt">${article.excerpt || 'Description non disponible'}</p>
            </div>
        </div>
    `).join('');
    
    grid.innerHTML = html;
    document.getElementById('totalArticles').textContent = data.articles.length.toLocaleString();
    
    // 🔍 Sauvegarder pour la recherche
    currentArticles = data.articles;
    currentCategory = category;
}

function setupSearchEvents() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.btn-primary');
    
    if (searchInput) {
        console.log('🔍 Connexion du moteur de recherche...');
        
        // Recherche en temps réel pendant la saisie
        searchInput.addEventListener('input', function() {
            console.log('⌨️ Saisie détectée:', this.value);
            
            // Ajouter/supprimer l'indicateur de recherche active
            if (this.value.trim()) {
                this.style.borderColor = 'var(--primary-color)';
                this.style.boxShadow = '0 0 0 2px rgba(0, 255, 136, 0.2)';
                addClearButton();
            } else {
                this.style.borderColor = 'var(--border-color)';
                this.style.boxShadow = 'none';
                removeClearButton();
            }
            
            searchArticles();
        });
        
        // Recherche sur Enter
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                console.log('🔍 Recherche sur Enter');
                searchArticles();
            }
        });
        
        // Effacer la recherche quand le champ est vidé
        searchInput.addEventListener('focus', function() {
            console.log('🎯 Focus sur la recherche');
        });
        
        console.log('✅ Moteur de recherche connecté');
    }
    
    // Bouton de recherche
    if (searchButton) {
        searchButton.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('🔍 Clic sur bouton recherche');
            searchArticles();
        });
    }
}

function setupMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
    }
}

// Auto-initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', function() {
    initializeArticlesPage();
});