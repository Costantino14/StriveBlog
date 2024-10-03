import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { updateTravelPost, getTravelPost } from '../services/api';

const EditTravelPostModal = ({ show, handleClose, postId, onPostUpdated }) => {
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    if (show && postId) {
      fetchPostData();
    }
  }, [show, postId]);

  const fetchPostData = async () => {
    try {
      const response = await getTravelPost(postId);
      setPostData(response.data);
    } catch (error) {
      console.error("Errore nel recupero dei dati del post:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assicurati che postData sia un oggetto
      const updatedPost = await updateTravelPost(postId, postData);
      onPostUpdated(updatedPost);
      handleClose();
    } catch (error) {
      console.error("Errore nell'aggiornamento del post:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (index, field, value) => {
    const updatedCities = [...postData.cities];
    updatedCities[index] = { ...updatedCities[index], [field]: value };
    setPostData(prev => ({ ...prev, cities: updatedCities }));
  };

  if (!postData) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Modifica Post di Viaggio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Titolo</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={postData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={postData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Itinerario</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="itinerary"
              value={postData.itinerary}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Data di inizio</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={postData.startDate.split('T')[0]}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Data di fine</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={postData.endDate.split('T')[0]}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
          <Form.Label>Costo stimato</Form.Label>
          <Form.Control
    type="number"
    name="estimatedCost"
    value={postData.estimatedCost.amount}
    onChange={(e) => setPostData(prev => ({
      ...prev,
      estimatedCost: { ...prev.estimatedCost, amount: parseFloat(e.target.value) }
    }))}
    required
  />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo di viaggio</Form.Label>
            <Form.Control
              type="text"
              name="travelType"
              value={postData.travelType}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          {postData.cities.map((city, index) => (
            <div key={index}>
              <h4>Città {index + 1}</h4>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  value={city.name}
                  onChange={(e) => handleCityChange(index, 'name', e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descrizione</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={city.description}
                  onChange={(e) => handleCityChange(index, 'description', e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Specialità culinarie</Form.Label>
                <Form.Control
                  type="text"
                  value={city.foodSpecialties}
                  onChange={(e) => handleCityChange(index, 'foodSpecialties', e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Consigli</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={city.tips}
                  onChange={(e) => handleCityChange(index, 'tips', e.target.value)}
                />
              </Form.Group>
            </div>
          ))}
          
          <Button variant="primary" type="submit">
            Salva Modifiche
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditTravelPostModal;