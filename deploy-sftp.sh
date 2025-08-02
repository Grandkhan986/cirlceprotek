#!/bin/bash

echo "🚀 === DÉPLOIEMENT SFTP CIRCLEPROTEK ==="
echo "📅 $(date)"

# Configuration
REMOTE_HOST="176.123.8.147"
REMOTE_USER="root"
REMOTE_PASS="hqfriqdm986"
REMOTE_DIR="/var/www/html"
LOCAL_DIR="."

echo "📊 Configuration:"
echo "- Serveur: $REMOTE_HOST"
echo "- Utilisateur: $REMOTE_USER"
echo "- Répertoire distant: $REMOTE_DIR"

# Test connexion SSH
echo ""
echo "🔍 === TEST CONNEXION SSH ==="
sshpass -p "$REMOTE_PASS" ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" "echo 'Connexion SSH OK' && pwd && ls -la $REMOTE_DIR | head -5"

if [ $? -ne 0 ]; then
    echo "❌ Échec connexion SSH"
    exit 1
fi

echo ""
echo "🧹 === NETTOYAGE DISTANT ==="
sshpass -p "$REMOTE_PASS" ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" "cd $REMOTE_DIR && rm -rf * && echo 'Nettoyage terminé'"

echo ""
echo "📤 === TRANSFERT AVEC RSYNC ==="
echo "Nombre de fichiers à transférer: $(find . -type f ! -path "./.git/*" ! -name ".DS_Store" ! -name "deploy-*.sh" | wc -l)"

# Transfert avec rsync via SSH
sshpass -p "$REMOTE_PASS" rsync -avz --progress --delete \
    --exclude='.git' \
    --exclude='.DS_Store' \
    --exclude='deploy-*.sh' \
    -e "ssh -o StrictHostKeyChecking=no" \
    "$LOCAL_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"

if [ $? -eq 0 ]; then
    echo ""
    echo "🔧 === CONFIGURATION SERVEUR ==="
    sshpass -p "$REMOTE_PASS" ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" "
        cd $REMOTE_DIR
        chown -R www-data:www-data *
        find . -type f -exec chmod 644 {} \;
        find . -type d -exec chmod 755 {} \;
        systemctl reload apache2
        echo 'Configuration terminée'
        echo 'Fichiers présents:'
        ls -la | head -10
    "
    
    echo ""
    echo "✅ === DÉPLOIEMENT RÉUSSI ==="
    echo "🌐 Site disponible à: https://circleprotek.com"
    echo "📅 Fin: $(date)"
    
    echo ""
    echo "🔍 === TEST FINAL ==="
    curl -I https://circleprotek.com 2>/dev/null | head -3 || echo "Test curl échoué"
else
    echo ""
    echo "❌ === ÉCHEC DU TRANSFERT ==="
fi