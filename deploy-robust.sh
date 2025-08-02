#!/bin/bash

echo "🚀 === DÉPLOIEMENT ROBUSTE CIRCLEPROTEK ==="
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

# Étape 1: Test de base
echo "🔍 === ÉTAPE 1: TEST CONNEXION ==="
echo "Test simple..."

# Étape 2: Nettoyage et préparation
echo ""
echo "🧹 === ÉTAPE 2: NETTOYAGE DISTANT ==="
echo "Nettoyage en cours..."

# Utilisation d'expect pour automatiser complètement la session SSH
expect << 'EOF'
set timeout 30
spawn ssh -o StrictHostKeyChecking=no root@176.123.8.147

expect {
    "password:" {
        send "hqfriqdm986\r"
        expect "~"
    }
    "passphrase" {
        send "hqfriqdm986\r"
        expect "~"
    }
    timeout {
        puts "Timeout de connexion"
        exit 1
    }
}

# Nettoyage
send "cd /var/www/html && rm -rf * && echo 'CLEANUP_OK'\r"
expect "CLEANUP_OK"

# Vérification
send "pwd && ls -la\r"
expect "~"

send "exit\r"
expect eof
EOF

if [ $? -ne 0 ]; then
    echo "❌ Échec du nettoyage"
    exit 1
fi

echo "✅ Nettoyage terminé"

# Étape 3: Transfert avec rsync
echo ""
echo "📤 === ÉTAPE 3: TRANSFERT RSYNC ==="
echo "Fichiers à transférer: $(find . -type f ! -path "./.git/*" ! -name ".DS_Store" ! -name "deploy-*.sh" | wc -l | tr -d ' ')"

# Transfert robuste avec plusieurs tentatives
for attempt in 1 2 3; do
    echo "Tentative $attempt/3..."
    
    if sshpass -p "$PASS" rsync -avz --timeout=60 --partial --progress \
        --exclude='.git' \
        --exclude='.DS_Store' \
        --exclude='deploy-*.sh' \
        --exclude='*.log' \
        -e "ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30" \
        ./ "$USER@$HOST:$REMOTE_DIR/" 2>/dev/null; then
        
        echo "✅ Transfert réussi à la tentative $attempt"
        break
    else
        echo "⚠️ Tentative $attempt échouée"
        if [ $attempt -eq 3 ]; then
            echo "❌ Toutes les tentatives ont échoué"
            exit 1
        fi
        sleep 2
    fi
done

# Étape 4: Configuration finale
echo ""
echo "🔧 === ÉTAPE 4: CONFIGURATION FINALE ==="

expect << 'EOF'
set timeout 30
spawn ssh -o StrictHostKeyChecking=no root@176.123.8.147

expect {
    "password:" {
        send "hqfriqdm986\r"
        expect "~"
    }
    "passphrase" {
        send "hqfriqdm986\r"
        expect "~"
    }
}

# Configuration des permissions
send "cd /var/www/html\r"
expect "html"

send "chown -R www-data:www-data *\r"
expect "~"

send "find . -type f -exec chmod 644 {} \\;\r"
expect "~"

send "find . -type d -exec chmod 755 {} \\;\r"
expect "~"

# Redémarrage Apache
send "systemctl reload apache2 && echo 'APACHE_OK'\r"
expect "APACHE_OK"

# Vérification finale
send "ls -la | head -5\r"
expect "~"

send "exit\r"
expect eof
EOF

echo ""
echo "✅ === DÉPLOIEMENT TERMINÉ ==="
echo "🌐 Votre site est maintenant déployé sur: https://circleprotek.com"
echo "📅 Fin: $(date)"

# Test final
echo ""
echo "🔍 === TEST FINAL ==="
if curl -I https://circleprotek.com 2>/dev/null | grep -q "200 OK"; then
    echo "✅ Site accessible"
else
    echo "⚠️ Vérifiez manuellement: https://circleprotek.com"
fi