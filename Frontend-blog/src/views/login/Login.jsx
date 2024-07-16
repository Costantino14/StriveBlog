import { useState, useEffect } from "react"; // Importa il hook useState da React per gestire lo stato
import { useNavigate, useLocation } from "react-router-dom"; // Importa useNavigate da react-router-dom per navigare programmaticamente
import { loginUser } from "../../services/api"; // Importa la funzione API per effettuare il login


export default function Login() {
  const [formData, setFormData] = useState({
    email: "", // Stato iniziale del campo email
    password: "", // Stato iniziale del campo password
  });

    // Inizializziamo gli hooks di react-router-dom
const navigate = useNavigate(); // Per navigare programmaticamente
const location = useLocation(); // Per accedere ai parametri dell'URL corrente

useEffect(() => {
  // Questo effect viene eseguito dopo il rendering del componente
  // e ogni volta che location o navigate cambiano

  // Estraiamo i parametri dall'URL
  const params = new URLSearchParams(location.search);
  // Cerchiamo un parametro 'token' nell'URL
  const token = params.get("token");

  if (token) {
    // Se troviamo un token, lo salviamo nel localStorage
    localStorage.setItem("token", token);
    // Dispatchamo un evento 'storage' per aggiornare altri componenti che potrebbero dipendere dal token
    window.dispatchEvent(new Event("storage"));
    // Navighiamo alla home page
    navigate("/");
  }
}, [location, navigate]);


  // Gestore del cambiamento degli input del form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Aggiorna lo stato del form con i valori degli input
  };

  // Gestore dell'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form di ricaricare la pagina
    try {
      const response = await loginUser(formData); // Chiama la funzione loginUser per autenticare l'utente
      
      //Prova mia
      localStorage.setItem("data", formData.email)

      localStorage.setItem("token", response.token); // Memorizza il token di autenticazione nel localStorage
      // Trigger l'evento storage per aggiornare la Navbar
      window.dispatchEvent(new Event("storage")); // Scatena un evento di storage per aggiornare componenti come la Navbar
      alert("Login effettuato con successo!"); // Mostra un messaggio di successo
      navigate("/"); // Naviga alla pagina principale
    } catch (error) {
      console.error("Errore durante il login:", error); // Logga l'errore in console
      alert("Credenziali non valide. Riprova."); // Mostra un messaggio di errore
    }
  };


const handleGoogleLogin = () => {
  // Reindirizziamo l'utente all'endpoint del backend che inizia il processo di autenticazione Google
  window.location.href = "http://localhost:5001/api/auth/google";
};

  return (
    <div className="container"  style={{marginTop: 150}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Accedi</button>
      </form>
      
      <button onClick={handleGoogleLogin}>Accedi con Google</button>

    </div>
  );
}