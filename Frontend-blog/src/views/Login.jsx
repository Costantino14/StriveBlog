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
    <body className="root">
    <Container className="mt-5">
      <Row className="row-login">
        <Col md={6} className="d-none d-md-block">
          {/* Immagine decorativa */}
          <div className="background h-100"></div>
        </Col>
        <Col md={6}>
          <h2 className="mb-4">Bentornato!</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control 
                    type="email" 
                    size="lg"
                    placeholder="Scrivi la tua email" 
                    name="email" 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control 
                    type="password" 
                    size="lg"
                    placeholder="Scrivi la tua Password" 
                    name="password" 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>
                <Button variant="dark" size="lg" type="submit" className="w-100">Login</Button>
              </Form>
          <div className="text-center mt-3">
            <p>Or</p>
            <Button variant="outline-dark" size="lg" className=" w-50" onClick={handleGoogleLogin}><FaGoogle /> Google</Button>
            <Button variant="outline-dark" size="lg" className="w-50" onClick={handleGitHubLogin}><FaGithub /> GitHub</Button>
          </div>
        </Col>
      </Row>
    </Container>
    </body>
  );
}

