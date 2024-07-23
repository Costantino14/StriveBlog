import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { HiOutlinePencilAlt} from "react-icons/hi";
import { updateComment } from '../services/api';
import { Form } from 'react-bootstrap';

function ModalComment({id, commentId, chComm, setChComm, updateCommentInList}) {
  // Stato per controllare la visibilità del modal
  const [show, setShow] = useState(false);
  // Stato locale per il contenuto del commento
  const [localComment, setLocalComment] = useState(chComm.content);

  // Aggiorna il commento locale quando cambia il commento originale
  useEffect(() => {
    setLocalComment(chComm.content);
  }, [chComm]);

  // Funzioni per gestire l'apertura e la chiusura del modal
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setLocalComment(chComm.content);
    setShow(true);
  };

  // Gestisce i cambiamenti nel contenuto del commento
  const handleContentChange = (e) => {
    setLocalComment(e.target.value);
  }

  // Gestisce l'invio del form per l'aggiornamento del commento
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // Chiama l'API per aggiornare il commento
      await updateComment(id, commentId, { content: localComment });
      // Aggiorna il commento nella lista dei commenti del componente genitore
      updateCommentInList(commentId, localComment);
      handleClose();
    } catch (error) {
      console.error("Errore nell'aggiornamento del commento:", error);
    }
  };

  return (
    <>
      {/* Pulsante per aprire il modal */}
      <Button variant="outline-success" onClick={handleShow}>
        <HiOutlinePencilAlt />
      </Button>

      {/* Modal per modificare il commento */}
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica commento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Testo commento</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                value={localComment}
                onChange={handleContentChange}
                placeholder="Il tuo commento"
                required
              />
            </Form.Group>
            <Button type="submit" variant="dark" className="mt-3">
              Salva modifiche
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalComment;