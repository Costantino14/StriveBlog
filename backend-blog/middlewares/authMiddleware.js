//Import che mi servono
import { verifyJWT } from "../utils/jwt.js";
import Author from "../models/Author.js";

// Middleware di autenticazione
export const authMiddleware = async (req, res, next) => {
  try {
    // Estrai il token dall'header Authorization, prevengo l'errore con l'operatore ?. e rimuovo il prefisso 'Bearer ' dal token
    const token = req.headers.authorization?.replace("Bearer ", "");

    // Controllo se esiste il token
    if (!token) {
      return res.status(401).send("Token mancante")
    }
    
    const decoded = await verifyJWT(token);

    const author = await Author.findById(decoded.id).select("-password");

    // Se l'autore non viene trovato nel database, restituisce un errore 401
    if (!author) {
      return res.status(401).send("Autore non trovato");
    }

    // Aggiungo l'oggetto author alla richiesta
    req.author = author;

    // Passa al prossimo middleware o alla route handler
    next();
  } catch (error) {
    
    res.status(401).send("Token non valido");
  }
};