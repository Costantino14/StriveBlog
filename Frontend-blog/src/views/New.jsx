import React, {useRef, useState, useEffect } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { createTravelPost, getMe } from "../services/api";
import TravelGuide from "../components/TravelGuide";

// RichTextArea component
const RichTextArea = ({ value, onChange, ...props }) => {
  const textareaRef = useRef(null);

  const insertFormatting = (startTag, endTag) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      // No text selected, do nothing
      return;
    }

    const newText = 
      value.substring(0, start) + 
      startTag + value.substring(start, end) + endTag + 
      value.substring(end);
    
    onChange({ target: { name: props.name, value: newText } });
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(end + startTag.length + endTag.length, end + startTag.length + endTag.length);
    }, 0);
  };

  const insertStrong = () => insertFormatting('__', '__');

  const insertLineBreak = () => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newText = 
      value.substring(0, start) + 
      "  \n" + 
      value.substring(end);
    
    onChange({ target: { name: props.name, value: newText } });
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 3, start + 3);
    }, 0);
  };

  const insertParagraphBreak = () => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newText = 
      value.substring(0, start) + 
      "\n\n" + 
      value.substring(end);
    
    onChange({ target: { name: props.name, value: newText } });
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 2);
    }, 0);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      insertStrong();
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return (
    <div className="rich-text-area">
      <Form.Control
        as="textarea"
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        style={{ minHeight: '100px', resize: 'vertical' }}
        {...props}
      />
      <div className="mt-2">
        <Button 
          variant="outline-secondary" 
          size="sm" 
          onClick={insertStrong}
          title="Grassetto"
        >
          B
        </Button>
        <Button 
          variant="outline-secondary" 
          size="sm" 
          onClick={insertLineBreak}
          title="Nuova riga"
          className="ml-2"
        >
          ↵
        </Button>
        <Button 
          variant="outline-secondary" 
          size="sm" 
          onClick={insertParagraphBreak}
          title="Nuovo paragrafo"
          className="ml-2"
        >
          ¶
        </Button>
      </div>
      <small className="text-muted d-block mt-1">
        Usa 'B' per il grassetto, '↵' per una nuova riga, '¶' per un nuovo paragrafo, o Ctrl+B per il grassetto
      </small>
    </div>
  );
};

const NewTravelPost = () => {
  const [coverImage, setCoverImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cityCount, setCityCount] = useState(1);

  const [post, setPost] = useState({
    title: "",
    description: "",
    itinerary: "",
    startDate: "",
    endDate: "",
    estimatedCost: { amount: "", currency: "EUR" },
    travelType: "",
    cities: [{ name: "", description: "", foodSpecialties: "", tips: "", images: [] }]
  });

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current post state:", post);
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Handling change for ${name}:`, value);
    if (name === "amount" || name === "currency") {
      setPost(prev => {
        const newPost = {
          ...prev,
          estimatedCost: { ...prev.estimatedCost, [name]: value }
        };
        console.log("Updated post state (estimatedCost):", newPost);
        return newPost;
      });
    } else {
      setPost(prev => {
        const newPost = { ...prev, [name]: value };
        console.log("Updated post state:", newPost);
        return newPost;
      });
    }
  };

  const handleCityChange = (index, field, value) => {
    console.log(`Handling city change for city ${index}, field ${field}:`, value);
    setPost(prev => {
      const newCities = [...prev.cities];
      newCities[index] = { ...newCities[index], [field]: value };
      const newPost = { ...prev, cities: newCities };
      console.log("Updated post state (cities):", newPost);
      return newPost;
    });
  };

  const handleCityImagesChange = (index, event) => {
    const files = Array.from(event.target.files);
    console.log(`Handling image change for city ${index}. Files:`, files);
    setPost(prev => {
      const newCities = [...prev.cities];
      newCities[index] = { 
        ...newCities[index], 
        images: [...newCities[index].images, ...files].slice(0, 10)
      };
      const newPost = { ...prev, cities: newCities };
      console.log("Updated post state (city images):", newPost);
      return newPost;
    });
  };

  const handleCityCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    console.log("Changing city count to:", count);
    setCityCount(count);
    setPost(prev => {
      const newPost = {
        ...prev,
        cities: Array(count).fill().map((_, i) => prev.cities[i] || { name: "", description: "", foodSpecialties: "", tips: "", images: [] })
      };
      console.log("Updated post state (city count change):", newPost);
      return newPost;
    });
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Setting cover image:", file);
    setCoverImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Starting form submission');
    try {
      // Prepare postData
      const postDataToSend = {
        ...post,
        cities: post.cities.map(city => ({
          name: city.name,
          description: city.description,
          foodSpecialties: city.foodSpecialties,
          tips: city.tips
        }))
      };
      console.log("Post data being sent:", postDataToSend);
  
      // Prepare cityImages
      const cityImages = post.cities.map(city => city.images);
      console.log("City images being sent:", cityImages);
  
      setIsLoading(true);
      console.log("Sending POST request to create travel post");
      const response = await createTravelPost(postDataToSend, coverImage, cityImages);
      setIsLoading(false);
  
      if (response && response.data) {
        console.log("Travel post created successfully:", response.data);
        navigate("/");
      } else {
        throw new Error("Risposta non valida dal server");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Errore nella creazione del post di viaggio:", error);
      alert("Si è verificato un errore durante la creazione del post di viaggio. Riprova.");
    }
  };

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        console.log("Fetching user data");
        const userData = await getMe();
        console.log("User data received:", userData);
        setPost((prevPost) => {
          const newPost = { ...prevPost, author: userData.email };
          console.log("Updated post state with user email:", newPost);
          return newPost;
        });
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error);
        navigate("/login");
      }
    };
    fetchUserEmail();
  }, [navigate]);

  return (
    <div className="root">
      <Container id="new-blog-container">
        <Form className="mt-5" onSubmit={handleSubmit}>
          <h2>Nuovo Post di Viaggio</h2>
          <TravelGuide />
          <Form.Group controlId="title" className="mt-3">
            <Form.Label>Titolo Vacanza</Form.Label>
            <Form.Control 
              type="text"
              name="title"
              value={post.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="description" className="mt-3">
            <Form.Label>Descrizione Vacanza</Form.Label>
            <RichTextArea 
              name="description"
              value={post.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="itinerary" className="mt-3">
            <Form.Label>Itinerario</Form.Label>
            <RichTextArea 
              name="itinerary"
              value={post.itinerary}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Row className="mt-3">
            <Col>
              <Form.Group controlId="startDate">
                <Form.Label>Data di inizio</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={post.startDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="endDate">
                <Form.Label>Data di fine</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={post.endDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Form.Group controlId="estimatedCostAmount">
                <Form.Label>Spesa stimata</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={post.estimatedCost.amount}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="estimatedCostCurrency">
                <Form.Label>Valuta</Form.Label>
                <Form.Control 
                  as="select"
                  name="currency"
                  value={post.estimatedCost.currency}
                  onChange={handleChange}
                  required
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="travelType" className="mt-3">
            <Form.Label>Tipo di viaggio</Form.Label>
            <Form.Control 
              as="select"
              name="travelType"
              value={post.travelType}
              onChange={handleChange}
              required
            >
              <option value="">Seleziona un tipo...</option>
              <option value="Relax">Relax</option>
              <option value="Avventura">Avventura</option>
              <option value="Culturale">Culturale</option>
              <option value="Gastronomico">Gastronomico</option>
              <option value="Romantico">Romantico</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="coverImage" className="mt-3">
            <Form.Label>Immagine di copertina (formati ammessi: jpg, png, jpeg, gif)</Form.Label>
            <Form.Control
              type="file"
              onChange={handleCoverImageChange}
              required
            />
          </Form.Group>
          
          <Form.Group controlId="cityCount" className="mt-3">
            <Form.Label>Numero di città visitate</Form.Label>
            <Form.Control 
              type="number" 
              min="1" 
              max="10"
              value={cityCount}
              onChange={handleCityCountChange}
            />
          </Form.Group>

          {post.cities.map((city, index) => (
            <div key={index} className="city-section mt-4">
              <h3>Città {index + 1}</h3>
              <Form.Group controlId={`cityName-${index}`} className="mt-2">
                <Form.Label>Nome della città</Form.Label>
                <Form.Control 
                  type="text"
                  value={city.name}
                  onChange={(e) => handleCityChange(index, 'name', e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId={`cityDescription-${index}`} className="mt-2">
                <Form.Label>Descrizione</Form.Label>
                <RichTextArea 
                  value={city.description}
                  onChange={(e) => handleCityChange(index, 'description', e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId={`cityFoodSpecialties-${index}`} className="mt-2">
                <Form.Label>Specialità da mangiare</Form.Label>
                <RichTextArea 
                  value={city.foodSpecialties}
                  onChange={(e) => handleCityChange(index, 'foodSpecialties', e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId={`cityTips-${index}`} className="mt-2">
                <Form.Label>Consigli</Form.Label>
                <RichTextArea 
                  value={city.tips}
                  onChange={(e) => handleCityChange(index, 'tips', e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId={`cityImages-${index}`} className="mt-2">
                <Form.Label>Immagini (max 10, formati ammessi: jpg, png, jpeg, gif)</Form.Label>
                <Form.Control 
                  type="file"
                  multiple
                  onChange={(e) => handleCityImagesChange(index, e)}
                  accept="image/*"
                />
              </Form.Group>
            </div>
          ))}

          <Form.Group className="d-flex my-5 justify-content-end">
            <Button type="reset" size="lg" variant="outline-dark">
              Reset
            </Button>
            <Button
              type="submit"
              size="lg"
              variant="dark"
              className="new-blog-button"
              disabled={isLoading}
            >
              {isLoading ? 'Caricamento...' : 'Crea Post di Viaggio'}
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </div>
  );
};

export default NewTravelPost;