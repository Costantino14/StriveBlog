import React, { useEffect, useState } from "react";
import { Button, Container, Form, ListGroup, Card, Row, Col, Badge, Accordion, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ModalComment from "../components/ModalComment"
import { getTravelPost, getTravelPostComments, addTravelPostComment, getUserData, deleteTravelPostComment } from "../services/api";
import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave, FaPlane } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Lightbulb, Trash2, UtensilsCrossed } from 'lucide-react';



const Blog = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: "", email: "", content: "" });
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [chComm, setChComm] = useState({content: ""})
  const [emailUtente, setEmailUtente] = useState("")



  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // Prova a ottenere i dati dell'utente, ma non bloccare se fallisce
        try {
          const userDataResponse = await getUserData();
          setEmailUtente(userDataResponse.email);
          setNewComment(prev => ({ ...prev, name: userDataResponse.nome, email: userDataResponse.email }));
        } catch (userError) {
          console.error("Utente non autenticato:", userError);
          // Non bloccare l'esecuzione se l'utente non è autenticato
        }
  
        // Recupera sempre i dati del post e i commenti
        const postResponse = await getTravelPost(id);
        setPost(postResponse.data);
        const commentsResponse = await getTravelPostComments(id);
        setComments(commentsResponse);
      } catch (error) {
        console.error("Errore nel recupero del post di viaggio o dei commenti:", error);
        // Potresti voler impostare uno stato di errore qui
        setPost(null); // o { error: true } per indicare che c'è stato un errore
      }
    };
  
    fetchPostAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTravelPostComment(id, newComment);
      const commentsResponse = await getTravelPostComments(id);
      setComments(commentsResponse);
      setNewComment(prev => ({ ...prev, content: "" }));
    } catch (error) {
      console.error("Errore nell'aggiunta del commento:", error);
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId) {
      console.error("Commento non trovato");
      return;
    }
    try {
      const response = await deleteTravelPostComment(id, commentId);
      if (response) {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
      } else {
        console.error("Errore nella cancellazione del commento, passaggio errato");
      }
    } catch (error) {
      console.error("Errore nella cancellazione del commento:", error.response?.data || error.message);
    }
  };

   // Aggiorna un commento nella lista dei commenti
   const updateCommentInList = (commentId, updatedContent) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment._id === commentId ? {...comment, content: updatedContent} : comment
      )
    );
    setChComm({ content: updatedContent });
  };

  if (!post) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Caricamento...</span>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="blog-post"
    >
      <div 
        className="hero-header d-flex align-items-center justify-content-center text-white text-center py-5"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${post.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '400px'
        }}
      >
        <div>
          <h1 className="display-3 font-weight-bold mb-4">{post.title}</h1>
          <Badge bg="primary" className="me-2">
            CATEGORIA:
            <FaPlane className="m-2" />{post.travelType}
          </Badge>
          <Badge bg="info">
            SPESA STIMATA:
            <FaMoneyBillWave className="m-2" />{post.estimatedCost.amount} {post.estimatedCost.currency}
          </Badge>
        </div>
      </div>

      <Container className="mt-5">
        <Row className="mb-5">
          <Col md={4}>
            <Card className="h-100 shadow">
              <Card.Body>
                <Card.Title className="mb-4">Dettagli del Viaggio</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <FaCalendarAlt className="me-2 text-primary" />
                    <strong>Inizio:</strong> {new Date(post.startDate).toLocaleDateString()}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <FaCalendarAlt className="me-2 text-primary" />
                    <strong>Fine:</strong> {new Date(post.endDate).toLocaleDateString()}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <FaUser className="me-2 text-primary" />
                    <strong>Autore:</strong> {post.author}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <Card className="h-100 shadow">
              <Card.Body>
                <Card.Title className="mb-4">Descrizione Vacanza</Card.Title>
                <ReactMarkdown>{post.description}</ReactMarkdown>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="mb-5 shadow">
          <Card.Body>
            <Card.Title className="mb-4">Itinerario</Card.Title>
            <ReactMarkdown>{post.itinerary}</ReactMarkdown>
          </Card.Body>
        </Card>

        <h2 className="mb-3">Città Visitate :</h2>
        <Accordion defaultActiveKey="0" className="mb-5">
          {post.cities.map((city, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header>
                <FaMapMarkerAlt size='25' className="me-2" />
                <h5>{city.name}</h5>
              </Accordion.Header>
              <Accordion.Body>
                <ReactMarkdown>{city.description}</ReactMarkdown>
                
                <h5 className="mt-4 mb-3"> <UtensilsCrossed size='32' color='blue'/>  Specialità da mangiare</h5>
                <ReactMarkdown>{city.foodSpecialties}</ReactMarkdown>
                
                <h5 className="mt-4 mb-3"><Lightbulb size='32' color='gold'/>  Consigli</h5>
                <ReactMarkdown>{city.tips}</ReactMarkdown>

                <Row className="mt-4">
                  {city.images.map((image, imgIndex) => (
                    <Col key={imgIndex} xs={6} md={4} lg={3} className="mb-3">
                      <img
                        src={image}
                        alt={`${city.name} - Immagine ${imgIndex + 1}`}
                        className="img-fluid rounded cursor-pointer"
                        onClick={() => openModal(image)}
                        style={{ objectFit: 'cover', height: '150px', width: '100%' }}
                      />
                    </Col>
                  ))}
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>

        <Card className="comments-section mb-5 shadow">
          <Card.Body>
            <Card.Title className="mb-4">
              <i className="bi bi-chat-dots me-2"></i>
              Commenti
            </Card.Title>


            <ListGroup variant="flush">
              {comments.map((comment) => (
                <ListGroup.Item key={comment._id} className="py-3">
                  <strong>{comment.name}</strong>
                 <p className="mb-1">{comment.content}</p>
                  <small className="text-muted">{new Date(comment.createdAt).toLocaleString()}</small>
                 {emailUtente === comment.email && (<div>
                      <ModalComment
                        id={id} 
                        commentId={comment._id} 
                        chComm={{ content: comment.content }}
                        setChComm={setChComm}
                        updateCommentInList={updateCommentInList}
                      />
                    <Button className="mt-2 ms-2" variant="outline-danger" onClick={() =>handleDeleteComment(comment._id)}><Trash2 size='20' /></Button></div>)}
                  </ListGroup.Item>
              ))}
            </ListGroup>
            <Form onSubmit={handleCommentSubmit} className="mt-4">
              <Form.Group className="mb-3">
                <Form.Label>Aggiungi un commento</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newComment.content}
                  onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                  required
                />
              </Form.Group>
              <Button type="submit" variant="primary">
                <i className="bi bi-send me-2"></i>
                Invia commento
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Body>
          <img src={selectedImage} alt="Selected" className="img-fluid" />
        </Modal.Body>
      </Modal>
    </motion.div>
  );
};

export default Blog;