# Sigaretta

Versione web del gioco Sigaretta: ognuno scrive una risposta a turno, piega il foglio, lo passa — alla fine si leggono le storie assurde che sono uscite.

## Domande (in ordine fisso)

1. Chi?
2. Con chi?
3. Cosa succede?
4. Dove succede?
5. Come lo fanno?
6. E alla fine?

## Regole

- Minimo 3 giocatori per stanza.
- Chi crea la stanza ottiene un codice a 5 caratteri da condividere.
- Quando l'host avvia la partita, ogni giocatore risponde a una domanda per round, senza vedere le risposte altrui (foglio "piegato").
- Ogni round il foglio passa al giocatore successivo: dopo 6 round ci sono tante storie complete quante i giocatori.
- Al termine, ogni giocatore riceve **una sola storia a caso, anonima**, da leggere ad alta voce.

## Online

- App: **https://sigaretta-client.vercel.app**

## Sviluppo locale

Serve Node.js >= 20.

### Backend (`server/`)

```bash
cd server
npm install
npm run dev      # http://localhost:4000
```

### Frontend (`client/`)

```bash
cd client
npm install
npm run dev       # http://localhost:5173
```

Il frontend in dev usa il proxy Vite verso `localhost:4000`, non serve configurare nulla.

## Build di produzione

```bash
# backend
cd server
npm run build
npm start

# frontend
cd client
npm run build
npm run preview
```

## Deploy

- **Backend**: Railway (Node, build `npm run build`, start `npm start`). Env var `CORS_ORIGIN` con l'URL del frontend.
- **Frontend**: Vercel (Vite auto-detect). Env var `VITE_SERVER_URL` con l'URL del backend.
