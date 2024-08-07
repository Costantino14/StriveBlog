import React, { useState, useEffect } from "react";
import { Button, Container, Form, InputGroup, Row , Col} from "react-bootstrap";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./style.css";
import { useNavigate } from "react-router-dom";
import { createPost, getMe } from "../services/api";

const NewBlogPost = (setAuthors, authors) => {
  // Stato per il file di copertina
  const [coverFile, setCoverFile] = useState();
  // Stato per gestire il caricamento
  const [isLoading, setIsLoading] = useState(false);

  // Stato per i dati del post
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

  // Funzione per caricare il fileCover
  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  // Gestore per l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Creiamo un FormData per inviare i dati, incluso il file
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
  
      // Impostiamo lo stato di caricamento
      setIsLoading(true);
  
      // Inviamo i dati del post al backend
      const response = await createPost(formData);
  
      // Attendiamo un po' prima di reindirizzare (per UX)
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      setIsLoading(false);
  
      // Verifichiamo la risposta prima di navigare
      if (response && response.data) {
        // Navighiamo alla home dopo la creazione del post
        navigate("/");
      } else {
        throw new Error("Risposta non valida dal server");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Errore nella creazione del post:", error);
      // Mostriamo un messaggio di errore all'utente
      alert("Si è verificato un errore durante la creazione del post. Riprova.");
    }
  };

  // UseEffect per l'autenticazione e recupero email utente
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const userData = await getMe();
        setPost((prevPost) => ({ ...prevPost, authorEmail: userData.email }));
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error);
        navigate("/login");
      }
    };
    fetchUserEmail();
  }, [navigate]);

  return (
    <body className="root">
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={handleSubmit}>
        <h2>Articolo</h2>
        {/* Campo per il titolo del post */}
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
        {/* Selezione della categoria del post */}
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
          {/* Campo per caricare l'immagine di copertina */}
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>Cover</Form.Label>
            <Form.Control
              size="lg"
              required
              type="file"
              placeholder="URL immagine"
              name="cover"
              onChange={handleFileChange}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          {/* Campo per il tempo di lettura */}
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
          {/* Campo per l'email dell'autore (readonly) */}
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
                readOnly
              />
              <Form.Control.Feedback type="invalid">
                Please choose a username.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        {/* Campo per il contenuto del post */}
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
        {/* Pulsanti di reset e invio */}
        <Form.Group className="d-flex my-5 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark">
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
            className="new-blog-button"
            disabled={isLoading}
            >
            {isLoading ? 'Caricamento...' : 'Invia'}
          </Button>
        </Form.Group>
      </Form>
    </Container>
    </body>
  );
};

export default NewBlogPost;