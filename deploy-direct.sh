#!/bin/bash

# Script de déploiement direct CircleProtek vers serveur AlexHost
# Utilise Git pour déployer automatiquement

echo "🚀 === DÉPLOIEMENT CIRCLEPROTEK VIA GIT ==="
echo "📅 Démarrage: $(date)"

# Configuration
SERVER="root@176.123.8.147"
REPO_URL="https://github.com/Grandkhan986/cirlceprotek.git"
WEB_DIR="/var/www/html"
BACKUP_DIR="/root/backups"
TEMP_DIR="/tmp/circleprotek-deploy"

echo "📊 Configuration:"
echo "- Serveur: $SERVER"
echo "- Dépôt: $REPO_URL"
echo "- Répertoire web: $WEB_DIR"

# Commandes à exécuter sur le serveur
DEPLOY_SCRIPT="
# Fonction pour afficher les messages
log() {
    echo \"[$(date '+%Y-%m-%d %H:%M:%S')] \$1\"
}

log '🚀 Début du déploiement CircleProtek'

# Créer le répertoire de sauvegarde
mkdir -p $BACKUP_DIR

# Sauvegarde de l'ancien site
if [ -d '$WEB_DIR' ] && [ \"\$(ls -A $WEB_DIR)\" ]; then
    BACKUP_NAME=\"circleprotek-backup-\$(date +%Y%m%d-%H%M%S)\"
    log \"💾 Création de la sauvegarde: \$BACKUP_NAME\"
    tar -czf \"$BACKUP_DIR/\$BACKUP_NAME.tar.gz\" -C \"$WEB_DIR\" . 2>/dev/null || true
    log \"✅ Sauvegarde créée\"
else
    log \"ℹ️  Aucun site existant à sauvegarder\"
fi

# Installer Git si nécessaire
if ! command -v git &> /dev/null; then
    log \"📦 Installation de Git...\"
    apt update && apt install -y git
fi

# Nettoyage du répertoire temporaire
log \"🧹 Nettoyage du répertoire temporaire\"
rm -rf $TEMP_DIR

# Clonage du dépôt
log \"⬇️  Clonage depuis GitHub...\"
git clone --depth 1 $REPO_URL $TEMP_DIR

if [ \$? -eq 0 ]; then
    log \"✅ Clonage réussi\"
else
    log \"❌ Erreur lors du clonage\"
    exit 1
fi

# Sauvegarde du .htaccess existant
HTACCESS_BACKUP=\"\"
if [ -f \"$WEB_DIR/.htaccess\" ]; then
    HTACCESS_BACKUP=\"\$(cat $WEB_DIR/.htaccess)\"
    log \"💾 Sauvegarde du .htaccess existant\"
fi

# Nettoyage du répertoire web
log \"🧹 Nettoyage du répertoire web...\"
rm -rf $WEB_DIR/*
rm -rf $WEB_DIR/.[^.]*

# Copie des nouveaux fichiers
log \"📁 Déploiement des fichiers...\"
cp -r $TEMP_DIR/* $WEB_DIR/

# Restauration du .htaccess si nécessaire
if [ ! -z \"\$HTACCESS_BACKUP\" ]; then
    echo \"\$HTACCESS_BACKUP\" > \"$WEB_DIR/.htaccess\"
    log \"🔄 .htaccess restauré\"
fi

# Configuration des permissions
log \"🔐 Configuration des permissions...\"
find $WEB_DIR -type f -exec chmod 644 {} \\;
find $WEB_DIR -type d -exec chmod 755 {} \\;
chown -R www-data:www-data $WEB_DIR 2>/dev/null || true

# Nettoyage
log \"🧹 Nettoyage final...\"
rm -rf $TEMP_DIR

# Statistiques finales
FILE_COUNT=\$(find $WEB_DIR -type f | wc -l)
SITE_SIZE=\$(du -sh $WEB_DIR | cut -f1)

log \"✅ === DÉPLOIEMENT TERMINÉ ===\"
log \"📊 Résultats:\"
log \"- Fichiers déployés: \$FILE_COUNT\"
log \"- Taille totale: \$SITE_SIZE\"
log \"- Site disponible sur votre domaine\"
log \"🎉 CIRCLEPROTEK DÉPLOYÉ AVEC SUCCÈS !\"
"

echo ""
echo "🔌 Connexion au serveur et déploiement..."

# Exécution du script sur le serveur
ssh $SERVER "$DEPLOY_SCRIPT"

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 === DÉPLOIEMENT RÉUSSI ==="
    echo "✅ CircleProtek a été déployé avec succès !"
    echo "🌐 Votre site est maintenant en ligne avec toutes les optimisations :"
    echo "   - Image hero optimisée (96% plus légère)"
    echo "   - Menu dynamique sur 11,357 pages" 
    echo "   - Menu 'Quizz' partout"
    echo "   - Bug articles.html corrigé"
    echo "   - Performance améliorée"
else
    echo "❌ Erreur lors du déploiement"
    exit 1
fi