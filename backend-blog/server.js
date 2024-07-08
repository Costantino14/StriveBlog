// Importa i pacchetti necessari
import express from 'express';
import listEndpoints from 'express-list-endpoints';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authorRoutes from './routes/authorRoutes.js'; // Importa le rotte
import blogPostRoutes from './routes/blogPostRoutes.js';
import cors from 'cors';

import path from 'path';
import { fileURLToPath } from "url"; // UPLOAD Per convertire URL in percorsi di file


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { authorizedHandler, badRequestHandler, genericErrorHandler, notFoundHandler } from './middlewares/errorHandlers.js'



// Carica le variabili d'ambiente
dotenv.config();

// Inizializza l'app Express
const app = express();

// Middleware per il parsing del corpo delle richieste JSON
app.use(express.json());

app.use(cors());

//app.use("/uploads", express.static(path.join(__dirname, "uploads"))) //si usa nel vecchio metodo

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connesso'))
  .catch((err) => console.error('MongoDB: errore di connessione.', err));

// Definizione della porta su cui il server ascolterà
const PORT = process.env.PORT || 5000;

// Endpoint di base per testare il server
app.get('/', (req, res) => {
  res.send('Ciao Mondo!');
});

// Usa le rotte per gli utenti
app.use('/api/author', authorRoutes);
app.use('/api/blogPost', blogPostRoutes);


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