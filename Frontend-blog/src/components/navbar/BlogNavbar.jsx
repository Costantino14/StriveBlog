import React from "react";
import { Button, Container, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useState, useEffect } from "react";
import "./styles.css";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';



const NavBar = (listAuthors) => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const data = localStorage.getItem("data");
  console.log(data)
  const list = listAuthors.listAuthors;
  const foundAuthor = list.find(author => author.email.toLowerCase() === data.toLowerCase());
  const nome = foundAuthor ? foundAuthor.nome : '';
  console.log(nome)

// 


  

  useEffect(() => {
    // Controlla se esiste un token nel localStorage
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      
    };

    // Controlla lo stato di login all'avvio
    checkLoginStatus();

    // Aggiungi un event listener per controllare lo stato di login
    window.addEventListener("storage", checkLoginStatus);

    // Rimuovi l'event listener quando il componente viene smontato
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };


  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>
        
{isLoggedIn ? (
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




