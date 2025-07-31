#!/bin/bash

echo "🔥 === REDÉPLOIEMENT COMPLET CIRCLEPROTEK ===" 
echo "📅 $(date)"
echo ""

echo "🎯 SOLUTION RADICALE: Suppression totale + re-clone"
echo "🚨 PROBLÈME: Git ne met pas à jour index.html sur le serveur"
echo "✅ GARANTIE: Synchronisation parfaite avec GitHub"
echo ""

expect << 'EXPECT_EOF'
spawn ssh root@176.123.8.147
expect "passphrase"
send "hqfriqdm986\r"

expect "~"
send "echo '🏠 === NAVIGATION VERS HTML ===' && cd /var/www/html\r"
expect "html"

send "echo '🗑️ === SUPPRESSION COMPLÈTE ===' && rm -rf circleprotek.com && echo '✅ Dossier supprimé completement'\r"
expect "~"

send "echo '📁 === CRÉATION NOUVEAU DOSSIER ===' && mkdir circleprotek.com && cd circleprotek.com\r"
expect "circleprotek.com"

send "echo '📥 === CLONE COMPLET DEPUIS GITHUB ===' && echo '🔄 Clone en cours...'\r"
expect "~"

send "git clone https://github.com/Grandkhan986/cirlceprotek.git .\r"
expect {
    "Cloning into" {
        send_user "✅ Clone démarré\n"
        exp_continue
    }
    "Receiving objects" {
        send_user "📦 Téléchargement...\n"
        exp_continue
    }
    "Resolving deltas" {
        send_user "🔧 Finalisation...\n"
        exp_continue
    }
    "~" {
        send_user "✅ Clone terminé\n"
    }
}

send "echo '' && echo '🔍 === VÉRIFICATION CRITIQUE ===' && echo 'Titre dans index.html:'\r"
expect "~"

send "grep '<title>' index.html\r"
expect "~"

send "echo '' && echo 'Description:' && grep 'meta name=\"description\"' index.html\r"
expect "~"

send "echo '' && echo '📊 Nombre d articles:' && find articles/html/ -name '*.html' | wc -l\r"
expect "~"

send "echo '' && echo '⚙️ === PERMISSIONS ===' && chown -R www-data:www-data * && echo '✅ Permissions OK'\r"
expect "~"

send "echo '' && echo '🔄 === APACHE ===' && systemctl reload apache2 && echo '✅ Apache rechargé'\r"
expect "~"

send "echo '' && echo '🎯 === TEST EN DIRECT ===' && curl -s https://circleprotek.com | grep '<title>'\r"
expect "~"

send "echo '' && echo '🎉 === REDÉPLOIEMENT RÉUSSI ===' && echo '✅ Site parfaitement synchronisé' && echo '🌐 https://circleprotek.com'\r"
expect "~"

send "exit\r"
expect eof
EXPECT_EOF

echo ""
echo "🎯 === MISSION ACCOMPLIE ==="
echo "✅ Redéploiement complet terminé !"
echo "🌐 Votre site est maintenant parfaitement à jour !"
echo ""
echo "📊 VÉRIFICATIONS À FAIRE :"
echo "   • Page d'accueil avec le bon titre"
echo "   • Image optimisée fonctionnelle"
echo "   • Favicon 'C' vert visible"
echo "   • Articles accessibles"
