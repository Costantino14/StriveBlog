// Importiamo le dipendenze necessarie
import mongoose from "mongoose";
import { Schema, model } from "mongoose";

//AGGIUNGO LO SCHEMA PER I COMMENTI
const commentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
    _id: true // Mi assicuro che ogni commento abbia un proprio _id univoco
  },
);

// Definizione dello schema dell'utente utilizzando il costruttore Schema di Mongoose
const blogPostSchema = new mongoose.Schema(
  {
    category: { type: String, required: true,},
    title: { type: String, required: true, }, 
    cover: { type: String, },   
    readTime: {
      value: { type: Number, },
      unit: { type: String, }
    },
    authorEmail: { type: String, required: true, },
    content: { type: String, },  
    comments: [commentSchema] 
  },
  {
    // Opzioni dello schema:
    timestamps: true,
    collection: "blogPost", // Nome della collezione nel database MongoDB
  }
);

const BlogPost = model("BlogPost", blogPostSchema);
export default BlogPost;