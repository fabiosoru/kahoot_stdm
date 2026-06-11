# Auto-Deployment via Git

## Pour déployer via ton système d'auto-déploiement Git

### 1. URL du Repository

```
https://github.com/fabiosoru/kahoot_stdm.git
```

### 2. Branch

```
main
```

### 3. Configuration du serveur

Le serveur de déploiement doit :

1. **Cloner le repo**
   ```bash
   git clone https://github.com/fabiosoru/kahoot_stdm.git /opt/kahoot-stdm
   cd /opt/kahoot-stdm
   ```

2. **Configurer l'environnement**
   ```bash
   cp .env.production.example .env.production
   # ⚠️ Important: éditer .env.production avec les vraies valeurs
   nano .env.production
   ```

3. **Démarrer avec Docker**
   ```bash
   docker-compose up -d
   ```

### 4. Variables d'environnement requises

Créer/éditer `.env.production` sur le serveur :

```env
# Database location
DATABASE_URL="file:/app/data/prod.db"

# ⚠️ CHANGE THIS - Generate with: openssl rand -base64 32
JWT_SECRET="your-secure-random-key-here"

# Node environment
NODE_ENV="production"
```

### 5. Post-Deploy Checks

Après le déploiement, vérifier :

```bash
# Container status
docker-compose ps

# Logs
docker-compose logs app | tail -50

# Health check
curl http://localhost:3000
```

---

## ✅ Ready to Deploy

La configuration est complète et prête à être déployée. 

Fournis simplement cette URL Git à ton système de déploiement :
```
https://github.com/fabiosoru/kahoot_stdm.git
```

Et c'est tout ! 🚀

---

## 📝 Notes Importantes

- **Database**: Persiste dans un volume Docker (`kahoot-data`)
- **Secrets**: Génère une nouvelle clé JWT_SECRET pour chaque déploiement
- **Port**: L'app tourne sur 3000 (configurable dans docker-compose.yml)
- **HTTPS**: Configure nginx en reverse proxy si nécessaire (voir DEPLOY.md)
- **Backups**: Sauvegarde régulièrement le volume `kahoot-data`

---

## 🎯 Workflow complet

1. Tu codes et testes localement
2. `git push origin main` 
3. Ton système auto-deploy voit le changement
4. Clones le repo → Configure → Lance `docker-compose up -d`
5. App redémarrée sur production ✨

---

## 🆘 Troubleshooting

**Port déjà utilisé:**
```bash
# Édite docker-compose.yml
ports:
  - "8080:3000"  # Utilise 8080 au lieu de 3000
```

**Prisma errors:**
```bash
# Le Dockerfile régénère automatiquement Prisma
# Si ça ne marche pas, force un rebuild:
docker-compose down
docker build --no-cache -t kahoot-stdm:prod .
docker-compose up -d
```

**Base de données vide:**
```bash
# Initialiser la base:
docker-compose exec app bash scripts/init-prod.sh
```

---

**C'est prêt ! Ton app va se déployer automatiquement à chaque push sur main. 🚀**
