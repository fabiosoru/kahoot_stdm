# 🎯 KAHOOT - Journée Santé & Sécurité

Plateforme de quiz interactive pour la Journée Santé & Sécurité 2026 - Champagne Mobilités & STDM

## 🚀 Démarrage rapide

### Installation
```bash
npm install
npx prisma migrate dev
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

### Accès

#### 👨‍💼 Admin
- URL: `http://localhost:3000/admin/login`
- Mot de passe par défaut: `admin123`
- Permet de créer et gérer les quiz

#### 🎮 Participant
- URL: `http://localhost:3000/quiz/SANTE2026` (ou votre code quiz)
- Entrez votre nom, prénom et entreprise
- Répondez aux questions du quiz
- Consultez votre score et le classement

#### 📊 Classement live
- URL: `http://localhost:3000/leaderboard/SANTE2026`
- Affichage grand écran du classement en temps réel

---

## 🎨 Design

- **Couleurs** : Bleu (#003F90) et Vert (#44C3AF)
- **Style** : Inspiré de Kahoot
- **Animations** : Fluides et engageantes
- **Responsive** : Fonctionne sur desktop et mobile

---

## 📋 Fonctionnalités

### Pour les participants
✅ Inscription simple (prénom, nom, entreprise)  
✅ Questions à choix multiples avec images  
✅ Timer par question  
✅ Calcul automatique du score  
✅ Classement en temps réel  
✅ Affichage du rang parmi les participants  

### Pour l'admin
✅ Créer/modifier des quiz  
✅ Ajouter des questions avec images  
✅ Définir les points et le timer par question  
✅ Voir les participants et leurs scores  
✅ Gérer l'état du quiz (actif/inactif)  

---

## 🗄️ Base de données

SQLite avec Prisma ORM

**Tables:**
- `quizzes` : Les quiz
- `questions` : Les questions
- `choices` : Les choix possibles
- `participants` : Les participants
- `answers` : Les réponses des participants
- `admin_users` : Les utilisateurs admin

---

## 🔐 Authentification

- **Admin** : Session simple (pas JWT)
- **Participants** : Token unique stocké en localStorage

---

## 📱 API Endpoints

### Admin
- `POST /api/admin/login` - Connexion
- `GET /api/admin/quiz` - Liste des quiz
- `POST /api/admin/quiz` - Créer un quiz
- `POST /api/admin/logout` - Déconnexion

### Quiz Public
- `GET /api/quiz/[code]` - Infos du quiz
- `POST /api/quiz/[code]/join` - Rejoindre
- `GET /api/quiz/[code]/questions` - Charger les questions
- `POST /api/quiz/[code]/answer` - Soumettre une réponse
- `POST /api/quiz/[code]/finish` - Terminer et calculer le score
- `GET /api/quiz/[code]/leaderboard` - Classement

---

## 🛠️ Configuration

Variables d'environnement dans `.env.local`:
```
DATABASE_URL="file:./prisma/dev.db"
ADMIN_PASSWORD="admin123"
JWT_SECRET="votre-clé-secrète"
```

---

## 🚢 Déploiement

Le projet est prêt pour déployer sur un serveur avec git auto-deploy :

```bash
git init
git add .
git commit -m "Initial Kahoot STDM setup"
git push origin main
```

---

## 📊 Exemple de Quiz

Un quiz de démonstration "Journée Santé & Sécurité 2026" est créé par défaut avec:
- **Code d'accès**: `SANTE2026`
- **Questions**: 3 questions sur la santé au travail
- **Points**: 100 par question

---

## 🎯 Points clés

- ✅ Participation asynchrone (pas de connexion simultanée requise)
- ✅ Score calculé automatiquement
- ✅ Classement mis à jour en temps réel
- ✅ Anti-doublon : une seule participation par personne
- ✅ Responsive design (mobile-friendly)
- ✅ Performance optimisée

---

## 📞 Support

Pour toute question, consultez les fichiers du projet ou modifiez le code selon vos besoins !

---

**Bonne journée santé & sécurité ! 🎯🚌**
