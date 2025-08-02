#!/bin/bash

# Script de déploiement automatique CircleProtek vers AlexHost
# À placer sur le serveur AlexHost et à configurer avec un webhook GitHub

echo "🚀 === DÉPLOIEMENT CIRCLEPROTEK VERS ALEXHOST ==="
echo "📅 Démarrage: $(date)"

# Configuration du déploiement
REPO_URL="https://github.com/Grandkhan986/cirlceprotek.git"
WEB_DIR="/home/[votre-username]/public_html"  # À adapter selon votre configuration AlexHost
BACKUP_DIR="/home/[votre-username]/backups"   # À adapter
BRANCH="main"

echo "📊 Configuration:"
echo "- Dépôt: $REPO_URL"
echo "- Répertoire web: $WEB_DIR"
echo "- Branche: $BRANCH"

# Créer une sauvegarde
echo ""
echo "💾 === SAUVEGARDE DE L'ANCIEN SITE ==="
BACKUP_NAME="circleprotek-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

if [ -d "$WEB_DIR" ]; then
    echo "📦 Création de la sauvegarde: $BACKUP_NAME"
    tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$WEB_DIR" .
    echo "✅ Sauvegarde créée: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
else
    echo "ℹ️  Aucun site existant à sauvegarder"
fi

# Cloner ou mettre à jour le dépôt
echo ""
echo "📥 === TÉLÉCHARGEMENT DU NOUVEAU SITE ==="
TEMP_DIR="/tmp/circleprotek-deploy"

if [ -d "$TEMP_DIR" ]; then
    echo "🧹 Nettoyage du répertoire temporaire"
    rm -rf "$TEMP_DIR"
fi

echo "⬇️  Clonage depuis GitHub..."
git clone --branch "$BRANCH" --depth 1 "$REPO_URL" "$TEMP_DIR"

if [ $? -eq 0 ]; then
    echo "✅ Clonage réussi"
else
    echo "❌ Erreur lors du clonage"
    exit 1
fi

# Déployer les fichiers
echo ""
echo "🔄 === DÉPLOIEMENT DES FICHIERS ==="

# Supprimer l'ancien contenu (sauf .htaccess si présent)
if [ -d "$WEB_DIR" ]; then
    echo "🧹 Nettoyage du répertoire web..."
    find "$WEB_DIR" -mindepth 1 ! -name '.htaccess' -delete
fi

# Créer le répertoire web s'il n'existe pas
mkdir -p "$WEB_DIR"

# Copier les nouveaux fichiers
echo "📁 Copie des fichiers..."
cp -r "$TEMP_DIR"/* "$WEB_DIR"/

# Définir les permissions appropriées
echo "🔐 Configuration des permissions..."
find "$WEB_DIR" -type f -exec chmod 644 {} \;
find "$WEB_DIR" -type d -exec chmod 755 {} \;

# Nettoyage
echo ""
echo "🧹 === NETTOYAGE ==="
rm -rf "$TEMP_DIR"

# Vérifications finales
echo ""
echo "✅ === DÉPLOIEMENT TERMINÉ ==="
echo "📊 Résultats:"
echo "- Fichiers déployés: $(find "$WEB_DIR" -type f | wc -l)"
echo "- Taille totale: $(du -sh "$WEB_DIR" | cut -f1)"
echo "- Site disponible à: http://[votre-domaine.com]"
echo "📅 Fin: $(date)"

echo ""
echo "🎉 CIRCLEPROTEK DÉPLOYÉ AVEC SUCCÈS SUR ALEXHOST !"