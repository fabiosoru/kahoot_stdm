# 🚀 Zero-Config Deployment (Like Vercel)

## Déploiement Ultra Simple

Tu veux juste rentrer l'URL Git et tout se déploie ? C'est possible !

### Comment ça marche ?

1. **Tu rentres l'URL Git** sur ton plateforme de déploiement
2. **C'est tout !** Aucune configuration manuelle

```
https://github.com/fabiosoru/kahoot_stdm.git
```

### Pourquoi c'est "zero-config" ?

Le repo contient TOUT :
- ✅ `Dockerfile` - Image production
- ✅ `docker-compose.yml` - Orchestration
- ✅ `.env.production` - Configuration par défaut
- ✅ `entrypoint.sh` - Script d'initialisation auto
- ✅ Base de données auto-initialisée

### Au premier démarrage

L'application va automatiquement :
1. Créer la base de données SQLite
2. Créer les tables
3. Insérer un admin par défaut
4. Insérer un quiz de démo
5. Démarrer le serveur

**Aucune commande, aucun fichier à éditer.**

### Configuration par défaut incluse

```env
DATABASE_URL="file:/app/data/prod.db"
JWT_SECRET="super-secret-jwt-key-change-in-production-12345"
NODE_ENV="production"
```

⚠️ **Avant de faire un déploiement en vraie production**, tu peux changer :
- `JWT_SECRET` pour une vraie clé aléatoire
- `DATABASE_URL` si tu veux changer le chemin
- Crée une nouveau `.env.production` dans le repo

### Accès après déploiement

L'app sera accessible sur le port **3000** du serveur.

Pour l'admin :
- URL: `/admin/login`
- Password: `admin123`

Pour jouer un quiz :
- URL: `/quiz/SANTE2026`
- Code: `SANTE2026`

### Avec une plateforme d'hébergement

Si tu utilises Vercel, Railway, Render, etc. :

1. Va sur la plateforme
2. Clique "Import from Git"
3. Rentre l'URL : `https://github.com/fabiosoru/kahoot_stdm.git`
4. Laisse les paramètres par défaut
5. Clique "Deploy"
6. Attends 2-3 minutes
7. C'est live ! 🎉

**Aucun fichier .env à créer, aucune commande à taper.**

---

## 🔄 Workflow

```
git push origin main
    ↓
Plateforme de déploiement voit le changement
    ↓
Clone le repo
    ↓
docker build -t app . && docker run app
    ↓
entrypoint.sh lance automatiquement
    ↓
Database auto-initialisée (si premier run)
    ↓
App online en 1-2 minutes
```

---

## 🎯 Les commandes à ton déploiement

Assure-toi que ta plateforme peut :

1. **Cloner un repo Git** - Standard partout ✓
2. **Lancer Docker** - Railway, Render, Fly.io, etc. ✓
3. **Persister des volumes** - Docker volumes ✓
4. **Exposer un port** - Standard ✓

Si ta plateforme supporte Docker, ça marche ! 🚀

---

## 🛠️ Si tu dois éditer des variables

Tu peux créer/modifier `.env.production` dans le repo :

```bash
# Dans le repo local
nano .env.production

# Change ce que tu veux
DATABASE_URL="file:/app/data/prod.db"
JWT_SECRET="ton-secret-plus-long-et-plus-random"

git add .env.production
git commit -m "Update production config"
git push origin main
```

Le déploiement auto va relancer avec les nouvelles valeurs. 🔄

---

## ✅ C'est vraiment "zero-config"

- ❌ Pas besoin de créer de fichiers
- ❌ Pas besoin de commandes manuelles
- ❌ Pas besoin de configuration sur le serveur
- ✅ Juste une URL Git
- ✅ C'est tout ce qu'il faut

**Tu veux déployer en multi-cloud ?** Aucun problème, tu rentres l'URL Git partout.

---

**Voilà ! C'est du vrai "zero-config" comme Vercel, mais pour Docker ! 🎊**
