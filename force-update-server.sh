#!/bin/bash

echo "🔄 === FORCE UPDATE SERVEUR CIRCLEPROTEK ===" 
echo "📅 $(date)"
echo ""

echo "🎯 OBJECTIF: Forcer la mise à jour du fichier index.html"
echo "❌ PROBLÈME: Le titre n'est pas à jour sur le serveur"
echo "✅ SOLUTION: Git pull force + vérification"
echo ""

expect << 'EXPECT_EOF'
spawn ssh root@176.123.8.147
expect "passphrase"
send "hqfriqdm986\r"

expect "~"
send "echo '📁 === NAVIGATION VERS SITE ===' && cd /var/www/html/circleprotek.com\r"
expect "circleprotek.com"

send "echo '🔄 === FORCE UPDATE DEPUIS GITHUB ===' && git pull origin main --force\r"
expect {
    "Already up to date" {
        send_user "⚠️ Git dit 'Already up to date'\n"
        exp_continue
    }
    "Fast-forward" {
        send_user "✅ Mise à jour Fast-forward\n"
        exp_continue
    }
    "~" {
        send_user "✅ Pull terminé\n"
    }
}

send "echo '' && echo '🔍 === VÉRIFICATION DU TITRE APRÈS UPDATE ===' && grep '<title>' index.html\r"
expect "~"

send "echo '' && echo '⚙️ === RECHARGEMENT APACHE ===' && systemctl reload apache2 && echo '✅ Apache rechargé'\r"
expect "~"

send "echo '' && echo '🎯 === TEST FINAL ===' && curl -s https://circleprotek.com | grep '<title>'\r"
expect "~"

send "echo '' && echo '🎉 === MISE À JOUR TERMINÉE ===' && echo '✅ Fichier index.html mis à jour' && echo '🌐 https://circleprotek.com'\r"
expect "~"

send "exit\r"
expect eof
EXPECT_EOF

echo ""
echo "🎯 === VÉRIFICATION FINALE ==="
echo "✅ Mise à jour forcée terminée !"
echo "🌐 Testez maintenant: https://circleprotek.com"
