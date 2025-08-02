#!/bin/bash

echo "🚀 === DÉPLOIEMENT FTP CIRCLEPROTEK (MODE DÉTAILLÉ) ==="
echo "📅 $(date)"

# Configuration FTP
FTP_HOST="176.123.8.147"
FTP_USER="root"
FTP_PASS="hqfriqdm986"
FTP_DIR="/var/www/html"
LOCAL_DIR="."

echo "📊 Configuration:"
echo "- Serveur FTP: $FTP_HOST"
echo "- Utilisateur: $FTP_USER"
echo "- Répertoire distant: $FTP_DIR"
echo "- Répertoire local: $LOCAL_DIR"

# Test de connexion FTP
echo ""
echo "🔍 === TEST DE CONNEXION FTP ==="
lftp -u "$FTP_USER,$FTP_PASS" "$FTP_HOST" << EOF
set ftp:ssl-allow false
set ssl:verify-certificate false
set cmd:show-progress true
set cmd:verbose true
echo "✅ Connexion réussie"
pwd
ls -la
quit
EOF

if [ $? -ne 0 ]; then
    echo "❌ Échec de la connexion FTP"
    exit 1
fi

echo ""
echo "📤 === TRANSFERT FTP DÉTAILLÉ ==="

# Compter les fichiers à transférer
TOTAL_FILES=$(find . -type f ! -path "./.git/*" ! -name ".DS_Store" ! -name "deploy-*.sh" | wc -l)
echo "📁 Nombre de fichiers à transférer: $TOTAL_FILES"

# Déploiement avec progression détaillée
lftp -u "$FTP_USER,$FTP_PASS" "$FTP_HOST" << EOF
set ftp:ssl-allow false
set ssl:verify-certificate false
set cmd:show-progress true
set cmd:verbose true
set mirror:use-pget-n 4
set net:timeout 30

echo "🏠 Navigation vers le répertoire distant..."
cd "$FTP_DIR"
echo "📂 Répertoire courant: \$(pwd)"

echo "🧹 Nettoyage de l'ancien contenu..."
ls -la

echo "📤 Début du mirror..."
lcd "$LOCAL_DIR"
mirror -R --verbose --delete --exclude-glob=".git/*" --exclude-glob=".DS_Store" --exclude-glob="deploy-*.sh" . .

echo "✅ Transfert terminé"
echo "📋 Contenu final du serveur:"
ls -la

quit
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ === DÉPLOIEMENT RÉUSSI ==="
    echo "🌐 Site disponible à: https://circleprotek.com"
    echo "📅 Fin: $(date)"
    
    # Test rapide du site
    echo ""
    echo "🔍 === TEST DU SITE ==="
    curl -I https://circleprotek.com 2>/dev/null | head -3
else
    echo ""
    echo "❌ === ERREUR LORS DU DÉPLOIEMENT ==="
    echo "Vérifiez vos paramètres FTP"
fi