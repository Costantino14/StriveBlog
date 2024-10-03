import React, { useEffect, useState } from "react";
import { Container, Form, Badge, Card, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaUser } from "react-icons/fa";
import { getTravelPosts, getUserData } from "../services/api";
import ReactMarkdown from 'react-markdown';
import "./style.css";


const Home = ({ listAuthors }) => {
  const [travelPosts, setTravelPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await getUserData();
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Errore nel recupero dei dati utente:", error);
          setIsLoggedIn(false);
          localStorage.removeItem("token");
        }
      } else {
        setIsLoggedIn(false);
      }
  
      try {
        const postsData = await getTravelPosts(currentPage, 'createdAt', 'desc');
        setTravelPosts(postsData.travelPosts);
        setTotalPages(postsData.totalPages);
      } catch (error) {
        console.error("Errore nel recupero dei post:", error);
      }
    };
  
    fetchData();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filterPosts = (post) => {
    const searchLower = search.toLowerCase();
    return post.cities.some(city => city.name.toLowerCase().includes(searchLower));
  };

  const getAuthorDetails = (authorEmail) => {
    return listAuthors.find(author => author.email === authorEmail) || {};
  };

  return (
    <div className="root">
      <div className="hero-section">
  <Container>
    <div className="hero-content">
      <h1 className="hero-title">Gallivan<strong id="special-t">T</strong>ales</h1>
      <h2 className="hero-subtitle">Esplora il mondo attraverso gli occhi dei viaggiatori</h2>
      <p className="hero-description">
        Benvenuto su GallivanTales, la piattaforma dove i viaggiatori condividono le loro avventure.
        Scopri itinerari unici, consigli preziosi e lasciati ispirare per il tuo prossimo viaggio.
      </p>
      <Form className="hero-search-form">
        <div className="position-relative">
          <Form.Control
            placeholder='Cerca una città...'
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="hero-search-input"
          />
          <FaSearch className="hero-search-icon" />
        </div>
      </Form>
    </div>
  </Container>
</div>

      <Container>
            <div className="timeline">
              {travelPosts
                .filter(filterPosts)
                .map((post, index) => {
                  const author = getAuthorDetails(post.author);
                  return (
                    <motion.div
                      key={post._id}
                      className="timeline-item"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Badge bg="primary" className="timeline-date">
                        <FaCalendarAlt className="me-1" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Badge>
                      <Card className="timeline-content">
                        <Link to={`/blog/${post._id}`} className="text-decoration-none text-dark">
                          <Card.Img variant="top" src={post.coverImage} className="timeline-img" />
                          <Card.Body>
                            <Card.Title>{post.title}</Card.Title>
                            <div className="timeline-info mb-3">
                              <Badge bg="primary" className="me-2">
                                <FaCalendarAlt className="me-1" />
                                {new Date(post.startDate).toLocaleDateString()} - {new Date(post.endDate).toLocaleDateString()}
                              </Badge>
                              <Badge bg="warning" text="dark">
                                <FaMoneyBillWave className="me-1" />
                                {post.estimatedCost.amount} {post.estimatedCost.currency}
                              </Badge>
                            </div>
                            <div className="timeline-cities mb-3">
                              {post.cities.map((city, cityIndex) => (
                                <Badge bg="info" key={cityIndex} className="me-1 mb-1">
                                  <FaMapMarkerAlt className="me-1" />{city.name}
                                </Badge>
                              ))}
                            </div>
                            <Card.Text as={ReactMarkdown}>{post.description}</Card.Text>
                            <div className="timeline-author mt-3">
                              <FaUser className="me-2" />
                              <small>{author.nome && author.cognome ? `${author.nome} ${author.cognome}` : "Autore sconosciuto"}</small>
                            </div>
                          </Card.Body>
                        </Link>
                      </Card>
                    </motion.div>
                  );
                })}
            </div>

            <Pagination className="mt-5 justify-content-center">
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
      </Container>
    </div>
  );
};

export default Home;