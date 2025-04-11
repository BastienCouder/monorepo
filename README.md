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
│   └── software/          # App React ou autre
│       ├── Dockerfile
│       └── docker-compose.yml
├── packages/              # Librairies partagées (utils, config, etc.)
├── monitoring/            # Stack Prometheus + Grafana
│   ├── prometheus.yml
│   ├── docker-compose.yml
│   ├── blackbox/
│   │   └── config.yml
│   └── grafana/
│       ├── dashboards/
│       │   ├── node-dashboard.json
│       │   └── blackbox-dashboard.json
│       └── provisioning/
│           ├── datasources/
│           │   └── datasource.yml
│           └── dashboards/
│               └── dashboards.yml
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

Cela lance :

Prometheus (http://localhost:9090)
Grafana (http://localhost:3800)
Node Exporter, Postgres Exporter, Blackbox Exporter

## 🌐 Reverse Proxy avec Traefik
Aucun Nginx ni Certbot utilisé

Configuration via fichiers YAML + labels dans docker-compose.yml

Routage automatique selon domaine (ex: web.mon-domaine.com)

## Dashboards disponibles
- Système (CPU, RAM, disques)
- PostgreSQL (connexions, I/O, etc.)
- Uptime / Ping avec Blackbox (localhost)
