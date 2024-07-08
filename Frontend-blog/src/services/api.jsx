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


// Funzioni per le operazioni CRUD di blogPost
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



// Infine, esportiamo api
export default api;