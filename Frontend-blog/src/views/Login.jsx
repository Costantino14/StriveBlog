import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaGoogle, FaGithub } from "react-icons/fa";
import "./style.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      localStorage.setItem("token", response.token);
      localStorage.setItem("userData", JSON.stringify({email: formData.email}));
      window.dispatchEvent(new Event("storage"));
      alert("Login effettuato con successo!");
      navigate("/");
    } catch (error) {
      console.error("Errore durante il login:", error);
      alert("Credenziali non valide. Riprova.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const handleGitHubLogin = () => {
    window.location.href = `${API_URL}/api/auth/github`;
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2>Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">Login</Button>
          </Form>
          <div className="mt-3">
            <Button onClick={handleGoogleLogin} variant="outline-danger">
              <FaGoogle /> Login con Google
            </Button>
            <Button onClick={handleGitHubLogin} variant="outline-dark" className="ml-2">
              <FaGithub /> Login con GitHub
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}