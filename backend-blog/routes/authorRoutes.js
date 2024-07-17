// routes/authorRoutes.js

import express from "express"; // Importa il pacchetto Express
import Author from "../models/Author.js"; // Importa il modello author
import BlogPost from "../models/BlogPost.js";
import cloudinaryUploader from "../Config/cloudinaryConfig.js";

const router = express.Router(); // Crea un router Express

// Rotta per ottenere tutti gli utenti
//router.get("/", async (req, res) => {
//  try {
//    const authors = await Author.find({}); // Trova tutti gli utenti nel database
//    res.json(authors); // Risponde con i dati degli utenti in formato JSON
//  } catch (err) {
//    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
//  }
//});

router.get("/", async (req, res) => {
  try {
     const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 10;
     const sort = req.query.sort || 'cognome';  
     const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
     const skip= (page -1)*limit;
     const authors =  await Author.find({}) // Trova tutti gli utenti nel database
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
router.post("/", async (req, res) => {
  try {
    // Crea una nuova istanza di Author con i dati dalla richiesta
    const author = new Author(req.body);

    const newAuthor = await author.save(); // Salva il nuovo utente nel database

    // Rimuovi la password dalla risposta per sicurezza
    const authorResponse = newAuthor.toObject();
    delete authorResponse.password;

    // Risponde con i dati del nuovo utente e uno status 201 (Created)
    res.status(201).json(authorResponse); 
  } catch (err) {
    
    res.status(400).json({ message: err.message }); // Gestisce errori di validazione e risponde con un messaggio di errore
  }
});



// Rotta per aggiornare un utente
router.put("/:id", async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Restituisce il documento aggiornato anziché quello vecchio
    });
    if(!updatedAuthor) {
      return res.status(404).json({ message: "Autore non trovato" }); // Se l'utente non esiste, risponde con un errore 404
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
      return res.status(404).json({ message: "Post non trovato" }); // Se l'utente non esiste, risponde con un errore 404
    } else {
    res.json({ message: "Autore Cancellato Dalla Lista" }); // Risponde con un messaggio di conferma
  }} 
  catch (err) {
    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
  }
});

router.get("/:id/blogPost", async (req, res) => {
  try {
    const authors = await Author.find({}); // Trova tutti gli utenti nel database
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