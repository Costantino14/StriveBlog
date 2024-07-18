import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt"; // NEW!


// Definizione dello schema dell'utente utilizzando il costruttore Schema di Mongoose
const authorSchema = new mongoose.Schema(
  {
    // Campo 'nome' di tipo String obbligatorio (required)
    nome: {type: String, required: true },
    // Campo 'cognome' di tipo String obbligatorio (required)
    cognome: {type: String },
    // Campo 'email' di tipo String obbligatorio e unico (unique)
    email: {type: String, unique: true },
     // Campo 'avatar' di tipo String 
     avatar: {type: String },
      // Campo 'data di nascita' di tipo String
    dataNascita: {type: String },
    password: { type: String },
    googleId: { type: String },
    githubId: { type: String },

  },
  {
    // Opzioni dello schema:
    timestamps: true,
    collection: "author", // Specifica il nome della collezione nel database MongoDB
  }
);

//Metodo per confrontare le password
authorSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// NEW! Middleware per l'hashing delle password prima del salvataggio
authorSchema.pre("save", async function (next) {
  // Esegui l'hashing solo se la password è stata modificata (o è nuova)
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