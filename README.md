# Monorepo Node.js — Docker + Traefik + Monitoring

Ce projet est un **monorepo** regroupant plusieurs applications (ex. `web`, `software`, etc.) et des packages partagés.  
Chaque application possède son propre **Dockerfile** et un fichier **`docker-compose.yml`** pour être déployée et testée indépendamment.

La stack utilise **Traefik** comme reverse proxy dynamique, et un système complet de **monitoring avec Prometheus + Grafana**.

---

## 🗂️ Structure du projet

```bash
monorepo/
├── apps/
│   ├── web/               # App Next.js
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   ├── software/          # App React ou autre
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   ├── email/             # App worker RabbitMQ
│   │    ├── Dockerfile
│   │    └── docker-compose.yml
│   └── monitoring/        # Stack monitoring
│       ├── Dockerfile
│       └── docker-compose.yml
├── packages/              # Librairies partagées (utils, config, etc.)
│   └── email/             # Package Email
│       ├── index.ts
│       ├── sendMail.ts
│       ├── templates/
│       │   └── send-email.ts
│       └── docker-compose.yml
└── .env                   # Variables d’environnement globales
```

## 🚀 Démarrage
Pour une app spécifique
Depuis le dossier de l'app :

```bash
cd apps/web
docker compose up --build
```
Chaque app est indépendante et peut être testée ou déployée seule.

Pour la stack de monitoring

```bash
cd monitoring
docker compose up -d
```

## 🌐 Reverse Proxy avec Traefik
Aucun Nginx ni Certbot utilisé

Configuration via fichiers YAML + labels dans docker-compose.yml

Routage automatique selon domaine (ex: web.mon-domaine.com)