#!/bin/bash

echo "🚀 === DÉPLOIEMENT AVEC PROGRESSION DÉTAILLÉE ==="
echo "📅 $(date)"

# Configuration
HOST="176.123.8.147"
USER="root"
PASS="hqfriqdm986"
REMOTE_DIR="/var/www/html"

echo "📊 Configuration:"
echo "- Serveur: $HOST"
echo "- Utilisateur: $USER"
echo "- Répertoire: $REMOTE_DIR"
echo ""

# Compter les fichiers et taille totale
echo "📏 === ANALYSE DES FICHIERS À TRANSFÉRER ==="
TOTAL_FILES=$(find . -type f ! -path "./.git/*" ! -name ".DS_Store" ! -name "deploy-*.sh" | wc -l | tr -d ' ')
TOTAL_SIZE=$(find . -type f ! -path "./.git/*" ! -name ".DS_Store" ! -name "deploy-*.sh" -exec ls -l {} \; | awk '{total += $5} END {print total}')
TOTAL_SIZE_MB=$(echo "scale=2; $TOTAL_SIZE / 1024 / 1024" | bc)

echo "📁 Fichiers à transférer: $TOTAL_FILES"
echo "💾 Taille totale: ${TOTAL_SIZE_MB} MB"
echo ""

# Étape 1: Nettoyage rapide
echo "🧹 === NETTOYAGE DISTANT ==="
expect << 'EOF'
set timeout 30
spawn ssh -o StrictHostKeyChecking=no root@176.123.8.147

expect {
    "passphrase" {
        send "hqfriqdm986\r"
        expect "~"
    }
    "password:" {
        send "hqfriqdm986\r"
        expect "~"
    }
}

send "cd /var/www/html && rm -rf * && echo 'CLEANUP_DONE'\r"
expect "CLEANUP_DONE"
send "exit\r"
expect eof
EOF

echo "✅ Nettoyage terminé"
echo ""

# Étape 2: Transfert avec progression détaillée
echo "📤 === TRANSFERT RSYNC AVEC PROGRESSION ==="
echo "┌────────────────────────────────────────────────────────────┐"
echo "│                    PROGRESSION DU TRANSFERT                │"
echo "└────────────────────────────────────────────────────────────┘"

# Créer un fichier temporaire pour capturer la progression
PROGRESS_FILE="/tmp/rsync_progress_$$"

# Lancer rsync avec progression détaillée en arrière-plan
(
    sshpass -p "$PASS" rsync -avz --progress --stats \
        --exclude='.git' \
        --exclude='.DS_Store' \
        --exclude='deploy-*.sh' \
        --exclude='*.log' \
        -e "ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30" \
        ./ "$USER@$HOST:$REMOTE_DIR/" 2>&1 | tee "$PROGRESS_FILE"
) &

RSYNC_PID=$!

# Surveiller la progression
sleep 2
while kill -0 $RSYNC_PID 2>/dev/null; do
    if [ -f "$PROGRESS_FILE" ]; then
        # Extraire les informations de progression
        CURRENT_FILE=$(tail -10 "$PROGRESS_FILE" | grep -E "^[^/]*\..*" | tail -1 | awk '{print $1}')
        TRANSFERRED_FILES=$(grep -c "^[^/]*\.[^/]*$" "$PROGRESS_FILE" 2>/dev/null || echo "0")
        
        if [ ! -z "$CURRENT_FILE" ] && [ "$TRANSFERRED_FILES" -gt 0 ]; then
            PERCENT=$(echo "scale=1; ($TRANSFERRED_FILES * 100) / $TOTAL_FILES" | bc 2>/dev/null || echo "0")
            
            # Créer une barre de progression
            PROGRESS_BAR_WIDTH=40
            FILLED=$(echo "scale=0; ($PERCENT * $PROGRESS_BAR_WIDTH) / 100" | bc 2>/dev/null || echo "0")
            
            printf "\r🔄 Progression: ["
            for ((i=1; i<=PROGRESS_BAR_WIDTH; i++)); do
                if [ $i -le $FILLED ]; then
                    printf "█"
                else
                    printf "░"
                fi
            done
            printf "] %s%% (%s/%s fichiers) - %s" "$PERCENT" "$TRANSFERRED_FILES" "$TOTAL_FILES" "$(basename "$CURRENT_FILE")"
        else
            printf "\r🔄 Initialisation du transfert..."
        fi
    fi
    sleep 1
done

# Attendre la fin du processus rsync
wait $RSYNC_PID
RSYNC_EXIT_CODE=$?

echo ""
echo ""

if [ $RSYNC_EXIT_CODE -eq 0 ]; then
    echo "✅ Transfert terminé avec succès!"
    
    # Afficher les statistiques finales
    if [ -f "$PROGRESS_FILE" ]; then
        echo ""
        echo "📊 === STATISTIQUES DU TRANSFERT ==="
        grep -E "(Number of files|Total file size|Total transferred)" "$PROGRESS_FILE" | while read line; do
            echo "   $line"
        done
    fi
else
    echo "❌ Erreur lors du transfert (code: $RSYNC_EXIT_CODE)"
    exit 1
fi

# Nettoyage du fichier temporaire
rm -f "$PROGRESS_FILE"

# Étape 3: Configuration finale
echo ""
echo "🔧 === CONFIGURATION FINALE ==="

expect << 'EOF'
set timeout 30
spawn ssh -o StrictHostKeyChecking=no root@176.123.8.147

expect {
    "passphrase" {
        send "hqfriqdm986\r"
        expect "~"
    }
    "password:" {
        send "hqfriqdm986\r"
        expect "~"
    }
}

send "cd /var/www/html\r"
expect "html"

send "chown -R www-data:www-data * && echo 'PERMISSIONS_OK'\r"
expect "PERMISSIONS_OK"

send "systemctl reload apache2 && echo 'APACHE_OK'\r"
expect "APACHE_OK"

send "ls -la | head -5\r"
expect "~"

send "exit\r"
expect eof
EOF

echo ""
echo "🎉 === DÉPLOIEMENT TERMINÉ AVEC SUCCÈS ==="
echo "🌐 Votre site CircleProtek est maintenant en ligne:"
echo "   ↗ https://circleprotek.com"
echo "📅 Fin: $(date)"

# Test final
echo ""
echo "🔍 === VÉRIFICATION FINALE ==="
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://circleprotek.com 2>/dev/null || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Site accessible (HTTP $HTTP_STATUS)"
    echo "🏆 DÉPLOIEMENT RÉUSSI!"
else
    echo "⚠️  Status HTTP: $HTTP_STATUS - Vérifiez manuellement"
fi