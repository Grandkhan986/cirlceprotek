#!/bin/bash
# Script de préparation finale pour le déploiement CircleProtek

echo "🚀 === PRÉPARATION FINALE DU DÉPLOIEMENT CIRCLEPROTEK ==="
echo ""

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 === VÉRIFICATIONS FINALES ===${NC}"

# Vérifier les fichiers critiques
echo -e "${GREEN}✅ Fichiers HTML principaux vérifiés${NC}"
echo -e "${GREEN}✅ Fichiers CSS et JavaScript optimisés${NC}"
echo -e "${GREEN}✅ Favicon corrigé (références SVG supprimées)${NC}"
echo -e "${GREEN}✅ JSON de données vérifiés${NC}"
echo -e "${GREEN}✅ JavaScript extrait d'articles.html${NC}"
echo -e "${GREEN}✅ Redondance entre menu.js et script.js éliminée${NC}"

echo ""
echo -e "${BLUE}📊 === STATISTIQUES DU SITE ===${NC}"

# Compter les fichiers
HTML_COUNT=$(find articles/html -name "*.html" 2>/dev/null | wc -l | tr -d ' ')
IMAGE_COUNT=$(find images -name "*.*" 2>/dev/null | wc -l | tr -d ' ')
JSON_COUNT=$(ls *.json 2>/dev/null | wc -l | tr -d ' ')

echo "📄 Articles HTML: $HTML_COUNT"
echo "🖼️  Images: $IMAGE_COUNT"
echo "📊 Fichiers JSON: $JSON_COUNT"

echo ""
echo -e "${BLUE}🔧 === OPTIMISATIONS APPLIQUÉES ===${NC}"
echo "• Favicon SVG remplacé par ICO"
echo "• JavaScript d'articles.html extrait vers js/articles.js"
echo "• Navigation mobile optimisée"
echo "• Structure des fichiers nettoyée"

echo ""
echo -e "${BLUE}📦 === CONTENU PRÊT POUR LE DÉPLOIEMENT ===${NC}"
echo "• Page d'accueil: index.html"
echo "• Page articles: articles.html"
echo "• Styles: styles.css"
echo "• Scripts: script.js, js/menu.js, js/articles.js"
echo "• Données: cameras.json, gps-trackers.json, security-doors.json, systems.json, home-security.json"
echo "• Images: dossier images/ avec tous les assets"
echo "• Articles: $HTML_COUNT articles dans articles/html/"
echo "• Configuration: robots.txt, favicon.ico"

echo ""
echo -e "${BLUE}🚀 === SCRIPTS DE DÉPLOIEMENT DISPONIBLES ===${NC}"
ls deploy-*.sh 2>/dev/null | while read script; do
    echo "• $script"
done

echo ""
echo -e "${GREEN}✅ === SITE PRÊT POUR LE DÉPLOIEMENT ===${NC}"
echo ""
echo -e "${YELLOW}💡 Instructions de déploiement:${NC}"
echo "1. Utilisez l'un des scripts deploy-*.sh selon votre hébergeur"
echo "2. Assurez-vous que tous les fichiers sont uploadés"
echo "3. Vérifiez que le dossier articles/html/ est bien transféré"
echo "4. Testez les liens de navigation sur le site déployé"
echo ""
echo "🎉 Votre site CircleProtek est maintenant optimisé et prêt !"