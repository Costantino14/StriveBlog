import axios from "axios";

// Definiamo l'url di base'
//const API_URL = "http://localhost:5001/api";

const API_URL = "https://striveblog-uz2c.onrender.com/api" || "http://localhost:5001/api" ;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("Token inviato:", token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Funzioni per le operazioni CRUD di author
export const getAuthors = async () => {
  try {
    const response = await api.get("/author");
    return response.data;
  } catch (error) {
    console.error("Errore nel recupero degli autori:", error);
    throw error;
  }
};
export const getAuthor = (id) => api.get(`/author/${id}`);
export const registerUser = (authorData) => 
  api.post("/author", authorData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }); 

  export const updateProfile = async (id, userData) => {
    try {
      console.log('Inviando dati al backend:', id, userData);
      
      const formData = new FormData();
      
      // Aggiungi tutti i campi al FormData
      Object.keys(userData).forEach(key => {
        if (key === 'avatar' && userData[key] instanceof File) {
          formData.append('avatar', userData[key]);
        } else {
          formData.append(key, userData[key]);
        }
      });
  
      // Log del contenuto di FormData
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      const response = await api.patch(`/author/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log('Risposta dal backend:', response.data);
      return response.data;
    } catch (error) {
      console.error("Errore nell'aggiornamento del profilo:", error);
      throw error;
    }
  };

export const deleteAuthor = (id) => api.delete(`/author/${id}`);


// Funzioni per le operazioni CRUD di TRAVELPOSTS : GET, GET SINGOLO, POST, PUT, DELETE

export const getTravelPosts = async (page = 1, sort = 'createdAt', order = 'desc') => {
  try {
    const response = await api.get(`/travel-posts?page=${page}&sort=${sort}&order=${order}`);
    return response.data || null;
  } catch (error) {
    console.error("Errore nel recupero dei post di viaggio:", error);
    throw error;
  }
};

export const getTravelPost = (id) => api.get(`/travel-posts/${id}`);

// Funzione di utilità per visualizzare il contenuto di FormData
const logFormData = (formData) => {
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }
};

export const createTravelPost = async (postData, coverImage, cityImages) => {
  console.log('Api: postData:', postData, ', cover:', coverImage, ', città:', cityImages);
  try {
    const formData = new FormData();
    formData.append('postData', JSON.stringify(postData));
    
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    cityImages.forEach((cityImageArray, cityIndex) => {
      cityImageArray.forEach((image, imageIndex) => {
        formData.append(`cityImages[${cityIndex}]`, image);
      });
    });

    const response = await api.post("/travel-posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Errore nella creazione del post di viaggio:", error);
    throw error;
  }
};

export const updateTravelPost = async (id, postData) => {
  try {
    console.log("Inizio updateTravelPost con id:", id);
    console.log("Dati del post da inviare:", postData);

    // Invia direttamente l'oggetto postData, senza usare FormData
    const response = await api.put(`/travel-posts/${id}`, postData);
    console.log("Risposta ricevuta:", response.data);
    return response.data;
  } catch (error) {
    console.error("Errore nell'aggiornamento del post di viaggio:", error);
    throw error;
  }
};

export const deleteTravelPost = (id) => api.delete(`/travel-posts/${id}`);

// Funzioni aggiornate per gestire i commenti dei TravelPost
export const getTravelPostComments = (postId) =>
  api.get(`/travel-posts/${postId}/comments`).then((response) => response.data);

export const addTravelPostComment = (postId, commentData) =>
  api.post(`/travel-posts/${postId}/comments`, commentData)
    .then((response) => response.data);

export const updateTravelPostComment = (postId, commentId, commentData) =>
  api.put(`/travel-posts/${postId}/comments/${commentId}`, commentData)
    .then((response) => response.data);

export const deleteTravelPostComment = (postId, commentId) =>
  api.delete(`/travel-posts/${postId}/comments/${commentId}`)
    .then((response) => response.data);



// Funzione per effettuare il login di un utente
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials); 
    console.log("Risposta API login:", response.data); 
    return response.data; 
  } catch (error) {
    console.error("Errore nella chiamata API di login:", error); 
    throw error; 
  }
};

//Funzione per ottenere i dati dell'utente attualmente autenticato
export const getMe = () =>
  api.get("/auth/me").then((response) => response.data);

// Funzione per ottenere i dati dell'utente attualmente autenticato con gestione degli errori
export const getUserData = async () => {
  try {
    const response = await api.get("/auth/me"); 
    return response.data;
  } catch (error) {
    console.error("Errore nel recupero dei dati utente:", error); 
    throw error; 
  }
};

export default api;