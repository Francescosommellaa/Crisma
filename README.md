# Crisma - Gestionale Abbigliamento

## Descrizione Generale

Crisma è un gestionale per capi di abbigliamento progettato per offrire una gestione semplice ed efficiente dei capi, dei brand, delle stagioni e degli anni. L'applicazione è scaricabile e utilizzabile in locale dagli utenti, con autenticazione centralizzata tramite un sito vetrina.

## Tecnologie Utilizzate

* Linguaggio: TypeScript (per tutto il progetto)
* Build Tool: Vite
* Backend Framework: Express.js
* Frontend Framework: React
* Autenticazione: OAuth tramite sito vetrina (email e password unici)
* Database: PostgreSQL (solo se necessario)
* Server: Locale o esterno, gestito dagli utenti tramite interfaccia intuitiva
* Gestore di pacchetti: npm
* Architettura: Monorepo

## Struttura della Monorepo

* **apps/**

  * **APP/**

    * **be-api:** Backend API in Express.js
    * **fe-app:** Frontend React
  * **fe-site:** Sito vetrina per autenticazione e download gestionale
* **shared/**: Moduli condivisi
* **README.md:** Documentazione generale

## Flusso di Autenticazione

1. **Registrazione Utente:**

   * L'utente visita il sito vetrina e crea un account gratuito (email e password unici)
   * Verifica dell'email tramite codice inviato
   * I dati vengono salvati nel DB Crisma dedicato

2. **Download e Installazione stile FIGMA:**

   * Dopo la registrazione, l'utente viene invitato a scaricare l'app
   * L'installazione avviene in locale

3. **Accesso all'App:**

   * L'utente apre l'app e clicca su "Accedi a Crisma"
   * Viene reindirizzato al sito vetrina per il login
   * Se l'utente è autenticato, riceve un token e viene riportato all'app
   * Il token viene salvato localmente per sessioni future
   * Se effettua il logout, il token viene eliminato e sarà necessario riaccedere

## Ottimizzazioni

* **Sessioni Persistenti:** Utilizzo di JWT con refresh token per mantenere la sessione aperta
* **Token di Accesso:** Memorizzazione sicura su file di configurazione locale
* **Verifica Automatica:** Controllo dello stato del token ad ogni avvio dell'app
* **Logout Unificato:** Logout dal sito vetrina invalida la sessione anche nell'app locale
* **Interfaccia Utente Intuitiva:** Accesso semplificato tramite pulsante centrale

## Feedback e Prossimi Passi

* Verifica dell’implementazione del flusso descritto
* Ottimizzazione della gestione dei token
* Test del processo di autenticazione centralizzata
