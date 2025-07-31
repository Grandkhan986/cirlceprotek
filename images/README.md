# Images Organization - CircleProtek Website

This directory contains all images used on the CircleProtek website, organized by category for better maintainability.

## 📁 Directory Structure

```
images/
├── hero/           # Hero section images
├── logos/          # CircleProtek logos and branding
├── team/           # Team member photos
├── products/       # Product covers and marketing images
├── equipment/      # Security equipment photos
└── news/           # News and blog images
```

## 📸 Current Images

### 🏠 Hero Section (`hero/`)
- `cheerful-family-with-labrador-dog-looking-at-camer-2024-11-01-00-47-21-utc.jpg` - Main hero image featuring family with "Secure your Family" message

### 🎨 Logos (`logos/`)
- `circle protek.png` - Main CircleProtek logo (dark version)
- `circle protek-white.png` - CircleProtek logo white version

### 👥 Team (`team/`)
- `johnbutler-circleprotek.png` - John Butler profile image
- `tony.tautai_Un_homme_americain_de_65_ans_ancien_militaire_medai_e5350c17-b718-4b4b-854f-299e9e87da57.png` - Tony Tautai profile image

### 📦 Products (`products/`)
- `cover-circleprotek.png` - Product cover image
- `cover2-circleprotek.png` - Alternative product cover
- `bfb5433eb97cce83081dd8c61b8ee679.webp` - Product showcase image

### 🛡️ Equipment (`equipment/`)
- `camera-security.png` - Security camera product image
- `round-cctv-camera-with-antennas-shoots-video-on-th-2023-11-27-04-59-41-utc.jpg` - CCTV camera with antennas
- `BELIA-4K-8MP-WiFi-Surveillance-Camera-Dual-Lens-4X-Digital-Zoom-AI-Human-Detect-ONVIF-Outdoor.avif` - High-res surveillance camera
- `trackers.jpg` - Security tracker devices
- `Floodlights.jpg` - Security floodlight equipment

### 📰 News (`news/`)
- *Empty - Reserved for future news/blog images*

## 🔧 Usage Guidelines

### Adding New Images
1. Choose the appropriate category folder
2. Use descriptive filenames
3. Optimize images for web (WebP format preferred)
4. Update this README when adding new categories

### File Naming Convention
- Use lowercase with hyphens: `security-camera-outdoor.jpg`
- Include relevant keywords: `circleprotek-logo-white.png`
- Avoid spaces and special characters

### Image Optimization
- **Hero images**: Max 1920px width, optimized for fast loading
- **Logos**: SVG preferred, PNG for complex designs
- **Products**: High quality but compressed (WebP/AVIF)
- **Equipment**: Product photos should be clean and well-lit

## 📝 HTML Usage Examples

```html
<!-- Hero image -->
<img src="./images/hero/family-security.jpg" alt="Secure your Family">

<!-- Logo -->
<img src="./images/logos/circle-protek-white.png" alt="CircleProtek Logo">

<!-- Product image -->
<img src="./images/products/security-package.webp" alt="Security Package">

<!-- Equipment -->
<img src="./images/equipment/surveillance-camera.jpg" alt="4K Surveillance Camera">
```

## 🚀 Future Enhancements

- [ ] Convert all images to WebP/AVIF format
- [ ] Create responsive image variants (thumbnails, mobile)
- [ ] Add lazy loading placeholders
- [ ] Implement CDN integration
- [ ] Add image compression automation

---
*Last updated: December 2024* 