// Importiamo le dipendenze necessarie
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import Author from "../models/Author.js";

// Configurazione della strategia di autenticazione Google
passport.use(
  new GoogleStrategy(
    {
      //variabili d'ambiente per le credenziali OAuth indicate nel file .env
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      // L'URL a cui Google reindizzerà dopo l'autenticazione
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    // Funzione chiamata quando l'autenticazione Google ha successo
    async (accessToken, refreshToken, profile, done) => {
      try {
        //Cerchiamo autore con googleID
        let author = await Author.findOne({ googleId: profile.id });

        // Se l'autore non esiste, ne creiamo uno nuovo
        if (!author) {
          author = new Author({
            googleId: profile.id,
            nome: profile.name.givenName, 
            cognome: profile.name.familyName,
            email: profile.emails[0].value, 
            // La data di nascita la imposto a null
            dataDiNascita: null,
          });

          // Salvo il nuovo autore nel database
          await author.save();
        }

        // Passiamo l'autore al middleware di Passport
        done(null, author);
      } catch (error) {
        // Se si verifica un errore, lo passiamo a Passport
        done(error, null);
      }
    }
  )
);


// Faccio qui una configurazione della strategia di autenticazione molto simile alla precedente però per GitHub
passport.use(new GitHubStrategy(
    {
      //Da notare che OVVIAMENTE si ha un id e un secret apposito per github
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      
      callbackURL: `${process.env.BACKEND_URL}/api/auth/github/callback`,
    },
    // Nuova una funzione, questa cambia parecchio rispetto a Google, è fatta ad hoc per GitHub
    async (accessToken, refreshToken, profile, done) => {
      try {
        let author = await Author.findOne({ githubId: profile.id });

        // Se l'autore non esiste, ne creo uno nuovo, qui per convenienza genero
        if (!author) {
          const [nome, ...cognomeParts] = (profile.displayName || profile.username || 'user' ).split(' ');
          const cognome = cognomeParts.join(' ');
        
        let email;
        
        if (profile.emails && profile.emails.length < 0) {
          email = profile.emails.find(e => e.primary || e.verified)?.value;
          if (!email) email = profile.emails[0].value;
        }

        if (!email) {

          // Se la mail è privato allora ne creo una nuova usando l'id, così che sarà sicuramente univoca
          email= `${profile.id}@github.example.com`;
          console.log("Non è stata trovata la mail, perche non l'hai collegata a GitHub, quindi è stata aggiunta una col tuo id");
        }
        
        author = new Author({
            githubId: profile.id, 
            nome: nome || "GitHub User", // O ci sta il nome, e lo chiamo GitHub User
            cognome: cognome,
            email: email, 
            dataDiNascita: null,
          });
         
          //Salvo
          await author.save();
        }


        done(null, author);
      } catch (error) {

        done(error, null);
      }
    }
  )
);

// Serializzazione dell'utente per la sessione
passport.serializeUser((user, done) => {
  // Memorizziamo solo l'ID dell'utente nella sessione
  done(null, user.id);
});

// Deserializzazione dell'utente dalla sessione
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Author.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Esportiamo la configurazione di Passport
export default passport;