#!/bin/bash
# Script de validation du déploiement CircleProtek

echo "🚀 === VALIDATION DU DÉPLOIEMENT CIRCLEPROTEK ==="
echo ""

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SUCCESS=0
WARNINGS=0
ERRORS=0

# Fonction pour afficher les résultats
check_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        ((SUCCESS++))
    else
        echo -e "${RED}❌ $2${NC}"
        ((ERRORS++))
    fi
}

check_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

echo -e "${BLUE}📂 === VÉRIFICATION DES FICHIERS PRINCIPAUX ===${NC}"

# Vérifier les fichiers HTML principaux
[ -f "index.html" ] && check_result 0 "index.html présent" || check_result 1 "index.html manquant"
[ -f "articles.html" ] && check_result 0 "articles.html présent" || check_result 1 "articles.html manquant"

# Vérifier les fichiers CSS et JS
[ -f "styles.css" ] && check_result 0 "styles.css présent" || check_result 1 "styles.css manquant"
[ -f "script.js" ] && check_result 0 "script.js présent" || check_result 1 "script.js manquant"
[ -f "js/menu.js" ] && check_result 0 "js/menu.js présent" || check_result 1 "js/menu.js manquant"
[ -f "js/articles.js" ] && check_result 0 "js/articles.js présent" || check_result 1 "js/articles.js manquant"

# Vérifier le favicon
[ -f "favicon.ico" ] && check_result 0 "favicon.ico présent" || check_result 1 "favicon.ico manquant"

echo ""
echo -e "${BLUE}📊 === VÉRIFICATION DES FICHIERS JSON ===${NC}"

# Vérifier les fichiers JSON de données
[ -f "cameras.json" ] && check_result 0 "cameras.json présent" || check_result 1 "cameras.json manquant"
[ -f "gps-trackers.json" ] && check_result 0 "gps-trackers.json présent" || check_result 1 "gps-trackers.json manquant"
[ -f "security-doors.json" ] && check_result 0 "security-doors.json présent" || check_result 1 "security-doors.json manquant"
[ -f "systems.json" ] && check_result 0 "systems.json présent" || check_result 1 "systems.json manquant"
[ -f "home-security.json" ] && check_result 0 "home-security.json présent" || check_result 1 "home-security.json manquant"

echo ""
echo -e "${BLUE}🖼️  === VÉRIFICATION DES IMAGES ===${NC}"

# Vérifier les dossiers d'images
[ -d "images/" ] && check_result 0 "Dossier images/ présent" || check_result 1 "Dossier images/ manquant"
[ -d "images/hero/" ] && check_result 0 "Dossier images/hero/ présent" || check_result 1 "Dossier images/hero/ manquant"
[ -d "images/logos/" ] && check_result 0 "Dossier images/logos/ présent" || check_result 1 "Dossier images/logos/ manquant"

# Vérifier l'image hero optimisée
[ -f "images/hero/family-home-security-hero-optimized.jpg" ] && check_result 0 "Image hero optimisée présente" || check_result 1 "Image hero optimisée manquante"

echo ""
echo -e "${BLUE}📄 === VÉRIFICATION DES ARTICLES ===${NC}"

# Compter les articles
ARTICLE_COUNT=$(find articles/html/ -name "*.html" 2>/dev/null | wc -l)
if [ $ARTICLE_COUNT -gt 10000 ]; then
    check_result 0 "Articles HTML présents ($ARTICLE_COUNT articles)"
else
    check_result 1 "Nombre d'articles insuffisant ($ARTICLE_COUNT articles)"
fi

echo ""
echo -e "${BLUE}⚙️  === VÉRIFICATION DE LA CONFIGURATION ===${NC}"

# Vérifier robots.txt
[ -f "robots.txt" ] && check_result 0 "robots.txt présent" || check_result 1 "robots.txt manquant"

# Vérifier les scripts de déploiement
DEPLOY_SCRIPTS=$(ls deploy-*.sh 2>/dev/null | wc -l)
if [ $DEPLOY_SCRIPTS -gt 0 ]; then
    check_result 0 "Scripts de déploiement présents ($DEPLOY_SCRIPTS scripts)"
else
    check_warning "Aucun script de déploiement trouvé"
fi

echo ""
echo -e "${BLUE}🔍 === VÉRIFICATION DU CONTENU HTML ===${NC}"

# Vérifier que les fichiers HTML n'ont pas de favicon.svg manquant
if grep -q "favicon.svg" index.html 2>/dev/null; then
    check_result 1 "index.html contient encore des références à favicon.svg"
else
    check_result 0 "index.html utilise correctement favicon.ico"
fi

if grep -q "favicon.svg" articles.html 2>/dev/null; then
    check_result 1 "articles.html contient encore des références à favicon.svg"
else
    check_result 0 "articles.html utilise correctement favicon.ico"
fi

# Vérifier que articles.html utilise le JavaScript externe
if grep -q "js/articles.js" articles.html 2>/dev/null; then
    check_result 0 "articles.html utilise le JavaScript externe"
else
    check_result 1 "articles.html n'utilise pas le JavaScript externe"
fi

echo ""
echo -e "${BLUE}📐 === VÉRIFICATION DE LA TAILLE DES FICHIERS ===${NC}"

# Vérifier la taille des fichiers principaux
INDEX_SIZE=$(wc -c < "index.html" 2>/dev/null || echo "0")
ARTICLES_SIZE=$(wc -c < "articles.html" 2>/dev/null || echo "0")
CSS_SIZE=$(wc -c < "styles.css" 2>/dev/null || echo "0")

if [ $INDEX_SIZE -lt 50000 ]; then
    check_result 0 "index.html a une taille raisonnable ($(echo $INDEX_SIZE | numfmt --to=iec-i)B)"
else
    check_warning "index.html est volumineux ($(echo $INDEX_SIZE | numfmt --to=iec-i)B)"
fi

if [ $ARTICLES_SIZE -lt 50000 ]; then
    check_result 0 "articles.html a une taille raisonnable ($(echo $ARTICLES_SIZE | numfmt --to=iec-i)B)"
else
    check_warning "articles.html est volumineux ($(echo $ARTICLES_SIZE | numfmt --to=iec-i)B)"
fi

echo ""
echo -e "${BLUE}🌐 === RÉSUMÉ DE LA VALIDATION ===${NC}"

echo ""
echo -e "${GREEN}✅ Succès: $SUCCESS${NC}"
echo -e "${YELLOW}⚠️  Avertissements: $WARNINGS${NC}"
echo -e "${RED}❌ Erreurs: $ERRORS${NC}"

echo ""
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 === SITE PRÊT POUR LE DÉPLOIEMENT ===${NC}"
    echo ""
    echo -e "${BLUE}📋 Prochaines étapes:${NC}"
    echo "1. Exécuter un script de déploiement (deploy-*.sh)"
    echo "2. Tester le site sur le serveur"
    echo "3. Vérifier les liens et fonctionnalités"
    exit 0
else
    echo -e "${RED}🚫 === PROBLÈMES DÉTECTÉS ===${NC}"
    echo ""
    echo "Corrigez les erreurs avant de déployer."
    exit 1
fi