import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { HiOutlinePencilAlt} from "react-icons/hi";
import { updatePost } from '../services/api';
import { Form } from 'react-bootstrap';


function ModalPost({id}) {
  const [show, setShow] = useState(false);
  const data = localStorage.getItem("data");


  const [post, setPost] = useState({
    category: "",
    title: "",
    authorEmail: data,
    content: "",
  });

  // Gestore per i cambiamenti nei campi del form
  const handleChange = (e) => {
    const { name, value } = e.target;
      // Aggiornamento generale per gli altri campi
      setPost({ ...post, [name]: value });
  };


  // Gestore per l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const formData = new FormData(); 
      formData.append(post) 
      console.log(formData) 
      // Invia i dati per la modifica al backend
      await updatePost(id, formData);
      handleClose();

    } catch (error) {
      console.error("Errore nella modifica del post:", error);
    }
  };

  
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  

  return (
    <>
      <Button variant="outline-success" onClick={handleShow}>
        <HiOutlinePencilAlt />
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica commento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form className="mt-5" onSubmit={handleSubmit}>
        <h2>Modifica Articolo:</h2>
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
        <Form.Group className="d-flex my-5 justify-content-end">
        <Button type="submit" variant="dark" className="mt-3">
            Salva modifiche
        </Button>
        </Form.Group>
      </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalPost;

  


