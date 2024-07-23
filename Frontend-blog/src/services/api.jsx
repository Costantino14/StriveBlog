import axios from "axios";

// Definiamo l'url di base'
//const API_URL = "http://localhost:5001/api";
const API_URL = "https://striveblog-uz2c.onrender.com/api";

// Configura un'istanza di axios con l'URL di base
const api = axios.create({
  baseURL: API_URL,
});

// Aggiungi un interceptor per includere il token in tutte le richieste
api.interceptors.request.use(
  (config) => {
    // Recupera il token dalla memoria locale
    const token = localStorage.getItem("token");
    if (token) {
      // Se il token esiste, aggiungilo all'header di autorizzazione
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("Token inviato:", token); // Log del token inviato per debugging
    }
    return config; // Restituisce la configurazione aggiornata
  },
  (error) => {
    // Gestisce eventuali errori durante l'invio della richiesta
    return Promise.reject(error);
  }
);

// Funzioni per le operazioni CRUD di author
export const getAuthors = async () => {
  try {
    const response = await api.get("/author");
    return response.data.authors;
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
export const updateAuthor = (id, authorData) =>
        api.put(`/author/${id}`, authorData);
export const deleteAuthor = (id) => api.delete(`/author/${id}`);


// Funzioni per le operazioni CRUD di blogPost : GET, GET SINGOLO, POST, PUT, DELETE
export const getPosts = async (page = 1, sort = 'createdAt', order = 'desc') => {
  try {
    const response = await api.get(`/blogPost?page=${page}&sort=${sort}&order=${order}`);
    return response.data;
  } catch (error) {
    console.error("Errore nel recupero dei post:", error);
    throw error;
  }
};
export const getPost = (id) => api.get(`/blogPost/${id}`);
export const createPost = async (postData) => {
  try {
    const response = await api.post("/blogPost", postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Errore nella creazione del post:", error);
    throw error;
  }
};     
export const updatePost = (id, postData) =>
        api.put(`/blogPosts/${id}`, postData);
export const deletePost = (id) => api.delete(`/blogPost/${id}`);



// Funzioni per gestire i commenti :
export const getComments = (postId) =>
        api.get(`/blogPost/${postId}/comments`).then((response) => response.data);
export const addComment = (postId, commentData) =>
        api.post(`/blogPost/${postId}/comments`, commentData)
        .then((response) => response.data);
export const getComment = (postId, commentId) =>
        api.get(`/blogPost/${postId}/comments/${commentId}`)
        .then((response) => response.data);
export const updateComment = (postId, commentId, commentData) =>
        api.put(`/blogPost/${postId}/comments/${commentId}`, commentData)
        .then((response) => response.data);
export const deleteComment = (postId, commentId) =>
        api.delete(`/blogPost/${postId}/comments/${commentId}`)
        .then((response) => response.data);






// NEW: Funzione per effettuare il login di un utente
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials); // Effettua la richiesta di login
    console.log("Risposta API login:", response.data); // Log della risposta per debugging
    return response.data; // Restituisce i dati della risposta
  } catch (error) {
    console.error("Errore nella chiamata API di login:", error); // Log dell'errore per debugging
    throw error; // Lancia l'errore per essere gestito dal chiamante
  }
};

// NEW: Funzione per ottenere i dati dell'utente attualmente autenticato
export const getMe = () =>
  api.get("/auth/me").then((response) => response.data);

// Funzione per ottenere i dati dell'utente attualmente autenticato con gestione degli errori
export const getUserData = async () => {
  try {
    const response = await api.get("/auth/me"); // Effettua la richiesta per ottenere i dati dell'utente
    return response.data; // Restituisce i dati della risposta
  } catch (error) {
    console.error("Errore nel recupero dei dati utente:", error); // Log dell'errore per debugging
    throw error; // Lancia l'errore per essere gestito dal chiamante
  }
};

// Esporta l'istanza di axios configurata per essere utilizzata altrove nel progetto
export default api;