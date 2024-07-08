//import { useState, useEffect } from "react";
//
//export default function Test() {
//  // Stato per memorizzare la lista degli utenti
//  const [authors, setAuthors] = useState([]);
//  // Stato per gestire i dati del nuovo utente da creare
//  const [newAuthor, setNewAuthor] = useState({ nome: "", cognome: "",email: "", dataNascita: "", avatar: ""});
//  // Stato per gestire l'utente in fase di modifica
//  const [editingAuthor, setEditingAuthor] = useState(null);
//
//  // Effetto che si attiva al montaggio del componente per caricare gli utenti
//  useEffect(() => {
//  getAuthors();
//}, []);
// 
//
//  // Funzione per ottenere la lista degli utenti dal server
//  const getAuthors = () => {
//    fetch("http://localhost:5001/api/author")
//      .then((response) => response.json())
//      .then((data) => {console.log(data)
//      setAuthors(data.authors)})
//      .catch((error) => console.error("Errore nella richiesta:", error));
//  };
//
//  // Funzione per creare un nuovo utente
//  const creaAuthor = (e) => {
//    e.preventDefault();
//    fetch("http://localhost:5001/api/author", {
//      method: "POST",
//      headers: { "Content-Type": "application/json" },
//      body: JSON.stringify(newAuthor),
//    })
//      .then((response) => response.json())
//      .then((createdAuthor) => {
//        // Aggiorna lo stato locale aggiungendo il nuovo utente
//        setAuthors([...authors, createdAuthor]);
//        // Resetta il form per il nuovo utente
//        setNewAuthor({ nome: "", cognome: "", email: "", dataNascita: "", avatar: "" }); //toDO *******
//      })
//      .catch((error) => console.error("Errore nella creazione:", error));
//  };
//
//  // Funzione per eliminare un utente
//  const cancellaAuthor = (id) => {
//    fetch(`http://localhost:5001/api/author/${id}`, { method: "DELETE" })
//      .then(() => {
//        // Aggiorna lo stato locale rimuovendo l'utente eliminato
//        setAuthors(authors.filter((author) => author._id !== id));
//      })
//      .catch((error) => console.error("Errore nell'eliminazione:", error));
//  };
//
//  // Funzione per modificare un utente esistente
//  const modificaAuthor = (e) => {
//    e.preventDefault();
//    fetch(`http://localhost:5001/api/author/${editingAuthor._id}`, {
//      method: "PATCH",
//      headers: { "Content-Type": "application/json" },
//      body: JSON.stringify(editingAuthor),
//    })
//      .then(() => {
//        // Aggiorna lo stato locale sostituendo l'utente modificato
//        setAuthors(
//          authors.map((author) =>
//            author._id === editingAuthor._id ? editingAuthor : author,
//          ),
//        );
//        // Resetta lo stato di modifica
//        setEditingAuthor(null);
//      })
//      .catch((error) => console.error("Errore nell'aggiornamento:", error));
//  };
//  console.log(authors)
//  return (
//    <div>
//      <h2>Crea Nuovo Autore</h2>
//      {/* Form per la creazione di un nuovo utente */}
//      <form onSubmit={creaAuthor}>
//        <input
//          type="text"
//          placeholder="Nome"
//          value={newAuthor.nome}
//          onChange={(e) => setNewAuthor({ ...newAuthor, nome: e.target.value })}
//          required
//        />
//        <input
//          type="text"
//          placeholder="Cognome"
//          value={newAuthor.cognomenome}
//          onChange={(e) => setNewAuthor({ ...newAuthor, cognome: e.target.value })}
//          required
//        />
//        <input
//          type="email"
//          placeholder="Email"
//          value={newAuthor.email}
//          onChange={(e) => setNewAuthor({ ...newAuthor, email: e.target.value })}
//          required
//        />
//        <input 
//        type="date"
//        value={newAuthor.dataNascita}
//        onChange={(e) => setNewAuthor({ ...newAuthor, dataNascita: e.target.value })}
//        />
//        <input
//          type="text"
//          placeholder="Avatar"
//          value={newAuthor.avatar}
//          onChange={(e) => setNewAuthor({ ...newAuthor, avatar: e.target.value })}
//          required
//        />
//        <button type="submit">Crea Autore</button>
//      </form>
//    
//
//      <h2>Lista Utenti</h2>
//      {/* Lista degli utenti con opzioni per modificare ed eliminare */}
//      <ul>
//        {authors.map((author) => (
//          <li key={author._id}>
//            {author.avatar} <br />
//            Nome: {author.nome} {author.cognome}- Data di nascita: {author.dataNascita} - Email: {author.email}
//            <button onClick={() => setEditingAuthor(author)}>Modifica</button>
//            <button onClick={() => cancellaAuthor(author._id)}>Elimina</button>
//            {/* Form di modifica che appare solo per l'utente selezionato */}
//            {editingAuthor && editingAuthor._id === author._id && (
//              <form onSubmit={modificaAuthor}>
//                <input
//                  type="text"
//                  value={editingAuthor.nome}
//                  onChange={(e) =>
//                    setEditingAuthor({ ...editingAuthor, nome: e.target.value })
//                  }
//                  required
//                />
//                <input
//                  type="text"
//                  value={editingAuthor.cognome}
//                  onChange={(e) =>
//                    setEditingAuthor({ ...editingAuthor, cognome: e.target.value })
//                  }
//                  required
//                />
//                <input
//                  type="email"
//                  value={editingAuthor.email}
//                  onChange={(e) =>
//                    setEditingAuthor({ ...editingAuthor, email: e.target.value })
//                  }
//                  required
//                />
//                <input 
//                  type="date"
//                  value={editingAuthor.dataNascita}
//                  onChange={(e) => setEditingAuthor({ ...editingAuthor, dataNascita: e.target.value })}
//                />
//                <input
//                  type="text"
//                  value={editingAuthor.avatar}
//                  onChange={(e) =>
//                    setEditingAuthor({ ...editingAuthor, avatar: e.target.value })
//                  }
//                  required
//                />
//                <button type="submit">Salva Modifiche</button>
//                <button type="button" onClick={() => setEditingAuthor(null)}>
//                  Annulla
//                </button>
//              </form>
//            )}
//          </li>
//        ))} 
//      </ul>
//    </div>
//  );
//}