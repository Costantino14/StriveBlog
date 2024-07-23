import React, { useEffect, useState } from "react";
import { Card, Col, Image, Container, Row, Pagination } from "react-bootstrap";
import "./style.css";
import { getPosts, getAuthors } from "../services/api";
import { Link } from "react-router-dom";

const Home = () => {
  // Stati per gestire i dati e lo stato dell'applicazione
  const [posts, setPosts] = useState([]);
  const [authors, setAuthors] = useState({});
  const [search, setSearch] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // Funzione per verificare l'autenticazione e recuperare i dati
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        try {
          // Recupera i post e gli autori in parallelo
          const [postsData, authorsData] = await Promise.all([
            getPosts(currentPage, 'createdAt', 'desc'),
            getAuthors()
          ]);
          console.log("Dati ricevuti nella Home:", postsData);
          setPosts(postsData.blogPosts);
          setTotalPages(postsData.totalPages);
          
          // Crea una mappa degli autori per un accesso più veloce
          const authorsMap = authorsData.reduce((acc, author) => {
            acc[author.email.toLowerCase()] = author;
            return acc;
          }, {});
          setAuthors(authorsMap);
          
          setLoaded(true);
        } catch (error) {
          console.error("Errore nel recupero dei dati nella Home:", error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuthAndFetchData();
  }, [currentPage]);

  // Gestisce il cambio di pagina
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Filtra i post in base alla ricerca
  const filterPosts = (post) => {
    const searchLower = search.toLowerCase();
    return (
      post.title.toLowerCase().startsWith(searchLower) ||
      post.authorEmail.toLowerCase().startsWith(searchLower)
    );
  };

  return (
    <body className="root">
      <Container fluid="sm">
        {!isLoggedIn ? (
          // Messaggio per utenti non autenticati
          <div className="private-blog">
            <h2 className="mt-5">Questo è un blog privato,</h2>
            <h2>se vuoi vedere il contenuto devi fare il login o registrarti!</h2>
          </div>
        ) : (
          // Contenuto per utenti autenticati
          <>
            {/* Campo di ricerca */}
            <form className="mt-5">
              <input
                className='ms-2'
                placeholder='Cerca per titoli:'
                type="text"
                name="name" 
                value={search}
                onChange={(e) => setSearch(e.target.value)} 
              />
            </form>
            <h1 className="blog-main-title mb-3">Benvenuto sullo Strive Blog!</h1>
            {/* Grid dei post */}
            <Row>
              {posts
                .filter(filterPosts)
                .map((post) => {
                  const author = authors[post.authorEmail.toLowerCase()];
                  return (
                    <Col
                      key={`item-${post._id}`}
                      xs={12}
                      md={6}
                      lg={4}
                      className={`blog-coll ${loaded ? "fade-in" : ""}`}
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
                                <Image 
                                  className="blog-author" 
                                  src={author ? author.avatar : 'https://i.pinimg.com/236x/61/f5/d9/61f5d9d30d33cfe3d5e6267222a21065.jpg'} 
                                  roundedCircle 
                                />
                              </Col>
                              <Col>
                                <div>di</div>
                                <h6>{author ? `${author.nome} ${author.cognome}` : post.authorEmail}</h6>
                              </Col>
                            </Row>
                          </Card.Footer>
                        </Card>
                      </Link>
                    </Col>
                  );
                })}
            </Row>
            {/* Paginazione */}
            <Pagination className="mt-3 justify-content-center">
              <Pagination.Prev 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages).keys()].map((number) => (
                <Pagination.Item 
                  key={number + 1} 
                  active={number + 1 === currentPage}
                  onClick={() => handlePageChange(number + 1)}
                >
                  {number + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </>
        )}
      </Container>
    </body>
  );
};

export default Home;