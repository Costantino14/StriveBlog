import React, { useEffect, useState } from "react";
import { Card, Col, Image, Container, Row } from "react-bootstrap";
import "./styles.css";
import { getPosts } from "../../services/api";
import { Link } from "react-router-dom";


const Home = () => {

 
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');


  // Effect hook per fetchare i post quando il componente viene montato
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Effettua una richiesta GET al backend per ottenere tutti i post
        const response = await getPosts();
        // Aggiorna lo stato con i dati dei post
        setPosts(response.data);
      } catch (error) {
        // Logga eventuali errori nella console
        console.error("Errore nella fetch del post:", error);
      }
    };
    // Chiamiamo la funzione fetchPosts
    fetchPosts();
  }, []);


  return (
    <Container fluid="sm">
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
            md={4}
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
      </Row>
    </Container>
  );
};

export default Home;
