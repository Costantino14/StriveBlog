import React, { useEffect, useState } from 'react'
import "./style.css";
import { deleteAuthor, deletePost, getPosts, getUserData } from '../services/api';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { HiOutlineTrash } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDataAndPosts = async () => {
      try {
        const userDataResponse = await getUserData();
        setUserData(userDataResponse);

        const postsData = await getPosts();
        setPosts(postsData.blogPosts);
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
      const response = await deletePost(id);
      if (response) {
        setPosts(prev => prev.filter(post => post._id !== id));
        alert("Post cancellato con successo!")
      } else {
        console.error("Errore nella cancellazione del post");
      }
    } catch (error) {
      console.error("Errore nella cancellazione del post:", error);
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
              <Button className="ms-1 buttons-profile" variant="outline-danger" onClick={() => handleDeleteAuthor(userData._id)}><HiOutlineTrash /></Button>
            </Card.Body>
          </Card>
        </div>

        {posts.filter(post => post.authorEmail.toLowerCase() === userData.email.toLowerCase())
          .map((post) => (
            <Card key={post._id} className="post-profile-card horizontal-card">
              <Row noGutters>
                <Col md={4}>
                  <div className="post-profile-image-container">
                    <Card.Img src={post.cover} className="post-profile-cover" />
                  </div>
                </Col>
                <Col md={8}>
                  <Card.Body className='post-profile-body'>
                    <Card.Title className='post-profile-title'>{post.title}</Card.Title>
                    <Card.Text className='post-profile-text'>{post.category}</Card.Text>
                    <Card.Text className='post-profile-text'>{post.content.substring(0, 100)}...</Card.Text>
                    <Button className="ms-1 buttons-profile" variant="outline-danger" onClick={() => handleDeletePost(post._id)}><HiOutlineTrash /></Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          ))}
      </Container>
    </div>
  )
}