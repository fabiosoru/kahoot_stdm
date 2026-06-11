# 🎯 KAHOOT STDM - Démarrage Rapide

Votre plateforme de quiz est prête ! Voici comment la démarrer :

## 🚀 Démarrage

```bash
chmod +x INIT.sh
./INIT.sh
npm run dev
```

Puis ouvrez : **http://localhost:3000**

---

## 📋 Accès Rapide

### 🔐 Admin Panel
- **URL** : http://localhost:3000/admin/login
- **Password** : `admin123`
- Créer et gérer les quiz

### 🎮 Participant
- **URL** : http://localhost:3000/quiz/SANTE2026
- Entrez votre nom, prénom, entreprise
- Répondez aux questions

### 📊 Classement Live
- **URL** : http://localhost:3000/leaderboard/SANTE2026
- Affichage grand écran (pour projeter)

---

## ✨ Ce que vous avez

✅ **Plateforme complète** avec :
- Interface admin pour créer des quiz
- Questions avec timer et points
- Participation asynchrone (pas besoin d'être connecté ensemble)
- Classement en temps réel
- Design Kahoot magnifique

✅ **Couleurs de marque** :
- Bleu (#003F90)
- Vert (#44C3AF)

✅ **Quiz exemple** :
- Code d'accès : `SANTE2026`
- 3 questions sur la santé au travail
- 100 points chacune

---

## 🛠️ Pour créer votre propre quiz

**Actuellement** : Utilisez directement la base de données SQLite.
**Bientôt** : Interface admin pour créer des quiz (à implémenter).

Pour l'instant, modifiez le fichier `INIT.sh` ou utilisez :

```bash
sqlite3 prisma/dev.db
```

---

## 📦 Structure du Projet

```
kahoot_stdm/
├── app/
│   ├── admin/             # Pages admin
│   ├── api/               # API backend
│   ├── quiz/              # Pages participant
│   └── leaderboard/       # Affichage classement
├── lib/                   # Utilitaires (DB, scoring)
├── prisma/                # Schema & données
├── public/                # Assets (logos, images)
└── scripts/               # Scripts utilitaires
```

---

## 🚨 Si ça ne marche pas

1. Vérifiez que Node.js est installé
2. Faites : `rm -f prisma/dev.db && ./INIT.sh`
3. Assurez-vous que le port 3000 est libre

---

## 💡 Prochaines étapes

1. **Personnaliser le quiz** :
   - Modifier les questions dans `INIT.sh`
   - Ajouter vos propres questions

2. **Déployer sur votre serveur** :
   ```bash
   git push origin main
   ```
   (Votre serveur git-auto-deploy se chargera du reste)

3. **Améliorer** :
   - Ajouter upload d'images
   - Interface admin pour créer des quiz
   - Exporter les résultats en CSV

---

## 📞 Besoin d'aide ?

- Lisez `README.md` pour la documentation complète
- Consultez `FEATURES.md` pour les améliorations futures
- Explorez le code dans `app/` et `lib/`

---

## 🎉 Bonne chance avec votre Journée Santé & Sécurité !

**17 juin 2026** - Champagne Mobilités & STDM 🚌
