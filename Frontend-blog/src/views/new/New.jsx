import React, { useState } from "react";
import { Button, Container, Form, InputGroup, Row , Col} from "react-bootstrap";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { createAuthor, createPost } from "../../services/api";

const NewBlogPost = (setAuthors, authors) => {

   /* PARTE POST AUTORI */
  
  // Stato per gestire i dati del nuovo utente da creare
   const [newAuthor, setNewAuthor] = useState({ nome: "", cognome: "",email: "", dataNascita: "", avatar: ""});
  
   const AuthorSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(post)
      // Invia i dati del post al backend
      await createAuthor(newAuthor);
      // Naviga alla rotta della home dopo la creazione del post
      navigate("/");
    } catch (error) {
      console.error("Errore nella creazione del post:", error);
    }
  };

  /* PARTE POST BLOG*/

  const [coverFile, setCoverFile] = useState();

  const [post, setPost] = useState({
    category: "",
    title: "",
    readTime: { value: 0, unit: "minutes" },
    authorEmail: "",
    content: "",
  });

  // Hook per la navigazione
  const navigate = useNavigate();

  // Gestore per i cambiamenti nei campi del form
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTimeValue") {
      // Gestiamo il "readTime" del post
      setPost({
        ...post,
        readTime: { ...post.readTime, value: parseInt(value) },
      });
    } else {
      // Aggiornamento generale per gli altri campi
      setPost({ ...post, [name]: value });
    }
  };

  //Funzione per caricare il fileCover
  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  // Gestore per l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(post).forEach((key) => {
        if(key === 'readTime') {
          formData.append("readTime[value]", post.readTime.value);
          formData.append("readTime[unit]", post.readTime.unit);
        } else {
          formData.append(key, post[key]);
        }
      });
      
      if(coverFile) {
        formData.append('cover', coverFile)
      }
      // Invia i dati del post al backend
      await createPost(formData);
      // Naviga alla rotta della home dopo la creazione del post
      navigate("/");
    } catch (error) {
      console.error("Errore nella creazione del post:", error);
    }
  };

  
 

  return (
    <Container className="new-blog-container">
      <h2 className="mt-5">Autore</h2>

      {/*INIZIO FORM AUTORI*/}
      <Form onSubmit={AuthorSubmit}>
      <Row>
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            size="lg"
            required
            type="text"
            placeholder="First name"
            value={newAuthor.nome}
            onChange={(e) => setNewAuthor({ ...newAuthor, nome: e.target.value })}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Cognome</Form.Label>
          <Form.Control
            size="lg"
            required
            type="text"
            placeholder="Last name"
            value={newAuthor.cognome}
            onChange={(e) => setNewAuthor({ ...newAuthor, cognome: e.target.value })}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustomUsername">
          <Form.Label>Email</Form.Label>
          <InputGroup hasValidation>
            <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
            <Form.Control
              size="lg"
              type="text"
              placeholder="email"
              aria-describedby="inputGroupPrepend"
              required
              value={newAuthor.email}
              onChange={(e) => setNewAuthor({ ...newAuthor, email: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">
              Please choose a username.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Data di nascita</Form.Label>
          <Form.Control
            size="lg"
            required
            type="date"
            value={newAuthor.dataNascita}
            onChange={(e) => setNewAuthor({ ...newAuthor, dataNascita: e.target.value })}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Avatar</Form.Label>
          <Form.Control
            size="lg"
            required
            type="text"
            placeholder="URL immagine"
            value={newAuthor.avatar}
            onChange={(e) => setNewAuthor({ ...newAuthor, avatar: e.target.value })}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        
      </Row>
      <Form.Group className="d-flex mt-3 justify-content-end">
        <Button type="reset" size="lg" variant="outline-dark">
            Reset
        </Button>
        <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{
              marginLeft: "1em",
            }}
          >
            Invia
        </Button>
      </Form.Group>
      </Form>

      {/*INIZIO FORM PER CREARE UN POST*/}

      <Form className="mt-5" onSubmit={handleSubmit}>
        <h2>Articolo</h2>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control 
            size="lg" 
            placeholder="Title"
            name="title"
            value={post.title}
            onChange={handleChange} 
          />
        </Form.Group>
        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Control 
            size="lg" 
            as="select"
            name="category"
            value={post.category}
            onChange={handleChange}
          >
            <option>Seleziona una categoria...</option>
            <option>Attualità</option>
            <option>Storia</option>
            <option>Informatica</option>
            <option>Tempo Libero</option>
            <option>Altro</option>
          </Form.Control>
        </Form.Group>
        <Row className="mt-3">
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>Cover</Form.Label>
            <Form.Control
              size="lg"
              required
              type="file"
              placeholder="URL immagine"
              name="cover"
              //value={post.cover} non serve più
              onChange={handleFileChange}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label>Tempo di lettura</Form.Label>
            <Form.Control
              size="lg"
              required
              type="number"
              placeholder="Tempo"
              name="readTimeValue"
              value={post.readTime.value}
              onChange={handleChange}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustomUsername">
            <Form.Label>Email Autore</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                size="lg"
                type="text"
                placeholder="@email"
                aria-describedby="inputGroupPrepend"
                name="authorEmail"
                value={post.authorEmail}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please choose a username.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Testo articolo</Form.Label>
          <Form.Control
            as="textarea"
            name="content"
            value={post.content}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark">
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{
            marginLeft: "1em",
            }}
          >
            Invia
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewBlogPost;
