#!/bin/bash

echo "🚀 === DÉPLOIEMENT FTP CIRCLEPROTEK ==="
echo "📅 $(date)"

# Configuration FTP (à adapter selon vos paramètres)
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

# Déploiement avec lftp
echo ""
echo "📤 === TRANSFERT FTP EN COURS ==="

lftp -u "$FTP_USER,$FTP_PASS" "$FTP_HOST" << EOF
set ftp:ssl-allow false
set ssl:verify-certificate false
cd "$FTP_DIR"
lcd "$LOCAL_DIR"

# Supprimer l'ancien contenu (sauf .htaccess)
mget -d .htaccess 2>/dev/null || true
rm -rf *
mput .htaccess 2>/dev/null || true

# Upload de tous les fichiers
mirror -R --delete --exclude-glob=".git/*" --exclude-glob=".DS_Store" --exclude-glob="deploy-*.sh" . .

# Vérification
ls -la
quit
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ === DÉPLOIEMENT RÉUSSI ==="
    echo "🌐 Site disponible à: https://circleprotek.com"
    echo "📅 Fin: $(date)"
else
    echo ""
    echo "❌ === ERREUR LORS DU DÉPLOIEMENT ==="
    echo "Vérifiez vos paramètres FTP"
fi