import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, ListGroup, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import BlogLike from "../components/likes/BlogLike";
import ModalComment from "../components/ModalComment"
import { addComment, deleteComment, getComments, getPost } from "../services/api";
import "./style.css";
import { AiOutlineComment,} from "react-icons/ai";
import { HiOutlineTrash } from "react-icons/hi";
import _ from 'lodash';

const Blog = ({ listAuthors }) => {
  // Ottiene l'ID del post dalla URL
  const { id } = useParams();
  // Recupera l'email dell'utente loggato dal localStorage
  const emailLogin = localStorage.getItem("data");

  // Stati per gestire vari aspetti del componente
  const [commentsOn, setCommentsOn] = useState(false);
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [columnText, setColumnText] = useState([]);
  const [chComm, setChComm] = useState({content: ""})

  // Stato per un nuovo commento
  const [newComment, setNewComment] = useState({
    name: "",
    email: emailLogin,
    content: "",
  });

  // Effetto per caricare il post e i commenti
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postResponse = await getPost(id);
        setPost(postResponse.data);

        // Trova l'autore del post nella lista degli autori
        if (postResponse.data && listAuthors) {
          const detailsAuthor = listAuthors.find(
            item => item.email.toLowerCase() === postResponse.data.authorEmail.toLowerCase()
          );
          setAuthor(detailsAuthor);
        }

        const commentsResponse = await getComments(id);
        setComments(commentsResponse);
      } catch (error) {
        console.error("Errore nella fetch del post o dei commenti:", error);
      }
    };

    fetchPostAndComments();
  }, [id, chComm, listAuthors]);

  // Effetto per dividere il contenuto del post in colonne
  useEffect(() => {
    if (post && post.content) {
      const words = post.content.split(' ');
      const wordsPerColumn = Math.ceil(words.length / 3);
      const columns = _.chunk(words, wordsPerColumn);
      setColumnText(columns);
    }
  }, [post]);

  // Gestisce il toggle della visualizzazione dei commenti
  const handleClickBotton = () => {
     setCommentsOn(!commentsOn);
  };

  // Gestisce i cambiamenti nei campi del nuovo commento
  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  // Gestisce l'invio di un nuovo commento
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await addComment(id, newComment);
      const commentsResponse = await getComments(id);
      setComments(commentsResponse);
      setNewComment({ name: "", email: emailLogin, content: "" });
    } catch (error) {
      console.error("Errore nell'aggiunta del commento:", error);
    }
  };

  // Funzione per cancellare un commento
  const handleDeleteComment = async (commentId) => {
    if (!commentId) {
      console.error("Commento non trovato");
      return;
    }
    try {
      const response = await deleteComment(id, commentId);
      if (response) {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
      } else {
        console.error("Errore nella cancellazione del commento, passaggio errato");
      }
    } catch (error) {
      console.error("Errore nella cancellazione del commento:", error.response?.data || error.message);
    }
  };

  // Aggiorna un commento nella lista dei commenti
  const updateCommentInList = (commentId, updatedContent) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment._id === commentId ? {...comment, content: updatedContent} : comment
      )
    );
    setChComm({ content: updatedContent });
  };

  if (!post) return <body className="root">Caricamento...</body>;

  return (
    <body className="root">
      <Container>
        <h1 className="blog-details-title">{post.title}</h1>
        <Image className="blog-details-cover" src={post.cover} fluid />

        <div className="blog-details-container">
          <div className="blog-details-author">
            <Row>
              <Col xs={"auto"} className="pe-0">
                {/* Mostra l'avatar dell'autore se disponibile, altrimenti usa un'immagine di default */}
                <Image className="blog-author" src={author? author.avatar : "https://i.pinimg.com/236x/61/f5/d9/61f5d9d30d33cfe3d5e6267222a21065.jpg"} roundedCircle />
              </Col>
              <Col>
                <div>di</div>
                {/* Mostra il nome dell'autore se disponibile, altrimenti "Utente" */}
                <h6>{author? author.nome : "Utente"}</h6>
              </Col>
            </Row>
          </div>
          <div className="blog-details-info">
            <div>{post.createdAt}</div>
            <div>{`lettura da ${post.readTime.value} ${post.readTime.unit}`}</div>
          </div>
        </div>

        {/* Renderizza il contenuto del post in colonne */}
        <div className="columnsContainer">
          {columnText.map((column, index) => (
            <div key={index} className="textColumn">
              {column.join(' ')}
            </div>
          ))}
        </div>

        {/* Sezione per i like e i commenti */}
        <div className="d-flex mt-5">
          <BlogLike defaultLikes={["123"]} onChange={console.log} />
          <Button variant={"dark"} className="ms-2" onClick={handleClickBotton}>
            <AiOutlineComment /> {`${comments.length} comments`}
          </Button>
        </div>

        {/* Sezione dei commenti (visibile solo se commentsOn è true) */}
        {commentsOn && (
          <div className="mt-5">
            <h2>Commenti</h2>
            <ListGroup as="ul" className="mt-3">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <ListGroup.Item as="li" numbered key={comment._id} className="comment-dettails">
                    {comment.content}<br /> Utente: {comment.name}
                    {emailLogin === comment.email && (<div>
                      <ModalComment 
                        id={id} 
                        commentId={comment._id} 
                        chComm={{ content: comment.content }}
                        setChComm={setChComm}
                        updateCommentInList={updateCommentInList}
                      />
                    <Button className="ms-1" variant="outline-danger" onClick={() =>handleDeleteComment(comment._id)}><HiOutlineTrash /></Button></div>)}
                  </ListGroup.Item>
                ))
              ) : (
                <p>Ancora nessun commento</p>
              )}
            </ListGroup>
          </div>
        )}

        {/* Form per aggiungere un nuovo commento */}
        <Form className="mt-5" onSubmit={handleCommentSubmit}>
          <h2>Inserisci un commento:</h2>
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
              readOnly
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
            className="button-blog"
          >
            Aggiungi
          </Button>
        </Form>
      </Container>
    </body>
  );
};

export default Blog;