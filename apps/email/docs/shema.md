              ┌────────────┐
              │  Web App   │
              │  (Next.js) │
              └─────┬──────┘
                    │
                    ▼
        ┌────────────────────────┐
        │ publishUserRegistered()│
        └─────┬──────────────────┘
              │
              ▼
     ┌─────────────────────┐
     │     RabbitMQ        │  <─ Serveur de queue
     │ [user.registered]   │
     └─────┬───────────────┘
           │
           ▼
   ┌────────────────────┐
   │      Worker        │  <─ App indépendante
   │  (email-worker)    │
   └─────┬──────────────┘
         │
         ▼
  ┌────────────────────┐
  │   sendMail(email)  │  <─ Envoie réel (SMTP)
  └────────────────────┘
