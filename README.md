![icon](/frontend/public/pwa-64x64.png)

# MJS FlowerPot
Denna idé kommer från en dröm att flytta ut på landet och ha ettliknande företag som en side busines, då jag älskar att odla och vill kunna dela med mig av den glädjen, och därav vill jag kunna använda mig av det jag orlar i café som hör till. Och vem gillar ite att kunna sitta och läsa eller köpa en bok i en hemtrevlig miljö?
Så denna e-handels och hemsida är en början på den drömmen.

## Instalation
1. Klona eller forka projektet
2. kör kommandot:
```bash
npm i 
```
```bash
npm install
```

3. starta programet genom (har instalerat *concurrently* så du kan köra dierkt från root mappen för att köra alla tre sidor samtidigt)
```bash
npm run dev
```

3. Skapa en .env fil i backend och lägg till detta:
```bash
MONGODB_URL=your_connection_to_mongodb

JWT_SECRET=your_jwt_secret_key

STRIPE_SECRET=your_stripe_secret_key

CLIENT_URL=your_frontend_url
```

4. Skapa en .env fil i din frontend (inte admin)
```bash
VITE_PUBLIC_STRIPE_KEY=your_stripe_publik_key
```

# Deployment

[Admin](https://mjsflowerpot-admin.netlify.app)

[E-handel](https://mjsflowerpot.netlify.app)


&copy; 2024 MJS FlowerPot
