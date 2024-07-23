// routes/authorRoutes.js

import express from "express"; 
import Author from "../models/Author.js"; 
import BlogPost from "../models/BlogPost.js";
import { v2 as cloudinary} from "cloudinary";
import cloudinaryUploader from "../Config/cloudinaryConfig.js";
import { sendEmail } from "../services/emailServices.js";

const router = express.Router(); // Crea un router Express



router.get("/", async (req, res) => {
  try {
     const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 10;
     const sort = req.query.sort || 'cognome';  
     const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
     const skip= (page -1)*limit;
     const authors =  await Author.find({}) // Trova tutti gli utenti/autori nel database
      .sort({[sort]: sortDirection})
      .skip(skip)
      .limit(limit)

    const total= await Author.countDocuments();

    res.json({
      authors,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAuthors: total
  });

  } catch (err) {
    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
  }
});



// Rotta per ottenere un singolo utente
router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id); // Trova un utente per ID
    if (!author) {
      return res.status(404).json({ message: "Autore non trovato" }); // Se l'utente non esiste, risponde con un errore 404
    }
    res.json(author); // Risponde con i dati dell'utente in formato JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
  }
});

// Rotta per creare un nuovo utente
router.post('/', cloudinaryUploader.single('avatar'), async (req,res) => {
  try {
    const authorData = req.body;
    if(req.file) {
      authorData.avatar = req.file.path; // Cloudinary restituirà direttamente il suo url
    }
    const newAuthor = new Author(authorData)
    await newAuthor.save();

   // Rimuovi la password dalla risposta per sicurezza
   const authorResponse = newAuthor.toObject();
   delete authorResponse.password;
//
  //  CODICE PER INVIO MAIL con MAILGUN, anche qui ho messo che appena si registra qualcuno arriva a me la mail, l'unica autorizzata da mailgun
    const htmlContent = `
      <h1>Grazie per esserti registrato!</h1>
    `;

    await sendEmail(
      'costantino.grabesu14@gmail.com', 
      `${newAuthor.email}Ti sei registrato correttamente`,
      htmlContent
    );

    res.status(201).json(newAuthor)
  } catch (err) {

    console.error('errore nella creazione', err)
    res.status(400).json({ message: err.message }); // Gestisce errori di validazione e risponde con un messaggio di errore

  }
})

// Rotta per aggiornare un utente
router.put("/:id", async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Restituisce il documento aggiornato anziché quello vecchio
    });
    if(!updatedAuthor) {
      return res.status(404).json({ message: "Autore non trovato" }); 
    } else {
    res.json(updatedAuthor); // Risponde con i dati dell'utente aggiornato in formato JSON
    }
  } catch (err) {
    res.status(400).json({ message: err.message }); // Gestisce errori di validazione e risponde con un messaggio di errore
  }
});

// Rotta per eliminare un utente
router.delete("/:id", async (req, res) => {
  try {
    const deleteAuthor = await Author.findByIdAndDelete(req.params.id); // Elimina un utente per ID
    if(!deleteAuthor) {
      return res.status(404).json({ message: "Autore non trovato" }); // Se l'utente non esiste, risponde con un errore 404
    } else {
    res.json({ message: "Autore Cancellato Dalla Lista" }); // Risponde con un messaggio di conferma
  }} 
  catch (err) {
    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
  }
});

router.get("/:id/blogPost", async (req, res) => {
  try {
    const authors = await Author.find({}); // Trova tutti gli autori nel database
    res.json(authors); // Risponde con i dati degli utenti in formato JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
  }
});


// PATCH /authors/:authorId/avatar: carica un'immagine avatar per l'autore specificato
router.patch("/:id/avatar", cloudinaryUploader.single("avatar"), async (req, res) => {
  try {
    // Verifica se è stato caricato un file, se non l'ho caricato rispondo con un 400
    if (!req.file) {
      return res.status(400).json({ message: "Nessun file caricato" });
    }

    // Cerca l'autore nel database, se non esiste rispondo con una 404
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Autore non trovato" });
    }

    // Aggiorna l'URL dell'avatar dell'autore con l'URL fornito da Cloudinary
    author.avatar = req.file.path;

    // Salva le modifiche nel db
    await author.save();

    // Invia la risposta con l'autore aggiornato
    res.json(author);
  } catch (error) {
    console.error("Errore durante l'aggiornamento dell'avatar:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});


export default router; // Esporta il router per l'utilizzo in altri file