import React, { useEffect, useState } from 'react'
import "./style.css";
import { deleteAuthor, getPosts } from '../services/api';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { HiOutlineTrash } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

export default function Profile(listAuthors) {
  const [posts, setPosts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [foundAuthor, setFoundAuthor] = useState(null);
  const navigate = useNavigate();


  const data = localStorage.getItem("data");
  
  useEffect(() => {
    if (data && listAuthors.listAuthors) {
      const list = listAuthors.listAuthors;
      const author = list.find(author => author.email.toLowerCase() === data.toLowerCase());
      setFoundAuthor(author || null);
    }
  }, [data, listAuthors]);

  useEffect(() => {
    const FetchBlogPost = async () => {
      try {
        const response = await getPosts();
        setPosts(response.data);
        setLoaded(true);
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error);
      }    
    };
  
    FetchBlogPost(); 
  }, []);

  const handleDelete = async (id) => {
    if (!foundAuthor) {
      console.error("Autore non trovato");
      return;
    }
    try {
      const response = await deleteAuthor(id);
      if (response) {
        localStorage.removeItem("token");
        localStorage.removeItem("data");
        navigate("/");
      } else {
        console.error("Errore nella cancellazione del autore, passaggio errato");
      }
    } catch (error) {
      console.error("Errore nella cancellazione del autore:", error.response?.data || error.message);
    }
  };


  console.log(posts);   
  console.log(foundAuthor);

  if (!foundAuthor) {
    return <div>Caricamento...</div>;
  }

  return (
    <div className='root'>
      <Container>
      <div className='profile-center'>
      <h1 className='title-profile'>Profilo</h1>
      
      <Card className="profile-card">
      <div className="profile-image-container">
        <Card.Img variant="top" src={foundAuthor.avatar} className="profile-image" />
      </div>
      <Card.Body>
        <Card.Title>{foundAuthor.nome} {foundAuthor.cognome}</Card.Title>
        <Card.Text>
            Data di Nascita: {foundAuthor.dataNascita} <br />
            E-mail: {foundAuthor.email}
        </Card.Text>
        <div className=''>
          <Button className="ms-1 buttons-profile" variant="outline-success" ><HiOutlineTrash /></Button>
          <Button className="ms-1 buttons-profile" variant="outline-danger" onClick={() =>handleDelete(foundAuthor._id)}><HiOutlineTrash /></Button>
        </div>
      </Card.Body>
    </Card>
    </div>

    {posts.filter(post => post.authorEmail.toLowerCase().includes(foundAuthor.email))
  .map((post) => (
    
    <Card className="post-profile-card horizontal-card">
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
        </Card.Body>
      </Col>
    </Row>
  </Card>
  ))}
  </Container>
    </div>
  )
}



   