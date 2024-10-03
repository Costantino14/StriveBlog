import { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import { registerUser } from "../services/api"; 
import { Container, Card, Button, Form, InputGroup, Row , Col} from "react-bootstrap";
import "./style.css";


const Register = () => {

  const [avatarFile, setAvatarFile] = useState();

 
  // Definisce lo stato del form con useState, inizializzato con campi vuoti
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    dataNascita: "",
    password: "",
    
  });

  //Funzione per caricare il fileCover
  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };


  const navigate = useNavigate(); // Inizializza useNavigate per poter navigare programmaticamente

  // Gestore per aggiornare lo stato quando i campi del form cambiano
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestore per la sottomissione del form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form di ricaricare la pagina
    try {
      const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    if (avatarFile) {
      formDataToSend.append('avatar', avatarFile);
    }
      console.log(formDataToSend)
      await registerUser(formDataToSend); // Chiama la funzione registerUser con i dati del form
      alert("Registrazione avvenuta con successo!"); // Mostra un messaggio di successo
      navigate("/login"); // Naviga alla pagina di login dopo la registrazione
    } catch (error) {
      console.error("Errore durante la registrazione:", error); // Logga l'errore in console
      alert("Errore durante la registrazione. Riprova."); // Mostra un messaggio di errore
    }
  }; 

  return (
    <body className="root">
    <Container id="contenitore-register">
      <Card className="card-register mt-5">
        <h2 className="card-header-register">Registrazione</h2>
        <Card.Body>
      <Form onSubmit={handleSubmit} id="form"> 
        <Row>
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label className="form-label-register">Nome</Form.Label>
            <Form.Control
              size="lg"
              required
              type="text"
              placeholder="First name"
              name="nome"
              onChange={handleChange}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label className="form-label-register">Cognome</Form.Label>
            <Form.Control
              size="lg"
              required
              type="text"
              placeholder="Last name"
              name="cognome"
              onChange={handleChange}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustomUsername">
            <Form.Label className="form-label-register">Email</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
              <Form.Control
                size="lg"
                type="text"
                placeholder="email"
                aria-describedby="inputGroupPrepend"
                required
                name="email"
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please choose a username.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label className="form-label-register mt-3">Data di nascita</Form.Label>
            <Form.Control
              size="lg"
              required
              type="date"
              name="dataNascita"
              onChange={handleChange}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label className="form-label-register mt-3">Avatar</Form.Label>
            <Form.Control
              size="lg"
              required
              type="file"
              placeholder="URL immagine"
              name="avatar"
              //value={post.cover} non serve più
              onChange={handleFileChange}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>

           <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label className="form-label-register mt-3">Password</Form.Label>
            <Form.Control
              size="lg"
              required
              type="password"
              placeholder="digita password"
              name="password"
              onChange={handleChange}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Form.Group className="d-flex mt-5 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark">
              Reset
          </Button>
          <Button
              type="submit"
              size="lg"
              variant="dark"
              className="button-register"
            >
              Invia
          </Button>
        </Form.Group>
        </Form>
        </Card.Body>
      </Card>
    </Container>
    </body>
      
  );
}

export default Register;



