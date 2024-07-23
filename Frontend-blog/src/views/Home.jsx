import React, { useEffect, useState } from "react";
import { Card, Col, Image, Container, Row, Pagination } from "react-bootstrap";
import "./style.css";
import { getPosts } from "../services/api";
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const checkAuthAndFetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        try {
          const data = await getPosts(currentPage);
          console.log("Dati ricevuti nella Home:", data);
          setPosts(data.blogPosts);
          setTotalPages(data.totalPages);
          setLoaded(true);
        } catch (error) {
          console.error("Errore nel recupero dei post nella Home:", error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuthAndFetchUserData();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <body className="root">
      <Container fluid="sm">
        {!isLoggedIn ? (
          <div className="private-blog">
            <h2 className="mt-5">Questo è un blog privato,</h2>
            <h2>se vuoi vedere il contenuto devi fare il login o registrarti!</h2>
          </div>
        ) : (
          <>
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
            <Row>
              {posts
                .filter(post => post.title.toLowerCase().includes(search.toLowerCase()) || post.authorEmail.toLowerCase().includes(search.toLowerCase()))
                .map((post) => (
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