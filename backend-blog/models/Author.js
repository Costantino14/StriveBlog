import { Schema, model } from "mongoose";

// Definizione dello schema dell'utente utilizzando il costruttore Schema di Mongoose
const authorSchema = new Schema(
  {
    // Campo 'nome' di tipo String obbligatorio (required)
    nome: {
      type: String,
      required: true,
    },
    // Campo 'cognome' di tipo String obbligatorio (required)
    cognome: {
      type: String,
      required: true,
    },
    // Campo 'email' di tipo String obbligatorio e unico (unique)
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Campo 'data di nascita' di tipo String
    dataNascita: {
      type: String,
    },
     // Campo 'avatar' di tipo String 
     avatar: {
      type: String,
    },
  },
  {
    // Opzioni dello schema:
    collection: "authors", // Specifica il nome della collezione nel database MongoDB
  }
);

// Esporta il modello 'author' utilizzando il metodo model di Mongoose
// Il modello 'author' sarà basato sullo schema 'authorSchema' definito sopra
const Author = model("Author", authorSchema);
export default Author;