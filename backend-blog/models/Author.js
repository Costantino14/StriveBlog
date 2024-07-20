// Importiamo le dipendenze necessarie
import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt"; 


// Definizione dello schema dell'autore utilizzando il costruttore Schema di Mongoose
const authorSchema = new mongoose.Schema(
  {
    nome: {type: String, required: true },
    cognome: {type: String },
    email: {type: String, unique: true },
    avatar: {type: String },
    dataNascita: {type: String },
    password: { type: String },
    googleId: { type: String },
    githubId: { type: String },

  },
  {
    // Opzioni dello schema:
    timestamps: true,
    collection: "author", // nome della collezione nel database MongoDB
  }
);

//Metodo per confrontare le password
authorSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

//Middleware per l'hashing delle password prima del salvataggio
authorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    // Genera un salt e hash la password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Author", authorSchema);