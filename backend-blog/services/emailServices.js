// Importa il modulo mailgun-js per l'invio di email
import mailgun from "mailgun-js";
import dotenv from 'dotenv';

dotenv.config();

// Configura l'istanza di Mailgun con le credenziali dall'ambiente
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

// Funzione per inviare email
export const sendEmail = async (to, subject, htmlContent) => {
  const data = {
    from: "Strive Blog <noreply@yourdomain.com>", // Mittente dell'email, si una noreply per non aver risposte
    to, // Destinatario
    subject, // Oggetto dell'email
    html: htmlContent, // Contenuto HTML dell'email
  };

  try {
    // Invia l'email usando Mailgun
    const response = await mg.messages().send(data);
    console.log("Email inviata con successo:", response); 
    return response; 
  } catch (err) {
    // Gestione degli errori
    console.error("Errore nell'invio dell'email:", err);
    throw err;
  }
};