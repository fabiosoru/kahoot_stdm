# 🚀 Fonctionnalités à venir / Améliorations

## Pages Admin à compléter

### 1. Dashboard Admin (`/admin/page.tsx`) ✅
- [x] Liste des quiz
- [x] Statistiques rapides (participants, scores)
- [x] Boutons d'action (éditer, voir participants)

### 2. Éditeur de Quiz (`/admin/quiz/[id]/page.tsx`)
- [ ] Créer/éditer les questions
- [ ] Ajouter des images aux questions
- [ ] Définir les points et timer par question
- [ ] Drag & drop pour réorganiser
- [ ] Aperçu en temps réel

### 3. Page Participants (`/admin/quiz/[id]/participants/page.tsx`)
- [ ] Liste de tous les participants
- [ ] Scores et temps d'accès
- [ ] Exporter les résultats (CSV/PDF)
- [ ] Statistiques du quiz

### 4. Créer un Quiz (`/admin/quiz/new/page.tsx`)
- [ ] Formulaire pour créer un nouveau quiz
- [ ] Générer un code d'accès unique
- [ ] Définir la description et le titre

---

## Améliorations du Participant

### Page Quiz
- [ ] Sauvegarde automatique des réponses
- [ ] Affichage de la bonne réponse après le timer
- [ ] Bouton "Passer la question"
- [ ] Indicateur de progression visual

### Page Résultats
- [ ] Détail par question (réponse donnée vs correcte)
- [ ] Analyse de performance
- [ ] Bouton "Partager le score"
- [ ] Temps moyen par question

---

## Fonctionnalités Avancées

### Real-time
- [ ] SSE pour le classement live (au lieu du polling)
- [ ] WebSocket pour les mises à jour instantanées
- [ ] Notifications de nouveau classement

### Images
- [ ] Upload d'images pour les questions
- [ ] Galerie d'images pour les questions à choix visuel
- [ ] Compression automatique des images

### Admin Avancé
- [ ] Édition en masse des questions
- [ ] Templates de quiz
- [ ] Importation depuis Excel/CSV
- [ ] Audit trail (historique des modifications)
- [ ] Planification des quiz (date/heure de publication)

### Participant
- [ ] Système de badges/récompenses
- [ ] Historique des tentatives
- [ ] Partage social du score
- [ ] Duels entre participants

### Sécurité
- [ ] 2FA pour l'admin
- [ ] Rate limiting sur les API
- [ ] Chiffrement des réponses
- [ ] Audit logging

### Analytics
- [ ] Dashboard de statistiques détaillées
- [ ] Graphiques de performance
- [ ] Export des résultats
- [ ] Analyse de difficulté des questions

---

## Stack Tech à considérer

- [ ] Redis pour le cache du leaderboard
- [ ] PostgreSQL si SQLite devient limité
- [ ] Stripe pour les paiements (si besoin)
- [ ] Sentry pour les erreurs
- [ ] Mixpanel pour l'analytics

---

## Checklist Avant Production

- [ ] Tester avec 100+ participants simultanés
- [ ] Optimiser les images
- [ ] Mettre en place HTTPS
- [ ] Configurer les backups de BD
- [ ] Mettre en place un monitoring
- [ ] Préparer un plan de rollback
- [ ] Documentation d'admin
- [ ] Formation des utilisateurs

---

## Bugs Connus

- Les warnings ESLint peuvent être ignorés (pas d'impact)
- Les images ne sont pas encore uploadables (à implémenter)

---

## Notes pour le développement

Les fichiers à créer ou compléter en priorité :
1. `/admin/quiz/new/page.tsx` - Créer un quiz
2. `/admin/quiz/[id]/page.tsx` - Éditer un quiz
3. `/admin/quiz/[id]/participants/page.tsx` - Voir les participants
4. APIs pour upload d'images
5. Améliorations UI/UX selon feedback

