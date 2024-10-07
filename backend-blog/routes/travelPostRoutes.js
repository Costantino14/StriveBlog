import express from "express";
import TravelPost from "../models/TravelPost.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import cloudinaryUploader from "../Config/cloudinaryConfig.js";
import { v2 as cloudinary } from "cloudinary";
import { sendEmail } from "../services/emailServices.js";

const router = express.Router();

// Rotte pubbliche
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;
    const skip = (page - 1) * limit;

    const travelPosts = await TravelPost.find()
      .sort({ [sort]: order })
      .skip(skip)
      .limit(limit)
      .populate('author', 'nome cognome');

    const total = await TravelPost.countDocuments();

    res.json({
      travelPosts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    console.error("Errore nel recupero dei post di viaggio:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const travelPost = await TravelPost.findById(req.params.id).populate('author', 'nome cognome');
    if (!travelPost) {
      return res.status(404).json({ message: "Post di viaggio non trovato" });
    }
    res.json(travelPost);
  } catch (error) {
    console.error("Errore nel recupero del post di viaggio:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const travelPost = await TravelPost.findById(req.params.id);
    if (!travelPost) {
      return res.status(404).json({ message: "Post di viaggio non trovato" });
    }
    res.json(travelPost.comments);
  } catch (error) {
    console.error("Errore nel recupero dei commenti:", error);
    res.status(500).json({ message: error.message });
  }
});

// Rotte protette
router.use(authMiddleware);

router.post("/", cloudinaryUploader.any(), async (req, res) => {
  try {
    console.log("Received files:", req.files);
    console.log("Received body:", req.body);

    const postData = JSON.parse(req.body.postData);
    
    // Gestisci l'immagine di copertina
    const coverImage = req.files.find(file => file.fieldname === 'coverImage');
    if (coverImage) {
      postData.coverImage = coverImage.path;
    }

    // Gestisci le immagini delle città
    postData.cities = postData.cities.map((city, index) => {
      const cityImages = req.files.filter(file => file.fieldname === `cityImages[${index}]`);
      return {
        ...city,
        images: cityImages.map(file => file.path)
      };
    });

    // Salva postData nel database
    const newTravelPost = new TravelPost(postData);
    await newTravelPost.save();

    //  CODICE PER INVIO MAIL con MAILGUN, anche qui ho messo che appena si registra qualcuno arriva a me la mail, l'unica autorizzata da mailgun
    const htmlContent = `
      <h1>Un utente a creato un post!</h1>
    `;

    await sendEmail(
      'costantino.grabesu14@gmail.com', 
      `L'utente ${newTravelPost.author} ha postato un viaggio!`,
      htmlContent
    );

    res.status(201).json({ message: "Post creato con successo", post: newTravelPost });
  } catch (error) {
    console.error("Errore nella creazione del post:", error);
    res.status(500).json({ message: "Errore nella creazione del post", error: error.message });
  }
});

router.put("/:id", cloudinaryUploader.any(), async (req, res) => {
  try {
    const postId = req.params.id;
    let postData = req.body;

    // Se postData è una stringa, proviamo a parsarla
    if (typeof postData === 'string') {
      try {
        postData = JSON.parse(postData);
      } catch (error) {
        console.error("Errore nel parsing di postData:", error);
        return res.status(400).json({ message: "Dati del post non validi" });
      }
    }

    console.log("Dati del post ricevuti:", postData);

    // Assicuriamoci che postData sia un oggetto
    if (typeof postData !== 'object' || postData === null) {
      return res.status(400).json({ message: "Dati del post non validi" });
    }

    // Ora possiamo procedere con l'aggiornamento
    const updatedTravelPost = await TravelPost.findByIdAndUpdate(postId, postData, { new: true });
    if (!updatedTravelPost) {
      return res.status(404).json({ message: "Post di viaggio non trovato" });
    }
    res.json(updatedTravelPost);
  } catch (error) {
    console.error("Errore nell'aggiornamento del post di viaggio:", error);
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const travelPost = await TravelPost.findById(req.params.id);
    if (!travelPost) {
      return res.status(404).json({ message: "Post di viaggio non trovato" });
    }

    // Elimina l'immagine di copertina
    if (travelPost.coverImage) {
      const coverImagePublicId = travelPost.coverImage.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(coverImagePublicId);
        console.log(`Immagine di copertina eliminata da Cloudinary: ${coverImagePublicId}`);
      } catch (cloudinaryError) {
        console.error(`Errore nell'eliminazione dell'immagine di copertina da Cloudinary: ${coverImagePublicId}`, cloudinaryError);
      }
    }

    // Elimina le immagini di tutte le città
    for (let city of travelPost.cities) {
      for (let imageUrl of city.images) {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Immagine della città eliminata da Cloudinary: ${publicId}`);
        } catch (cloudinaryError) {
          console.error(`Errore nell'eliminazione dell'immagine della città da Cloudinary: ${publicId}`, cloudinaryError);
        }
      }
    }

    // Elimina il documento dal database
    await TravelPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Post di viaggio e tutte le immagini associate eliminati con successo" });
  } catch (error) {
    console.error("Errore nell'eliminazione del post di viaggio:", error);
    res.status(500).json({ message: error.message });
  }
});

// Rotte per i commenti
router.post("/:id/comments", async (req, res) => {
  try {
    const travelPost = await TravelPost.findById(req.params.id);
    if (!travelPost) {
      return res.status(404).json({ message: "Post di viaggio non trovato" });
    }
    travelPost.comments.push(req.body);
    await travelPost.save();
    res.status(201).json(travelPost.comments[travelPost.comments.length - 1]);
  } catch (error) {
    console.error("Errore nell'aggiunta del commento:", error);
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id/comments/:commentId", async (req, res) => {
  try {
    const travelPost = await TravelPost.findById(req.params.id);
    if (!travelPost) {
      return res.status(404).json({ message: "Post di viaggio non trovato" });
    }
    const comment = travelPost.comments.id(req.params.commentId);

    // Verifichiamo che il commento esiste
    if (!comment) {
      return res.status(404).json({ message: "Commento non trovato" });
    }

    // Aggiorniamo il contenuto del commento
    comment.content = req.body.content;

    // Salviamo il documento del post di viaggio aggiornato
    await travelPost.save();

    res.json(comment);
  } catch (error) {
    console.error("Errore nell'aggiornamento del commento:", error);
    res.status(400).json({ message: error.message });
  }
});


router.delete("/:id/comments/:commentId", async (req, res) => {
  try {
    const travelPost = await TravelPost.findById(req.params.id);
    if (!travelPost) {
      return res.status(404).json({ message: "Post di viaggio non trovato" });
    }
    const comment = travelPost.comments.id(req.params.commentId);

    //Verifichiamo che il post esiste
    if (!comment) {
      return res.status(404).json({ message: "Commento non trovato" });
    }

    //usiamo semplicemente comment remove e salviamo tutto il post
    travelPost.comments.pull(req.params.commentId);
    await travelPost.save();
    res.json({ message: "Commento eliminato con successo" });
  } catch (error) {
    console.error("Errore nell'eliminazione del commento:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;