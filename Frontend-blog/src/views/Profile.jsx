import React, { useEffect, useState } from 'react'
import "./style.css";
import { deleteAuthor, deleteTravelPost, getTravelPosts, getUserData, updateProfile } from '../services/api';
import { Button, Card, Col, Container, Row, Form, Modal } from 'react-bootstrap';
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import EditTravelPostModal from '../components/EditTravelPostModal';

export default function Profile() {
  const [travelPosts, setTravelPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nome: '',
    cognome: '',
    dataNascita: '',
    avatar: null
  });
  const navigate = useNavigate();

  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handleEditPost = (postId) => {
    setSelectedPostId(postId);
    setShowEditPostModal(true);
  };

  const handlePostUpdated = async () => {
    // Aggiorna la lista dei post dopo la modifica
    const postsData = await getTravelPosts();
    setTravelPosts(postsData.travelPosts);
  };

  useEffect(() => {
    const fetchUserDataAndPosts = async () => {
      try {
        const userDataResponse = await getUserData();
        setUserData(userDataResponse);
        setEditFormData({
          nome: userDataResponse.nome,
          cognome: userDataResponse.cognome,
          dataNascita: userDataResponse.dataNascita,
        });

        const postsData = await getTravelPosts();
        setTravelPosts(postsData.travelPosts);
      } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
        navigate("/login");
      }
    };

    fetchUserDataAndPosts();
  }, [navigate]);

  const handleDeleteAuthor = async (id) => {
    if (!userData) {
      console.error("Autore non trovato");
      return;
    }
    try {
      const response = await deleteAuthor(id);
      if (response) {
        localStorage.removeItem("token");
        localStorage.removeItem("data");
        alert("Hai cancellato il tuo profilo!")
        navigate("/");
      } else {
        console.error("Errore nella cancellazione dell'autore");
      }
    } catch (error) {
      console.error("Errore nella cancellazione dell'autore:", error);
    }
  };

  const handleDeletePost = async (id) => {
    if (!id) {
      console.error("Post non trovato");
      return;
    }
    try {
      const response = await deleteTravelPost(id);
      if (response) {
        setTravelPosts(prev => prev.filter(post => post._id !== id));
        alert("Post di viaggio cancellato con successo!")
      } else {
        console.error("Errore nella cancellazione del post di viaggio");
      }
    } catch (error) {
      console.error("Errore nella cancellazione del post di viaggio:", error);
    }
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleEditFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      setEditFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setEditFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Nuovi dati:', editFormData)
      const updatedUserData = await updateProfile(userData._id, editFormData);
      setUserData(updatedUserData);
      setShowEditModal(false);
      alert("Profilo aggiornato con successo!");
    } catch (error) {
      console.error("Errore nell'aggiornamento del profilo:", error);
      alert("Errore nell'aggiornamento del profilo. Riprova.");
    }
  };

  if (!userData) {
    return <div>Caricamento...</div>;
  }

  return (
    <div className='root'>
      <Container>
        <div className='profile-center'>
          <h1 className='title-profile'>Profilo</h1>
          
          <Card className="profile-card">
            <div className="profile-image-container">
              <Card.Img variant="top" src={userData.avatar} className="profile-image" />
            </div>
            <Card.Body>
              <Card.Title>{userData.nome} {userData.cognome}</Card.Title>
              <Card.Text>
                Data di Nascita: {userData.dataNascita} <br />
                E-mail: {userData.email}
              </Card.Text>
              <Button className="ms-1 buttons-profile" variant="outline-primary" onClick={handleEditProfile}><HiOutlinePencil /></Button>
              <Button className="ms-1 buttons-profile" variant="outline-danger" onClick={() => handleDeleteAuthor(userData._id)}><HiOutlineTrash /></Button>
            </Card.Body>
          </Card>
        </div>

        {travelPosts.filter(post => post.author === userData.email)
          .map((post) => (
            <Card key={post._id} className="post-profile-card horizontal-card m-2">
              <Row>
                <Col md={4}>
                  <div className="post-profile-image-container">
                    <Card.Img src={post.coverImage} className="post-profile-cover" />
                  </div>
                </Col>
                <Col md={8}>
                  <Card.Body className='post-profile-body'>
                    <Card.Title className='post-profile-title'>{post.title}</Card.Title>
                    <Card.Text className='post-profile-text'>Itinerario: {post.itinerary}</Card.Text>
                    <Card.Text className='post-profile-text'>
                      Date: {new Date(post.startDate).toLocaleDateString()} - {new Date(post.endDate).toLocaleDateString()}
                    </Card.Text>
                    <Card.Text className='post-profile-text'>{post.content}.</Card.Text>
                    <Button 
              className="ms-1 buttons-profile" 
              variant="outline-primary" 
              onClick={() => handleEditPost(post._id)}
            >
              <HiOutlinePencil />
            </Button>
                    <Button className="ms-1 buttons-profile" variant="outline-danger" onClick={() => handleDeletePost(post._id)}><HiOutlineTrash /></Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          ))}

<EditTravelPostModal 
        show={showEditPostModal}
        handleClose={() => setShowEditPostModal(false)}
        postId={selectedPostId}
        onPostUpdated={handlePostUpdated}
      />

        <Modal show={showEditModal} onHide={handleCloseEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Modifica Profilo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditFormSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={editFormData.nome}
                  onChange={handleEditFormChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Cognome</Form.Label>
                <Form.Control
                  type="text"
                  name="cognome"
                  value={editFormData.cognome}
                  onChange={handleEditFormChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Data di Nascita</Form.Label>
                <Form.Control
                  type="date"
                  name="dataNascita"
                  value={editFormData.dataNascita}
                  onChange={handleEditFormChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Avatar</Form.Label>
                <Form.Control
                  type="file"
                  name="avatar"
                  onChange={handleEditFormChange}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Salva Modifiche
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  )
}