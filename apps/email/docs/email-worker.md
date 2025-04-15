# 📩 Email Worker & RabbitMQ

## 📦 Objectif

Découpler l'envoi d'emails pour qu'il soit :

- asynchrone (non bloquant)
- robuste (pas lié au backend web)
- scalable (plusieurs workers possibles)

---

## 🧠 Concepts

### Worker

Un "worker" est une app qui **écoute une file RabbitMQ** et exécute une tâche quand un message arrive.

### RabbitMQ

RabbitMQ est un **serveur de messages** (queue), comme un tampon entre :

- celui qui **publie** (ex : ton app web)
- celui qui **traite** (ex : email-worker)

---

## ⚙️ Processus

1. L’utilisateur s’inscrit
2. Ton app web publie un message dans `user.registered`
3. Le **worker** récupère ce message
4. Il envoie l'email de bienvenue via Maildev/Nodemailer

---

## 💥 Que se passe-t-il si...

| Scénario                       | Comportement attendu                          |
|-------------------------------|-----------------------------------------------|
| 🧑‍💻 Worker down               | Email non envoyé (le message attend dans la queue) |
| 🐇 RabbitMQ down              | `publishUserRegistered()` échoue             |
| ✉️ Maildev down               | Le worker échoue à envoyer l’email           |

---

## ✅ Améliorations possibles

- Ajouter un système de **retry**
- Ajouter une **dead letter queue**
- Ajouter des **logs ou alertes** quand l’email échoue
- Persister les messages dans RabbitMQ (durable)

---

## 🚀 Tester

```bash
# 1. Lancer RabbitMQ seul
docker compose up -d rabbitmq maildev

# 2. Publier un message
pnpm tsx scripts/test-publish.ts

# 3. Lancer le worker
docker compose up -d worker
