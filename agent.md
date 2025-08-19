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
