import { useState } from "react"; // Importa il hook useState da React per gestire lo stato del componente
import { useNavigate } from "react-router-dom"; // Importa useNavigate da react-router-dom per navigare tra le pagine
import { registerUser } from "../../services/api"; // Importa la funzione registerUser dal file api.js per effettuare la registrazione

const Register = () => {
 
  // Definisce lo stato del form con useState, inizializzato con campi vuoti
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    dataDiNascita: "",
    avatar: "pippo",
    password: "",
    
  });

  const navigate = useNavigate(); // Inizializza useNavigate per poter navigare programmaticamente

  // Gestore per aggiornare lo stato quando i campi del form cambiano
  const handleChange = (e) => {
    // Aggiorna il campo corrispondente nello stato con il valore attuale dell'input
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestore per la sottomissione del form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form di ricaricare la pagina
    try {
      await registerUser(formData); // Chiama la funzione registerUser con i dati del form
      alert("Registrazione avvenuta con successo!"); // Mostra un messaggio di successo
      navigate("/login"); // Naviga alla pagina di login dopo la registrazione
    } catch (error) {
      console.error("Errore durante la registrazione:", error); // Logga l'errore in console
      alert("Errore durante la registrazione. Riprova."); // Mostra un messaggio di errore
    }
  }; 

  return (
    <div className="container" style={{marginTop: 150}}>
      <h2>Registrazione</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cognome"
          placeholder="Cognome"
          onChange={handleChange}
          required
        />
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
        <input
          type="date"
          name="dataDiNascita"
          onChange={handleChange}
          required
        />
        <button type="submit">Registrati</button>
      </form>
    </div>
  );
}

export default Register;


//{/*INIZIO FORM AUTORI*/}
//<Form onSubmit={AuthorSubmit}>
//<Row>
//  <Form.Group as={Col} md="4" controlId="validationCustom01">
//    <Form.Label>Nome</Form.Label>
//    <Form.Control
//      size="lg"
//      required
//      type="text"
//      placeholder="First name"
//      value={newAuthor.nome}
//      onChange={(e) => setNewAuthor({ ...newAuthor, nome: e.target.value })}
//    />
//    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
//  </Form.Group>
//  <Form.Group as={Col} md="4" controlId="validationCustom02">
//    <Form.Label>Cognome</Form.Label>
//    <Form.Control
//      size="lg"
//      required
//      type="text"
//      placeholder="Last name"
//      value={newAuthor.cognome}
//      onChange={(e) => setNewAuthor({ ...newAuthor, cognome: e.target.value })}
//    />
//    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
//  </Form.Group>
//  <Form.Group as={Col} md="4" controlId="validationCustomUsername">
//    <Form.Label>Email</Form.Label>
//    <InputGroup hasValidation>
//      <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
//      <Form.Control
//        size="lg"
//        type="text"
//        placeholder="email"
//        aria-describedby="inputGroupPrepend"
//        required
//        value={newAuthor.email}
//        onChange={(e) => setNewAuthor({ ...newAuthor, email: e.target.value })}
//      />
//      <Form.Control.Feedback type="invalid">
//        Please choose a username.
//      </Form.Control.Feedback>
//    </InputGroup>
//  </Form.Group>
//
//  <Form.Group as={Col} md="4" controlId="validationCustom01">
//    <Form.Label>Data di nascita</Form.Label>
//    <Form.Control
//      size="lg"
//      required
//      type="date"
//      value={newAuthor.dataNascita}
//      onChange={(e) => setNewAuthor({ ...newAuthor, dataNascita: e.target.value })}
//    />
//    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
//  </Form.Group>
//
//  <Form.Group as={Col} md="4" controlId="validationCustom02">
//    <Form.Label>Avatar</Form.Label>
//    <Form.Control
//      size="lg"
//      required
//      type="text"
//      placeholder="URL immagine"
//      value={newAuthor.avatar}
//      onChange={(e) => setNewAuthor({ ...newAuthor, avatar: e.target.value })}
//    />
//    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
//  </Form.Group>
//  
//</Row>
//<Form.Group className="d-flex mt-3 justify-content-end">
//  <Button type="reset" size="lg" variant="outline-dark">
//      Reset
//  </Button>
//  <Button
//      type="submit"
//      size="lg"
//      variant="dark"
//      style={{
//        marginLeft: "1em",
//      }}
//    >
//      Invia
//  </Button>
//</Form.Group>
//</Form>
