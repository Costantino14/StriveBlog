import { Schema, model } from "mongoose";

// Definizione dello schema dell'utente utilizzando il costruttore Schema di Mongoose
const blogPostSchema = new Schema(
  {
    // Campo 'categoria' di tipo String obbligatorio (required)
    category: {
      type: String,
      required: true,
    },
    // Campo 'titolo' di tipo String obbligatorio (required)
    title: {
      type: String,
      required: true,
    }, 
    // Campo 'cover' di tipo String
    cover: {
      type: String,
    },   
    // Campo 'readTime' di tipo String 
    readTime: {
      value: {
        type: Number,
      },
      unit: {
        type: String,
      }
    },
     // Campo 'email autore' di tipo String obbligatorio e unico (unique)
    authorEmail: {
        type: String,
        required: true,
    },
    // Campo 'content' di tipo String
    content: {
        type: String,
    },   
  },
  {
    // Opzioni dello schema:
    collection: "blogPost", // Specifica il nome della collezione nel database MongoDB
  }
);

// Esporta il modello 'author' utilizzando il metodo model di Mongoose
// Il modello 'author' sarà basato sullo schema 'authorSchema' definito sopra
const BlogPost = model("BlogPost", blogPostSchema);
export default BlogPost;