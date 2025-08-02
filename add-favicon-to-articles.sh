#!/bin/bash
# Script pour ajouter le favicon "C" à tous les articles HTML

echo "🔧 === AJOUT DU FAVICON 'C' À TOUS LES ARTICLES ==="
echo ""

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compter les articles
TOTAL_ARTICLES=$(find articles/html -name "*.html" | wc -l | tr -d ' ')
echo -e "${BLUE}📊 Total d'articles à traiter : $TOTAL_ARTICLES${NC}"
echo ""

# Lignes de favicon à ajouter
FAVICON_LINES='    <link rel="icon" type="image/x-icon" href="../../favicon.ico">
    <link rel="apple-touch-icon" href="../../favicon.ico">'

# Compteur de fichiers traités
PROCESSED=0

echo -e "${YELLOW}🚀 Ajout du favicon en cours...${NC}"

# Traitement par lots pour éviter la surcharge
find articles/html -name "*.html" | while read -r file; do
    # Vérifier si le fichier contient déjà un favicon
    if ! grep -q "favicon.ico" "$file"; then
        # Chercher la ligne avec </title> et ajouter le favicon après
        if grep -q "</title>" "$file"; then
            # Créer un fichier temporaire avec le favicon ajouté
            sed "/^<title>.*<\/title>$/a\\
$FAVICON_LINES" "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
            
            ((PROCESSED++))
            
            # Afficher le progrès tous les 1000 fichiers
            if [ $((PROCESSED % 1000)) -eq 0 ]; then
                echo -e "${GREEN}✅ $PROCESSED articles traités...${NC}"
            fi
        fi
    fi
done

echo ""
echo -e "${GREEN}✅ === FAVICON AJOUTÉ AVEC SUCCÈS ===${NC}"
echo -e "${GREEN}📄 $PROCESSED articles ont été mis à jour${NC}"
echo ""
echo -e "${BLUE}🔍 Vérification d'un échantillon...${NC}"

# Vérifier quelques fichiers au hasard
SAMPLE_FILES=$(find articles/html -name "*.html" | head -3)
for file in $SAMPLE_FILES; do
    if grep -q "favicon.ico" "$file"; then
        echo -e "${GREEN}✅ $(basename "$file") - Favicon présent${NC}"
    else
        echo -e "${YELLOW}⚠️  $(basename "$file") - Favicon manquant${NC}"
    fi
done

echo ""
echo -e "${BLUE}🌐 Le favicon 'C' de CircleProtek apparaîtra maintenant sur TOUS les onglets !${NC}"