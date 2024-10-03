//ANCHE QUESTO FACEVA PARTE DEL VECCHIO PROGETTO DI EPICODE, MODIFICHE SOLO DI STILE

import React from "react";
import { Container } from "react-bootstrap";

const Footer = (props) => {
  return (
    <footer
      style={{
        paddingTop: 50,
        paddingBottom: 50,
        backgroundColor: "#D6BD98",
      }}
    >
      <Container>{`${new Date().getFullYear()} - © GallivanTales | Developed for homework projects.`}</Container>
    </footer>
  );
};

export default Footer;
