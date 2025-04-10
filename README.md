# 🧩 Monorepo Node.js — Déploiement Ansible + Docker + Nginx + Certbot

Ce projet est un **monorepo** regroupant plusieurs applications (ex. `web`, `software`, etc.) et des packages partagés.  
Il propose un système de déploiement **automatisé via Ansible** pour :

- Builder et lancer chaque app dans un conteneur Docker
- Configurer **Nginx** comme reverse proxy
- Obtenir des **certificats SSL Let's Encrypt** avec **Certbot**
- Simuler tout ça en CI/local avec [act](https://github.com/nektos/act)

---

## 🗂️ Structure du projet

```bash
monorepo/ 
├── apps/ 
│ ├── web/ # App Next.js/Node
│ └── software/ # App React
├── packages/ # Librairies partagées (utils, config, etc.) 
├── ansible/ # Déploiement infra 
│ ├── playbook.yml 
│ ├── vars/
│ │ ├── defaults.yml 
│ ├── roles/
│ │ ├── app-deploy/ 
│ │ ├── nginx/
│ │ ├── certbot/ 
│ │ └── docker/ 
│ └── inventory.ini 
└──── vault_pass.txt 
```

## 🚀 Déploiement

en production

```bash
cd ansible
ansible-playbook -i inventory.ini playbook-deploy.yml
```
En local (CI/CD ou dev) avec act

```bash
cd ansible
act
```

En local via act, Certbot est automatiquement mocké (echo)
En prod, le vrai certbot est exécuté (mode --nginx ou --webroot)

### 🔒 HTTPS avec Certbot
En prod : certbot --nginx (Let’s Encrypt)

En local : mock via echo

Dossier ACME utilisé : /var/www/certbot

Certificats déposés dans /etc/letsencrypt/live/<domain>

### 🧰 Stack technique
Ansible — Orchestration, configuration

Docker — Conteneurisation app par app

Nginx — Reverse proxy HTTP/HTTPS

Certbot — Certificats SSL gratuits

act — Exécution locale de GitHub Actions pour tests CI

