import React from "react";
import { Button, Container, Navbar } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useState, useEffect } from "react";
import { getUserData } from "../../services/api";
import "./styles.css";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';



const NavBar = (listAuthors) => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  let nome = "User"

  const data = localStorage.getItem("data");
  
  if (data) {
    const list = listAuthors.listAuthors;
    const foundAuthor = list.find(author => author.email.toLowerCase() === data.toLowerCase());
    nome = foundAuthor ? foundAuthor.nome : 'User';
  } 
  
  console.log(nome)


  useEffect(() => {
    // Controlla se esiste un token nel localStorage
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          await getUserData();
          setIsLoggedIn(true);
          
        } catch (err) {
          console.error("Token non funzionante", err);
          localStorage.removeItem("token");
          setIsLoggedIn(false)
        }
      } else {
        setIsLoggedIn(false)
      }

      setIsLoggedIn(false);
      
    };

    // Controlla lo stato di login all'avvio
    checkLoginStatus();

    // Aggiungi un event listener per controllare lo stato di login
    window.addEventListener("storage", checkLoginStatus);

    window.addEventListener("loginStateChange", checkLoginStatus);

    // Rimuovi l'event listener quando il componente viene smontato
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginStateChange", checkLoginStatus);

    };
  }, [data]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("data");
    setIsLoggedIn(false);
    if (location.pathname === ("/")) {
      window.location.reload();
    } else {
      navigate("/")
    }
    
  };


  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>
        
{ data ? (
  <div className="d-flex">
    <DropdownButton variant="dark" size="lg" title={`Benvenuto ${nome}`}>
      <Dropdown.Item className="dropdownItem" as={Link} to="/new" size="lg">+ Crea Articolo</Dropdown.Item>
      <Dropdown.Item className="dropdownItem" as={Link} to="/profile" size="lg">Profilo</Dropdown.Item>
      <Dropdown.Item className="dropdownItem" onClick={handleLogout} size="lg">LogOut</Dropdown.Item>
    </DropdownButton>
  </div>
) : (
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




