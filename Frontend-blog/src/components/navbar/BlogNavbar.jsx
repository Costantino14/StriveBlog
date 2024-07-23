import React, { useState, useEffect } from "react";
import { Button, Container, Navbar, Dropdown, DropdownButton } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { getUserData } from "../../services/api";
import "./styles.css";

const NavBar = () => {
  // Stati per gestire lo stato di login e i dati dell'utente
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Funzione per verificare lo stato di login dell'utente
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Se c'è un token, recupera i dati dell'utente
          const userDataResponse = await getUserData();
          setUserData(userDataResponse);
          setIsLoggedIn(true);
        } catch (err) {
          console.error("Token non funzionante", err);
          // Se il token non è valido, rimuovi le credenziali
          localStorage.removeItem("token");
          localStorage.removeItem("data");
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    // Aggiungi un listener per gli eventi di storage
    window.addEventListener("storage", checkLoginStatus);
    return () => {
      // Rimuovi il listener quando il componente viene smontato
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // Funzione per gestire il logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("data");
    setIsLoggedIn(false);
    setUserData(null);
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/")
    }
  };

  // Usa il nome dell'utente se disponibile, altrimenti "User"
  const nome = userData ? userData.nome : "User";

  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>
        
        {isLoggedIn ? (
          // Mostra il menu dropdown se l'utente è loggato
          <div className="d-flex">
            <DropdownButton variant="dark" size="lg" title={`Benvenuto ${nome}`}>
              <Dropdown.Item className="dropdownItem" as={Link} to="/new" size="lg">+ Crea Articolo</Dropdown.Item>
              <Dropdown.Item className="dropdownItem" as={Link} to="/profile" size="lg">Profilo</Dropdown.Item>
              <Dropdown.Item className="dropdownItem" onClick={handleLogout} size="lg">LogOut</Dropdown.Item>
            </DropdownButton>
          </div>
        ) : (
          // Mostra i pulsanti di login e registrazione se l'utente non è loggato
          <div className="d-flex">
            <Button as={Link} to="/login" className="blog-navbar-add-button bg-dark" size="lg">
              Login
            </Button>
            <Button as={Link} to="/register" className="blog-navbar-add-button bg-dark" size="lg">
              Registrati
            </Button>
          </div>
        )}
      </Container>
    </Navbar>
  );
};

export default NavBar;