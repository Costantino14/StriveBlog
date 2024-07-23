import React, { useState, useEffect } from "react";
import { Button, Container, Navbar, Dropdown, DropdownButton } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { getUserData } from "../../services/api";
import "./styles.css";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userDataResponse = await getUserData();
          setUserData(userDataResponse);
          setIsLoggedIn(true);
        } catch (err) {
          console.error("Token non funzionante", err);
          localStorage.removeItem("token");
          localStorage.removeItem("data");
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    window.addEventListener("storage", checkLoginStatus);
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("data");
    setIsLoggedIn(false);
    setUserData(null);
    if (location.pathname === ("/")) {
      window.location.reload();
    } else {
      navigate("/")
    }
  };

  const nome = userData ? userData.nome : "User";

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