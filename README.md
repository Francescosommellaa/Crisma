
# Gestionale Abbigliamento

Il Gestionale Abbigliamento è un'applicazione scaricabile e utilizzabile localmente, progettata per la gestione dei capi di abbigliamento. 
È adatto per fabbriche, aziende di moda e produttori che desiderano organizzare e catalogare i propri prodotti in modo efficiente.

## Funzionalità Principali

- **Gestione Brand e Stagioni:** Creazione e gestione di file legati a brand specifici, stagioni e anni.
- **Gestione Capi:** Inserimento, modifica e visualizzazione di capi d'abbigliamento con generazione automatica di codici unici.
- **Esportazione CSV:** Possibilità di esportare l'intero archivio dei capi in formato CSV.
- **Autenticazione Utente:** Accesso tramite email e password oppure OAuth (Google, Apple).
- **Database Configurabile:** Supporto per database locali e remoti, con configurazione tramite interfaccia utente.

## Architettura del Progetto

Il progetto è strutturato come una monorepo, con una netta separazione tra frontend e backend:

```
apps/
├── be-api                     # Backend (API) - Laravel
├── fe-app                     # Frontend dell'app gestionale - React, TypeScript, SCSS
├── fe-site                    # Sito vetrina per il download - React, TypeScript, SCSS
├── gestionale-capi-fe-app      # Modulo per la gestione dei capi - React, TypeScript, SCSS
└── shared                     # Componenti e librerie condivise
```

## Tecnologie Utilizzate

### Frontend
- React con TypeScript per interfaccia interattiva e reattiva.
- SCSS per la gestione degli stili.
- OAuth per l'autenticazione tramite Google e Apple.

### Backend
- Laravel per la gestione delle API e della logica applicativa.
- PostgreSQL per la gestione dei dati.
- Supporto per database locali e remoti.

### Deployment
- Frontend su Vercel.
- Backend su Railway.

## Installazione

1. Clona il repository:
   ```bash
   git clone https://github.com/username/gestionale-abbigliamento.git
   ```
2. Installa le dipendenze:
   ```bash
   cd apps/fe-app
   npm install
   cd ../be-api
   composer install
   ```
3. Configura il database tramite interfaccia.
4. Avvia l'applicazione:
   ```bash
   npm start  # Per il frontend
   php artisan serve  # Per il backend
   ```

## Contributi

Contributi, segnalazioni di bug e suggerimenti sono sempre benvenuti. Sentiti libero di aprire una issue o inviare una pull request.

## Licenza

Questo progetto è distribuito sotto la licenza MIT.
