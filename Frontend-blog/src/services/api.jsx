import axios from "axios";

// Definiamo l'url di base'
const API_URL = "http://localhost:5001/api";

// Configura un'istanza di axios con l'URL di base
const api = axios.create({
  baseURL: API_URL,
});
// Funzioni per le operazioni CRUD di author
export const getAuthors = () => api.get("/author");
export const getAuthor = (id) => api.get(`/author/${id}`);
export const createAuthor = (authorData) => api.post("/author", authorData);
export const updateAuthor = (id, authorData) =>
        api.put(`/author/${id}`, authorData);
export const deleteAuthor = (id) => api.delete(`/author/${id}`);


// Funzioni per le operazioni CRUD di blogPost : GET, GET SINGOLO, POST, PUT, DELETE
export const getPosts = () => api.get("/blogPost");
export const getPost = (id) => api.get(`/blogPost/${id}`);
export const createPost = (postData) =>
        api.post("/blogPost", postData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });      
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


// Infine, esportiamo api
export default api;