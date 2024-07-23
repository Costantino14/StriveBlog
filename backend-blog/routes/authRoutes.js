import express from "express";
import Author from "../models/Author.js";
import { generateJWT } from "../utils/jwt.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import passport from '../Config/passportConfig.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const router = express.Router();

// POST /login => restituisce token di accesso
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cerca l'autore nel database usando l'email
    const author = await Author.findOne({ email });
    if (!author) {
      // Se l'autore non viene trovato, restituisce un errore 401
      return res.status(401).json({ message: "Credenziali non valide, errore e-mail" });
    }

    // Verifica la password usando il metodo comparePassword definito nel modello Author
    const isMatch = await author.comparePassword(password);
    if (!isMatch) {
      // Se la password non corrisponde, restituisce un errore 401
      return res.status(401).json({ message: "Credenziali non valide, errore password" });
    }

    // Se le credenziali sono corrette, genera un token JWT
    const token = await generateJWT({ id: author._id });

    // Restituisce il token e un messaggio di successo
    res.json({ token, message: "Login effettuato con successo" });
  } catch (error) {
    // Gestisce eventuali errori del server
    console.error("Errore nel login:", error);
    res.status(500).json({ message: "Errore del server" });
  }
});

router.get("/me", authMiddleware, (req, res) => {
  const authorData = req.author.toObject();
  delete authorData.password;
  res.json(authorData);
});

// Rotta per iniziare il processo di autenticazione Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Rotta di callback per l'autenticazione Google
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login` }),
  
  async (req, res) => {
    try {
      
      const token = await generateJWT({ id: req.user._id });
      res.redirect(`${FRONTEND_URL}/login?token=${token}`);
    } catch (error) {
      console.error('Errore nella generazione del token:', error);
      res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);


// Rotta per iniziare il processo di autenticazione GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: `${FRONTEND_URL}/login` }),
  
  async (req, res) => {
    try {
      const token = await generateJWT({ id: req.user._id });
      res.redirect(`${FRONTEND_URL}/login?token=${token}`);
    } catch (error) {
      console.error('Errore nella generazione del token:', error);
      res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

export default router;