import React, { useEffect, useState } from "react";
import { Card, Col, Image, Container, Row } from "react-bootstrap";
import "./styles.css";
import { getPosts } from "../../services/api";
import { Link } from "react-router-dom";


const Home = () => {

 
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  // Effect hook per fetchare i post quando il componente viene montato
  useEffect(() => {

  const checkAuthAndFetchUserData = async () => {
    const token = localStorage.getItem("token"); // Recupera il token di autenticazione dalla memoria locale
    if (token) {
      setIsLoggedIn(true); // Imposta lo stato di autenticazione a true
      try {
        const response = await getPosts();
          // Aggiorna lo stato con i dati dei post
          setPosts(response.data);
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error); // Logga l'errore in console
        setIsLoggedIn(false); // Imposta lo stato di autenticazione a false
      }
    } else {
      setIsLoggedIn(false); // Imposta lo stato di autenticazione a false
    }
  };

  checkAuthAndFetchUserData(); // Verifica l'autenticazione e carica i dati dell'utente
}, []);

  return (
    <Container fluid="sm">
      {isLoggedIn ? (
        <>
      <form className="mt-5">
        <input className='ms-2'
          placeholder='Cerca per titoli:'
          type="text"
          name="name" 
          value={search}
          onChange={(e) => setSearch(e.target.value)} 
        />
      </form>
      <h1 className="blog-main-title mb-3">Benvenuto sullo Strive Blog!</h1>
      <Row>
        {posts.filter(post => post.title.toLowerCase().includes(search) || post.authorEmail.toLowerCase().includes(search) )
        .map((post) => (
          <Col
            key={`item-${post._id}`}
            xs={12}
            md={6}
            lg={4}
            style={{
              marginBottom: 50,
            }}
          >
            <Link to={`/blog/${post._id}`} className="blog-link">
              <Card className="blog-card">
                <Card.Img variant="top" src={post.cover} className="blog-cover" />
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                </Card.Body>
                <Card.Footer>
                  <Row>
                    <Col xs={"auto"} className="pe-0">
                      <Image className="blog-author" src={post.cover} roundedCircle />
                    </Col>
                    <Col>
                      <div>di</div>
                      <h6>{post.authorEmail}</h6>
                    </Col>
                  </Row>
                </Card.Footer>
              </Card>
            </Link>
          </Col>
        ))}
      </Row> </>) : (
      <>
        <h2  className="mt-5">Questo è un blog privato,</h2>
        <h2>se vuoi vedere il contenuto devi fare il login o registrarti!</h2>
      </>
      )}
    </Container>
  );
};

export default Home;


