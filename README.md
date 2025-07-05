# 🎯 eSpomienka Git-based CMS

Moderný Git-based CMS systém pre eSpomienka blog s admin panelom a JSON dátovou štruktúrou.

## ✅ Implementované funkcie

### **Admin Panel**
- 📝 Kompletný admin panel na `/admin/blog-admin.html`
- 🎨 Moderný dizajn s eSpomienka farbami (zlatá #DAA520)
- 📱 Mobile-responsive rozhranie
- 🖼️ Upload a preview obrázkov
- ✏️ Rich text editor pre obsah článkov

### **Git Workflow**
- 📤 Export JSON súborov pre Git commits
- 🔄 Automatické načítavanie existujúcich dát
- 💾 Lokálne ukladanie zmien
- 🚀 Jednoduchý workflow: Edit → Export → Commit → Deploy

### **Blog Engine**
- 📊 Dynamické načítavanie z JSON súborov
- 🔢 Automatická paginácia
- 🏷️ Kategórie s počítadlami
- 📅 Triedenie podľa dátumu
- 🎯 SEO-friendly URL štruktúra

## 🚀 Ako používať

### **1. Lokálna editácia**
```bash
# Otvor admin panel
open admin/blog-admin.html

# Edituj články, pridaj nové
# Klikni "📤 Export pre Git"
```

### **2. Git commit**
```bash
# Nahraj exportované súbory
cp posts.json data/
cp categories.json data/
cp settings.json data/

# Commit zmeny
git add .
git commit -m "Update blog articles"
git push origin main
```

### **3. Auto-deploy**
- Vercel/Netlify automaticky deployuje
- Blog sa aktualizuje za 1-2 minúty

## 🎯 Výhody Git CMS

✅ **Verzionovanie** - história všetkých zmien  
✅ **Backup** - Git je automatický backup  
✅ **Collaboration** - viacero ľudí môže editovať  
✅ **Fast** - statické súbory = rýchla stránka  
✅ **Free** - žiadne mesačné poplatky  
✅ **Portable** - môžeš zmeniť hosting kedykoľvek

**Perfektné riešenie pre malý až stredný blog! 🎯**
