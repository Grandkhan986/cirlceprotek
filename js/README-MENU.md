# 🎯 Menu Dynamique CircleProtek

## 📋 Description
Système de menu centralisé qui permet de modifier le menu sur tout le site depuis un seul fichier.

## ⚡ Avantages
- ✅ **Centralisation** : Un seul fichier à modifier (`js/menu.js`)
- ✅ **Automatique** : Le menu se met à jour partout automatiquement
- ✅ **Responsive** : Gère automatiquement les menus desktop et mobile
- ✅ **Intelligent** : Détecte automatiquement la page active
- ✅ **Flexible** : Gère les liens relatifs selon la profondeur des pages

## 🛠️ Comment modifier le menu

### 1. Modifier les éléments du menu
Éditer le fichier `js/menu.js` et modifier l'objet `MENU_CONFIG` :

```javascript
const MENU_CONFIG = {
    items: [
        {
            id: "home",
            text: "Home",      // ← Modifier le texte ici
            href: "#home",
            icon: "🏠"
        },
        {
            id: "test", 
            text: "Quizz",     // ← Ici c'était "Test", maintenant "Quizz"
            href: "#test",
            icon: "📝"
        }
        // ... ajouter d'autres éléments
    ]
};
```

### 2. Ajouter un nouvel élément au menu
```javascript
{
    id: "nouveau",
    text: "Nouveau",
    href: "#nouveau",
    icon: "🆕"
}
```

### 3. Modifier le logo
```javascript
logo: {
    text: "CircleProtek",    // ← Modifier le nom ici
    homeLink: "index.html"
}
```

## 🔧 Fonctionnalités avancées

### Détection automatique de page
Le système détecte automatiquement :
- Page d'accueil (`index.html`)
- Page articles (`articles.html`)
- Pages d'articles individuelles (`articles/html/`)

### Liens relatifs intelligents
- Sur `index.html` : `#test`
- Sur `articles.html` : `index.html#test`  
- Sur `articles/html/page.html` : `../../index.html#test`

## 📁 Structure des fichiers
```
circleprotek-deploy-final/
├── js/
│   ├── menu.js           ← Configuration et logique du menu
│   └── README-MENU.md    ← Ce fichier
├── index.html            ← Inclut le menu dynamique ✅
├── articles.html         ← Inclut le menu dynamique ✅
└── articles/html/        ← 11,355 pages avec menu dynamique ✅
```

## 🎯 Pages intégrées
- **✅ Page d'accueil** (`index.html`)
- **✅ Page articles** (`articles.html`) 
- **✅ Toutes les pages d'articles** (`articles/html/*.html`) - **11,355 pages !**

## 🚀 Pour ajouter le menu à une nouvelle page

1. Ajouter le script dans le `<head>` ou avant `</body>` :
```html
<script src="js/menu.js"></script>
```

2. Le menu se génère automatiquement !

## 🎨 Personnalisation

### Modifier les icônes
```javascript
icon: "📝"  // Emoji ou code HTML
```

### Ajouter des sous-menus (futur)
Le système peut être étendu pour supporter des sous-menus.

## ⚠️ Important
- Toujours modifier le menu dans `js/menu.js`
- Ne plus modifier les menus directement dans les fichiers HTML
- Le script se charge automatiquement au chargement de la page