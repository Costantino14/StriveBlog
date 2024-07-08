import React, { useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import BlogLike from "../../components/likes/BlogLike";
import { getPost } from "../../services/api";
import "./styles.css";

const Blog = props => {
  
      // Stato per memorizzare i dati del post
  const [post, setPost] = useState(null);

  // Estrae l'id del post dai parametri dell'URL
  const { id } = useParams();

  // Effect hook per fetchare i dati del post quando il componente viene montato o l'id cambia
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Effettua una richiesta GET al backend per ottenere i dettagli del post
        const response = await getPost(id);
        // Aggiorna lo stato con i dati del post
        setPost(response.data);
      } catch (error) {
        // Logga eventuali errori nella console
        console.error("Errore nella fetch del post:", error);
      }
    };
    // Chiama la funzione fetchPost
    fetchPost();
  }, [id]); // L'effetto si attiva quando l'id cambia

  // Se il post non è ancora stato caricato, mostra un messaggio di caricamento
  if (!post) return <div>Caricamento...</div>;

    return (
      <div className="blog-details-root">
        <Container>
          <Image className="blog-details-cover" src={post.cover} fluid />
          <h1 className="blog-details-title">{post.title}</h1>

          <div className="blog-details-container">
            <div className="blog-details-author">
                <Row>
                    <Col xs={"auto"} className="pe-0">
                      <Image className="blog-author" src="" roundedCircle />
                    </Col>
                    <Col>
                      <div>di</div>
                      <h6></h6>
                    </Col>
                </Row>
            </div>
            <div className="blog-details-info">
              <div>{post.createdAt}</div>
              <div>{`lettura da ${post.readTime.value} ${post.readTime.unit}`}</div>
              <div
                style={{
                  marginTop: 20,
                }}
              >
                <BlogLike defaultLikes={["123"]} onChange={console.log} />
              </div>
            </div>
          </div>

          <div>
             {post.content} 
          </div>
        </Container>
      </div>
    );
  }


export default Blog