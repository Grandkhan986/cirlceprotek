#!/bin/bash

echo "🔧 Configuration Apache pour circleprotek.com"

# Créer la configuration pour circleprotek.com
cat > /etc/apache2/sites-available/circleprotek.com.conf << 'EOF'
<VirtualHost *:80>
    ServerName circleprotek.com
    ServerAlias www.circleprotek.com
    DocumentRoot /var/www/html
    
    <Directory /var/www/html>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/circleprotek_error.log
    CustomLog ${APACHE_LOG_DIR}/circleprotek_access.log combined
</VirtualHost>
EOF

echo "✅ Configuration créée"

# Activer le site
a2ensite circleprotek.com.conf
echo "✅ Site activé"

# Désactiver le site par défaut
a2dissite 000-default.conf
echo "✅ Site par défaut désactivé"

# Relancer Apache
systemctl reload apache2
echo "✅ Apache rechargé"

# Vérifier la configuration
apache2ctl -S

echo "🎉 Configuration terminée !"
echo "Testez maintenant: https://circleprotek.com"