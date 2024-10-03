import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";
import Home from "./views/Home";
import Blog from "./views/Blog";
import NewTravelPost from "./views/New";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./views/Register.jsx";
import Login from "./views/Login.jsx";
import { useEffect, useState } from "react";
import { getAuthors } from "./services/api.jsx";
import Profile from "./views/Profile.jsx";
import 'bootstrap-icons/font/bootstrap-icons.css';




function App() {

  const [listAuthors, setListAuthors] = useState([]);

  useEffect(() => {
    const Autori = async () => {
      try {
          const response = await getAuthors();
            // Aggiorna lo stato con i dati dei post
            setListAuthors(response);
      } catch (error) {
          console.error("Errore nel recupero dei dati utenti:", error); // Logga l'errore in console
      }
 
    };
  
    Autori();

  },[])


  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home listAuthors={listAuthors} />} />
        <Route path="/blog/:id" element={<Blog listAuthors={listAuthors} />} />
        <Route path="/new" element={<NewTravelPost />} />
        <Route path="/profile" element={<Profile  />} />
      </Routes>
      <Footer />
      
    </Router>
  );
}

export default App;
