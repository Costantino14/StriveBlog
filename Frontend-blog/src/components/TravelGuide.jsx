import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FaBookOpen } from 'react-icons/fa';

const TravelGuide = () => {
  const [open, setOpen] = useState(false);

  return (
    <Card className="my-4 border-0 shadow-sm">
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center ">
          <FaBookOpen size={24} className="me-2" />
          <h3 className="mb-0">Guida alla Creazione di un Post di Viaggio</h3>
        </div>
        <Button 
          variant="link" 
          onClick={() => setOpen(!open)}
          className="text-white"
        >
          {open ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </Card.Header>
      {open && (
        <Card.Body>
          <p>Benvenuti alla guida per la creazione di un post di viaggio! Seguite queste istruzioni passo dopo passo per condividere la vostra esperienza in modo coinvolgente e informativo.</p>

          <h4>1. Informazioni Generali</h4>
          <ol>
            <li><strong>Titolo Vacanza</strong>: Inserite un titolo accattivante che riassuma la vostra esperienza.</li>
            <li><strong>Descrizione Vacanza</strong>: Fornite una panoramica generale del viaggio. Usate il pulsante "B" per mettere in grassetto i punti chiave.</li>
            <li><strong>Itinerario</strong>: Delineate il vostro percorso giorno per giorno. Usate "↵" per andare a capo e "¶" per iniziare un nuovo paragrafo.</li>
            <li><strong>Date</strong>: Inserite le date di inizio e fine del viaggio.</li>
            <li><strong>Spesa stimata</strong>: Indicate il costo approssimativo del viaggio (senza comprendere il prezzo del volo e degli ostelli) e selezionate la valuta.</li>
            <li><strong>Tipo di viaggio</strong>: Scegliete la categoria che meglio descrive la vostra esperienza.</li>
            <li><strong>Immagine di copertina</strong>: Caricate un'immagine rappresentativa del vostro viaggio.</li>
          </ol>

          <h4>2. Quante città avete visitato?</h4>
          <ol>
            <li><strong>Città visitate</strong>: Importantissimo non dimenticare di selezionare il numero delle città visitate.</li>
          </ol>

          <h4>3. Descrizione delle Città</h4>
          <p>Per ogni città visitata:</p>
          <ol>
            <li><strong>Nome della città</strong>: Inserite il nome corretto della città.</li>
            <li><strong>Descrizione</strong>:
              <ul>
                <li>Descrivete le attrazioni principali.</li>
                <li>Usate il pulsante "B" per mettere in grassetto i nomi delle attrazioni.</li>
                (Esempio: "La nostra prima tappa è stata il <strong>Colosseo</strong>, simbolo eterno di Roma.")
                <li>Mantenete un tono rispettoso e familiare. Evitate linguaggio scurrile o parolacce.</li>
              </ul>
            </li>
            <li><strong>Specialità da mangiare</strong>:
              <ul>
                <li>Elencate i piatti tipici da provare e descriveteli senza troppe parole.</li>
                (Esempio: "Non potete lasciare Roma senza assaggiare la vera <strong>carbonara</strong>!")
                <li>Ricordate di usare "↵" per andare a capo ogni volta che create un punto.</li>
              </ul>
            </li>
            <li><strong>Consigli</strong>:
              <ul>
                <li>Fornite suggerimenti utili per i futuri visitatori, qualcosa che avete vissuto voi stessi.</li>
                (Esempio: "Consigliamo di acquistare la <strong>Roma Pass</strong> per risparmiare sui trasporti e gli ingressi ai musei.")
                <li>Ricordate di usare "↵" per andare a capo ogni volta che create un punto.</li>
              </ul>
            </li>
            <li><strong>Immagini</strong>: Caricate fino a 10 immagini rappresentative della città.</li>
          </ol>

          <h4>4. Consigli Generali</h4>
          <ul>
            <li>Siate dettagliati ma concisi.</li>
            <li>Usate un linguaggio descrittivo per far immergere il lettore nella vostra esperienza.</li>
            <li>Bilanciate informazioni pratiche con aneddoti personali.</li>
            <li>Rileggete e controllate la grammatica prima di inviare.</li>
          </ul>

          <h4>5. Cosa Evitare</h4>
          <ul>
            <li>Linguaggio offensivo o scurrile</li>
            <li>Informazioni personali sensibili</li>
            <li>Critiche eccessive o non costruttive</li>
            <li>Plagio da altre fonti</li>
          </ul>

          <p>Ricordate, il vostro post di viaggio potrebbe ispirare altri a esplorare nuovi luoghi. Buona scrittura!</p>
        </Card.Body>
      )}
    </Card>
  );
};

export default TravelGuide;