import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import BlogLike from "../../components/likes/BlogLike";
import { addComment, getComments, getPost } from "../../services/api";
import "./styles.css";

const Blog = props => {
  
      // Stato per memorizzare i dati del post
  const [post, setPost] = useState(null);

      // Stato per memorizzare i COMMENTI del post
  const [comments, setComments] = useState([]);

      // Stato per creare un nuovo commento
  const [newComment, setNewComment] = useState({
        name: "",
        email: "",
        content: "",
      });

  // Estrae l'id del post dai parametri dell'URL
  const { id } = useParams();

  // Effect hook per fetchare i dati del post quando il componente viene montato o l'id cambia
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // Effettua una richiesta GET al backend per ottenere i dettagli del post
        const postResponse = await getPost(id);
        // Aggiorna lo stato con i dati del post
        setPost(postResponse.data);
        // richeta get per i commenti:
        const commentsResponse = await getComments(id);
        setComments(commentsResponse);
        commentsResponse.forEach((comment) =>
          console.log("Comment ID:", comment._id),
        );
      } catch (error) {
        // Logga eventuali errori nella console
        console.error("Errore nella fetch del post o dei commenti:", error);
      }
    };
    // Chiama la funzione fetchPost
    fetchPostAndComments();
  }, [id]); // L'effetto si attiva quando l'id cambia

  // ci serve per gestire i cambiamenti nei campi del nuovo commento
  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  // Qui si usa questa funzione per gestire l'invio di un nuovo commento
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await addComment(id, newComment);
      // Aggiorna i commenti ricaricandoli dal database per ottenere l'ID del nuovo commento
      const commentsResponse = await getComments(id);
      setComments(commentsResponse);
      setNewComment({ name: "", email: "", content: "" });

      // Logga gli ID dei commenti dopo l'aggiornamento
      commentsResponse.forEach((comment) =>
        console.log("Comment ID:", comment._id),
      );
    } catch (error) {
      console.error("Errore nell'aggiunta del commento:", error);
    }
  };

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

      {/*QUA INIZIANO I COMMENTI, VERIFICHIAMO SE CI SONO*/}

          <div className="mt-5">
          <h2>Commenti</h2>
          <ul className="mt-3">
          {comments.length > 0 ? (
            
            comments.map((comment) => (
              
              <li key={comment._id} className="mt-2">
                <h5>Utente: {comment.name}</h5>
                <p>{comment.content}</p>
              </li>
              
            ))
           
          ) : (
            <p>Ancora nessun commento</p>
          )}
          </ul>

          {/*Form per aggiungere un nuovo commento */}
          <Form className="mt-5"  onSubmit={handleCommentSubmit}>
          <h2>Articolo</h2>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Nome:</Form.Label>
          <Form.Control
              type="text"
              name="name"
              value={newComment.name}
              onChange={handleCommentChange}
              placeholder="Il tuo nome..."
              required
            />
            </Form.Group>
            <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Email:</Form.Label>
          <Form.Control
              type="email"
              name="email"
              value={newComment.email}
              onChange={handleCommentChange}
              placeholder="La tua email..."
              required
            />
            </Form.Group>
            <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Testo articolo</Form.Label>
          <Form.Control
            as="textarea"
              name="content"
              value={newComment.content}
              onChange={handleCommentChange}
              placeholder="Il tuo commento"
              required
            />

            </Form.Group>
            <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{
            marginTop: "2em",
            }}
          >
            Aggiungi commento
          </Button>
          </Form>
          </div>
          
        </Container>
      </div>
    );
  }


export default Blog