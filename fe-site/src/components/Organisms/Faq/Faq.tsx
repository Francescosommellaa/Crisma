import React, { useState } from 'react';
import './Faq.scss';

const faqs = [
  {
    question: 'Come funziona Crisma?',
    answer: 'Crisma è un gestionale scaricabile per la gestione dei tuoi capi. Funziona interamente offline e salva tutto localmente nella cartella che scegli.',
  },
  {
    question: 'Serve una connessione a internet?',
    answer: 'No. Dopo averlo installato, Crisma funziona completamente offline. Puoi lavorare dove e quando vuoi.',
  },
  {
    question: 'Dove vengono salvati i dati?',
    answer: 'Tutti i dati vengono salvati in una cartella del tuo computer, selezionata all’avvio. Niente database online.',
  },
  {
    question: 'Posso esportare i capi in Excel?',
    answer: 'Sì! Puoi esportare ogni tabella dei capi in formato CSV e aprirla in Excel o Google Sheets.',
  },
];

const Faq: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <h2 className="faq-title">DOMANDE FREQUENTI</h2>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? 'open' : ''}`}
            onClick={() => toggle(index)}
          >
            <div className="faq-question">
              <span>{faq.question}</span>
              <span className="arrow">{activeIndex === index ? '▲' : '▼'}</span>
            </div>
            <div
              className="faq-answer"
              style={{ maxHeight: activeIndex === index ? '200px' : '0px' }}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
