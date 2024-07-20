import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, ListGroup, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import BlogLike from "../components/likes/BlogLike";
import { addComment, getComments, getPost } from "../services/api";
import "./style.css";
import { AiOutlineComment } from "react-icons/ai";
import _ from 'lodash';

const Blog = ({ listAuthors }) => {
  const [commentsOn, setCommentsOn] = useState(false);
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    content: "",
  });
  const [columnText, setColumnText] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postResponse = await getPost(id);
        setPost(postResponse.data);

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
  }, [id, listAuthors]);

  useEffect(() => {
    if (post && post.content) {
      const words = post.content.split(' ');
      const wordsPerColumn = Math.ceil(words.length / 3);
      const columns = _.chunk(words, wordsPerColumn);
      setColumnText(columns);
    }
  }, [post]);

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await addComment(id, newComment);
      const commentsResponse = await getComments(id);
      setComments(commentsResponse);
      setNewComment({ name: "", email: "", content: "" });
    } catch (error) {
      console.error("Errore nell'aggiunta del commento:", error);
    }
  };

  const handleClickBotton = () => {
    setCommentsOn(!commentsOn);
  };

  console.log(author)

  if (!post) return <div>Caricamento...</div>;

  return (
    <body className="root">
      <Container>
        <h1 className="blog-details-title">{post.title}</h1>
        <Image className="blog-details-cover" src={post.cover} fluid />

        <div className="blog-details-container">
          <div className="blog-details-author">
            <Row>
              <Col xs={"auto"} className="pe-0">
                <Image className="blog-author" src={author? author.avatar : "https://static.vecteezy.com/ti/vettori-gratis/p1/26530210-moderno-persona-icona-utente-e-anonimo-icona-vettore-vettoriale.jpg"} roundedCircle />
              </Col>
              <Col>
                <div>di</div>
                <h6>{author? author.nome : "Utente"}</h6>
              </Col>
            </Row>
          </div>
          <div className="blog-details-info">
            <div>{post.createdAt}</div>
            <div>{`lettura da ${post.readTime.value} ${post.readTime.unit}`}</div>
          </div>
        </div>

        <div className="columnsContainer">
          {columnText.map((column, index) => (
            <div key={index} className="textColumn">
              {column.join(' ')}
            </div>
          ))}
        </div>

        <div className="d-flex mt-5">
          <BlogLike defaultLikes={["123"]} onChange={console.log} />
          <Button variant={"dark"} className="ms-2" onClick={handleClickBotton}>
            <AiOutlineComment /> {`${comments.length} comments`}
          </Button>
        </div>

        {commentsOn && (
          <div className="mt-5">
            <h2>Commenti</h2>
            <ListGroup as="ul" className="mt-3">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <ListGroup.Item as="li" numbered key={comment._id} className="mt-2">
                    {comment.content}<br /> Utente: {comment.name}
                  </ListGroup.Item>
                ))
              ) : (
                <p>Ancora nessun commento</p>
              )}
            </ListGroup>
          </div>
        )}

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