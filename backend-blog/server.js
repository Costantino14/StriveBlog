// Importa i pacchetti necessari
import express from 'express';
import listEndpoints from 'express-list-endpoints';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authorRoutes from './routes/authorRoutes.js'; // Importa le rotte
import blogPostRoutes from './routes/blogPostRoutes.js';
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js"; // Rotte per l'autenticazione
import session from "express-session"; // NEW! Importiamo session
import passport from "./Config/passportConfig.js"; // NEW! importiamo passport

//non più in uso

//import path from 'path';
//import { fileURLToPath } from "url"; // UPLOAD Per convertire URL in percorsi di file
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

import { authorizedHandler, badRequestHandler, genericErrorHandler, notFoundHandler } from './middlewares/errorHandlers.js'



// Carica le variabili d'ambiente
dotenv.config();

// Inizializza l'app Express
const app = express();


const corsOptions = {
  origin: function (origin, callback) {

    const whitelist = [
      'http://localhost:3000',
      'https://striveblog-uz2c.onrender.com',
      'https://strive-blog-tawny.vercel.app',
    ];

    if (process.env.NODE_ENV === 'development') {
      callback(null, true)
    } else if (whitelist.indexOf(origin) !== -1 || !origin || 
    origin.endsWith('.vercel.app')) {
      callback(null, true)
    } else {
      callback(new Error(`GENERIC CORS ERROR - CORS (server backend) - Origin: ${origin}`))
    }
  },
  credentials: true
}

app.use(cors(corsOptions));
// Middleware per il parsing del corpo delle richieste JSON
app.use(express.json());


//app.use("/uploads", express.static(path.join(__dirname, "uploads"))) //si usa nel vecchio metodo

app.use(
  session({
    // Il 'secret' è usato per firmare il cookie di sessione
    // È importante che sia una stringa lunga, unica e segreta
    secret: process.env.SESSION_SECRET,

    // 'resave: false' dice al gestore delle sessioni di non
    // salvare la sessione se non è stata modificata
    resave: false,

    // 'saveUninitialized: false' dice al gestore delle sessioni di non
    // creare una sessione finché non memorizziamo qualcosa
    // Aiuta a implementare le "login sessions" e riduce l'uso del server di memorizzazione
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connesso'))
  .catch((err) => console.error('MongoDB: errore di connessione.', err));



// Endpoint di base per testare il server
app.get('/', (req, res) => {
  res.send('Ciao Mondo!');
});

// Use per le rotte create:
app.use("/api/auth", authRoutes);
app.use('/api/author', authorRoutes);
app.use('/api/blogPost', blogPostRoutes);

// Definizione della porta su cui il server ascolterà
const PORT = process.env.PORT || 5000;


app.use(badRequestHandler);
app.use(authorizedHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);



// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);

  // Stampa tutte le rotte disponibili in formato tabellare
  console.log("Rotte disponibili:");
  console.table(listEndpoints(app).map((route) => ({
      path: route.path,
      methods: route.methods.join(", "),
    }))
  );
});