# Strive Blog

Strive Blog è una piattaforma di blogging full-stack che permette agli utenti di autenticarsi, creare, leggere e cancellare post e commentare i vari post. Il progetto utilizza un'architettura MERN (MongoDB, Express, React, Node.js) e include funzionalità di autenticazione e autorizzazione.

## Caratteristiche Principali

- **Autenticazione**: Gli utenti possono registrarsi e accedere utilizzando email e password o attraverso Google e GitHub.
- **Creazione di Post**: Gli utenti autenticati possono creare nuovi post con titolo, contenuto e immagine di copertina.
- **Visualizzazione dei Post**: La homepage mostra una lista paginata di tutti i post, con la possibilità di cercare per titolo o autore.
- **Dettagli del Post**: Ogni post ha una pagina dedicata con tutti i dettagli e i commenti associati.
- **Gestione dei Commenti**: Gli utenti possono aggiungere, modificare e cancellare commenti sui post.
- **Profilo Utente**: Gli utenti hanno un profilo personale dove possono vedere e gestire i propri post.
- **Responsive Design**: L'interfaccia è ottimizzata per dispositivi desktop e mobili.

## Tecnologie Utilizzate

- **Frontend**: React, React Bootstrap per l'UI
- **Backend**: Node.js, Express
- **Database**: MongoDB con Mongoose ODM
- **Autenticazione**: JWT, Passport.js per OAuth
- **Upload Immagini**: Cloudinary
- **Altre librerie**: Axios per le chiamate API, react-router-dom per il routing

## Struttura del Progetto

- `/frontend`: Contiene l'applicazione React
  - `/src/components`: Componenti React riutilizzabili
  - `/src/views`: Pagine principali dell'applicazione
  - `/src/services`: Logica per le chiamate API
- `/backend`: Contiene il server Express
  - `/routes`: Definizioni delle route API
  - `/models`: Modelli Mongoose per il database
  - `/middlewares`: Middleware personalizzati (es. autenticazione)
  - `/config`: File di configurazione (es. Passport, Cloudinary)

## Flusso di Funzionamento

1. Gli utenti accedono alla homepage, dove possono vedere i post più recenti se autenticati.
2. Per autenticarsi sulla navbar ci stanno due bottoni (registrati e login).
3. Hai la possibilità di loggarti in 3 modalità: manualmente dopo la reggistrazione e tramite google o      github.
4. L'autenticazione avviene tramite JWT, con token memorizzati nel localStorage.
5. Nella navbar si visualizza dopo il login un bottone con la possibilità di: 
    -Creare un nuovo post.
    -Visitare la tua pagina profilo.
    -LogOut
6. I post vengono caricati dal backend in modo paginato, con la possibilità di filtrare e cercare.
7. La creazione dei post utilizza un form con upload di immagini su Cloudinary.
8. I commenti sono gestiti come un sottodocumento del modello Post in MongoDB e possono essere aggiunti, modificati e cancellati nella pagina del Post quando dalla homepage ci clicchi sopra.
9. Il profilo utente mostra le informazioni personali e i post dell'utente autenticato, con la possibilità di cancellare sia il singolo post che l'utente ha creato e cancellare l'autore stesso.

## Sicurezza

- Le password degli utenti sono crittografate con bcrypt.
- L'autenticazione JWT protegge le route sensibili.
- Le chiamate API sono protette da CORS.
- L'upload delle immagini è gestito in modo sicuro tramite Cloudinary.

## Deployment

- Il frontend è deployato su Vercel.
- Il backend è hostato su Render.
- Il database MongoDB è hostato su Atlas.

## Miglioramenti Futuri

- Implementazione di un sistema di categorie per i post.
- Aggiunta di funzionalità social come like e condivisioni.
- Miglioramento delle performance con caching e ottimizzazione delle query.
- Implementazione di un sistema di notifiche in tempo reale.
- Implementazione di un sistema di modifiche post e autore in tempo reale.
- Miglioramento della UserExperience.

