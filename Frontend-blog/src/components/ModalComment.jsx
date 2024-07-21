import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { HiOutlinePencilAlt} from "react-icons/hi";
import { updateComment } from '../services/api';
import { Form } from 'react-bootstrap';


function ModalComment({id, commentId, chComm, setChComm, updateCommentInList}) {
  const [show, setShow] = useState(false);
  const [localComment, setLocalComment] = useState(chComm.content);

  useEffect(() => {
    setLocalComment(chComm.content);
  }, [chComm]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setLocalComment(chComm.content);
    setShow(true);
  };

  const handleContentChange = (e) => {
    setLocalComment(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await updateComment(id, commentId, { content: localComment });
      updateCommentInList(commentId, localComment);
      handleClose();
    } catch (error) {
      console.error("Errore nell'aggiornamento del commento:", error);
    }
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