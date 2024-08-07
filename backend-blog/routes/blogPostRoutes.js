// routes/blogPostRoutes.js

import express from "express"; 
import BlogPost from "../models/BlogPost.js"; 
import cors from 'cors'
import upload from "../middlewares/upload.js";
import { v2 as cloudinary} from "cloudinary";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // Middleware di autenticazione
import mongoose from 'mongoose';

//Import di Cloudinary
import cloudinaryUploader from "../Config/cloudinaryConfig.js"
import { sendEmail } from "../services/emailServices.js";


const router = express.Router(); // Crea un router Express


router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1; // 'desc' è il default
    const skip = (page - 1) * limit;

    const blogPosts = await BlogPost.find({})
      .sort({ [sort]: order })
      .skip(skip)
      .limit(limit);

    const total = await BlogPost.countDocuments();

    res.json({
      blogPosts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPost: total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Rotta per ottenere un singolo post
router.get("/:id", async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id); // Trova un post per ID
    if (!blogPost) {
      return res.status(404).json({ message: "Post non trovato" }); 
    } 
    res.json(blogPost); 
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
});

// Da qui si proteggono le altre rotte con il middleware di autenticazione
router.use(authMiddleware);


// Rotta per creare un nuovo post
router.post("/", cloudinaryUploader.single("cover"), async (req, res) => {
  try{
  try {
    const postData = req.body;
    if (req.file) {
      postData.cover = req.file.path; // Cloudinary restituirà direttamente il suo url
    }
    const newPost = new BlogPost(postData);
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
      'costantino.grabesu14@gmail.com', // Uso sempre questa email come destinatario perchè è l'unica abilitata, ho questo limite dovuto da mailgun
      "Il post è stato correttamente pubblicato",
      htmlContent
    );

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
} catch (error) {
  console.error("Errore dettagliato:", error);
  res.status(500).json({ message: error.message, stack: error.stack });
}
});



// Rotta per aggiornare un post
router.put("/:id", async (req, res) => {
  try {
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Restituisce il documento aggiornato anziché quello vecchio
    });
    if(!updatedBlogPost) {
      return res.status(404).json({ message: "Post non trovato" }); 
    } else {
    res.json(updatedBlogPost); 
     } 
  } catch (err) {
    res.status(400).json({ message: err.message }); // Gestisce errori di validazione e risponde con un messaggio di errore
  }
});


// Rotta per eliminare un post
router.delete("/:id", async (req, res) => {
  try {

    const blogPost = await BlogPost.findById(req.params.id); // Elimina un post per ID
    if(!blogPost) {
      return res.status(404).json({ message: "Post non trovato" }); 
    } 
    
    const publicId = `blog_covers/${blogPost.cover.split('/').pop().split('.')[0]}`;
    console.log("Extracted publicId", publicId);

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Cloudinary deletion result", result);

    } catch (cloudinaryError) {
      console.error('Cloudinary deletion error', cloudinaryError);
    }
// Elimina il blog post dal database
await BlogPost.findByIdAndDelete(req.params.id)

// Invia un messaggio di conferma come risposta JSO/V
res.json({ message:"Blog post e immagine di copertina eliminati"});
  } catch (err) {
// In caso di errore, invia una risposta di errore
  res.status(500).json({message: err.message}) ;
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

// Aggiungiamo le rotte per i commenti.

//1a:get dei commenti

router.get("/:id/comments", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    //Cerchiamo se il post esiste
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    res.json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Abilitiamo la get di un singolo commenti prendendo l'id del commento:

router.get("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    //Cerchiamo se il post esiste
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    const comment = post.comments.id(req.params.commentId);

    //Cerchiamo se il commento esiste
    if (!comment) {
      return res.status(404).json({ message: "Commento non trovato" });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Abilitiamo la post dei commenti:

router.post("/:id/comments", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    //Cerchiamo se il post esiste
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }

    // creiamo un oggetto "new comment" che verrà pushiato nell'array "comments" creato nel post schema
    const newComment = {
      name: req.body.name,
      email: req.body.email,
      content: req.body.content
    };
    post.comments.push(newComment);
    await post.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Abilitiamo le modifiche del singolo commento, quindi abbiamo bisogno dell'id del post e di quello del commento:

router.put("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    //Verifichiamo che il post esiste
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    const comment = post.comments.id(req.params.commentId);

    //Verifichiamo che il commento esiste
    if (!comment) {
      return res.status(404).json({ message: "Commento non trovato" });
    }

    //Ovviamente si modifica solo il commento in se, quindi si passa come body solo il nuovo commento e si inserisce in "comment.content"
    comment.content = req.body.content;
    await post.save();
    res.json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Abilitiamo il Delete:

router.delete("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    //Verifichiamo che il post esiste
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    const comment = post.comments.id(req.params.commentId);

    //Verifichiamo che il post esiste
    if (!comment) {
      return res.status(404).json({ message: "Commento non trovato" });
    }

    //usiamo semplicemente comment remove e salviamo tutto il post
    post.comments.pull(req.params.commentId);
    await post.save();
    res.json({ message: "Commento eliminato con successo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; // Esporta il router per l'utilizzo in altri file