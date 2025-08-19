Objectif

Construire une application web complète de gestion de projets avec :

Planification de projets

Gestion de missions (tâches)

Comptabilité (suivi du temps, coûts des missions)

Authentification et rôles (admin / user)

Interface utilisateur en React

Stack technique

Backend : Node.js, Express, Sequelize (PostgreSQL)

Frontend : React (React Router, Hooks, fetch/axios)

Auth : JWT (JSON Web Token), bcrypt

Étape 1 : Base de Données (PostgreSQL + Sequelize)

Créer les modèles Sequelize :

User (id, name, email, password hash, role, hourlyRate)

Project (id, name, description, startDate, dueDate)

Milestone (id, projectId, title, description, dueDate)

Task (id, projectId, milestoneId, title, description, status, assignedUserId, dueDate)

TimeLog (id, taskId, userId, hours, date)

Définir les relations :

Project → hasMany → Task

Project → hasMany → Milestone

Task → belongsTo → Project

Task → belongsTo → Milestone

Task → belongsTo → User (assignedUser)

User → hasMany → Task

User → hasMany → TimeLog

Task → hasMany → TimeLog

Commenter chaque modèle et relation en anglais.

Étape 2 : API REST (Express + Sequelize)

Créer un serveur Express (server.js).

Configurer Sequelize et synchroniser la base (sequelize.sync()).

Créer des routeurs séparés :

/projects (CRUD projets)

/tasks (CRUD tâches, statut, assignation)

/milestones (CRUD jalons)

/timelogs (ajout et lecture du temps passé)

Ajouter un endpoint /projects/:id/cost pour calculer heures + coûts.

Bien commenter le code et gérer les erreurs (404, 400, etc.).

Étape 3 : Authentification & Autorisation

Auth routes :

POST /auth/register (créer user, hash password avec bcrypt)

POST /auth/login (vérif email/pass, retour JWT signé)

Middlewares :

authMiddleware → vérifie JWT (Authorization: Bearer).

authorizeRole(role) → bloque l’accès si rôle != requis.

Règles d’accès :

Admin → CRUD projets/jalons/tâches.

User → peut voir projets/tâches, mettre à jour statut de ses propres tâches, enregistrer son temps.

Admin → peut voir tous les TimeLogs.

User → ne peut voir que ses TimeLogs.

Étape 4 : Frontend React

Créer un projet React (create-react-app).

Utiliser React Router pour pages :

/login → LoginPage (form email/pass → POST /auth/login).

/register → RegisterPage (optionnel).

/projects → ProjectListPage (liste projets).

/projects/:id → ProjectDetailPage (détails projet, tâches, time logs, coûts).

Composants principaux :

Navbar (logout, user info).

LoginPage (connexion).

ProjectListPage (affichage + bouton créer projet si admin).

ProjectDetailPage (affiche tâches + bouton terminer si assigné, ajout de temps, calcul du coût total).

Formulaires : NewProjectForm, NewTaskForm, etc.

Gestion d’authentification côté front :

Stocker JWT dans localStorage.

Créer un AuthContext pour partager état user/token.

Protéger les routes (RequireAuth).

Étape 5 : Améliorations possibles

Générer un rapport PDF des coûts/factures.

Ajout d’un dashboard admin.

Filtrage des projets par utilisateur.

Notifications (emails, Telegram, etc.).
