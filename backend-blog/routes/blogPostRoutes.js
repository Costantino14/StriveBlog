// routes/authorRoutes.js

import express from "express"; // Importa il pacchetto Express
import BlogPost from "../models/BlogPost.js"; // Importa il modello author
import cors from 'cors'
import upload from "../middlewares/upload.js";

//import controlloMail from "../middlewares/controlloMail.js"  //Questa roba se vuoi fare un controllo della mail o di un altro dato

//Import di Cloudinary
import cloudinaryUploader from "../Config/cloudinaryConfig.js"
import { sendEmail } from "../services/emailServices.js";


const router = express.Router(); // Crea un router Express

//router.use(controlloMail);

//Rotta per ottenere tutti i Post dei blog
router.get("/", async (req, res) => {
  try {
    let query = {};
    if(req.query.title) {
//    query.title = req.query.title; //questa è la ricerca sensitive
      query.title = {$regex: req.query.title, options: 'i'} //ricerca insensitive
    }
    const blogPosts = await BlogPost.find(query); // Trova tutti gli utenti nel database
    res.json(blogPosts); // Risponde con i dati degli utenti in formato JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
  }
});

//router.get("/", async (req, res) => {
//  try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const sort = req.query.sort || 'cognome';  
//     const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
//     const skip= (page -1)*limit;
//     const authors =  await Author.find({}) // Trova tutti gli utenti nel database
//      .sort({[sort]: sortDirection})
//      .skip(skip)
//      .limit(limit)
//
//    const total= await Author.countDocuments();
//
//    res.json({
//      authors,
//      currentPage: page,
//      totalPages: Math.ceil(total / limit),
//      totalAuthors: total
//  });
//
//  } catch (err) {
//    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
//  }
//});



// Rotta per ottenere un singolo utente
router.get("/:id", async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id); // Trova un utente per ID
    if (!blogPost) {
      return res.status(404).json({ message: "Post non trovato" }); // Se l'utente non esiste, risponde con un errore 404
    } 
    res.json(blogPost); // Risponde con i dati dell'utente in formato JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
  }
});

// Rotta per creare un nuovo utente
//router.post("/", async (req, res) => {
//  const blogPost = new BlogPost(req.body); // Crea un nuovo utente con i dati dal corpo della richiesta
//  try {
//    const newBlogPost = await blogPost.save(); // Salva il nuovo utente nel database
//    res.status(201).json(newBlogPost); // Risponde con i dati del nuovo utente e uno status 201 (Created)
//  } catch (err) {
//    res.status(400).json({ message: err.message }); // Gestisce errori di validazione e risponde con un messaggio di errore
//  }
//});

//vecchio metodo, quello vallinoso
//router.post('/', upload.single('cover'), async (req,res) => {
  router.post('/', cloudinaryUploader.single('cover'), async (req,res) => {
  try {
    const postData = req.body;
    if(req.file) {
      //postData.cover = `http://localhost:5001/uploads/${req.file.filename}`  //Sempre del metodo vecchio
      postData.cover = req.file.path; // Cloudinary restituirà direttamente il suo url
    }
    const newPost = new BlogPost(postData)
    await newPost.save();

    // CODICE PER INVIO MAIL con MAILGUN
    const htmlContent = `
      <h1>Il tuo post è stato pubblicato!</h1>
      <p>Ciao ${newPost.authorEmail},</p>
      <p>Il tuo post "${newPost.title}" è stato pubblicato con successo.</p>
      <p>Categoria: ${newPost.category}</p>
      <p>Grazie per il tuo contributo al blog!</p>
    `;

    await sendEmail(
      newPost.authorEmail, // Ovviamente assumendo che newPost.author sia l'email dell'autore
      "Il tuo post è stato correttamente pubblicato",
      htmlContent
    );

    res.status(201).json(newPost)
  } catch (err) {

    console.error('errore nella creazione', err)
    res.status(400).json({ message: err.message }); // Gestisce errori di validazione e risponde con un messaggio di errore

  }
})

// Rotta per aggiornare un utente
router.put("/:id", async (req, res) => {
  try {
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Restituisce il documento aggiornato anziché quello vecchio
    });
    if(!updatedBlogPost) {
      return res.status(404).json({ message: "Post non trovato" }); // Se l'utente non esiste, risponde con un errore 404
    } else {
    res.json(updatedBlogPost); // Risponde con i dati dell'utente aggiornato in formato JSON
     } 
  } catch (err) {
    res.status(400).json({ message: err.message }); // Gestisce errori di validazione e risponde con un messaggio di errore
  }
});

// Rotta per eliminare un utente
router.delete("/:id", async (req, res) => {
  try {
    const deletePost = await BlogPost.findByIdAndDelete(req.params.id); // Elimina un utente per ID
    if(!deletePost) {
      return res.status(404).json({ message: "Post non trovato" }); // Se l'utente non esiste, risponde con un errore 404
    } else {
    res.json({ message: "Post Cancellato Dalla Lista" }); // Risponde con un messaggio di conferma
  }
  } catch (err) {
    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
  }
});

// PATCH /blogPosts/:blogPostId/cover: carica un'immagine di copertina per il post specificato
router.patch("/:id/cover", cloudinaryUploader.single("cover"), async (req, res) => {
  try {
    // Verifica se è stato caricato un file o meno
    if (!req.file) {
      return res.status(400).json({ message: "Non siamo riusciti a caricare il file" });
    }

    // Cerca il blog post nel db
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: "Post non trovato" });
    }

    // Aggiorna l'URL della copertina del post con l'URL fornito da Cloudinary
    blogPost.cover = req.file.path;

    // Salva le modifiche nel db
    await blogPost.save();

    // Invia la risposta con il blog post aggiornato
    res.json(blogPost);
  } catch (error) {
    console.error("Errore durante l'aggiornamento della cover del blog:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});


export default router; // Esporta il router per l'utilizzo in altri file