import React from 'react';
import './Footer.scss';
import Button from '../../Atoms/Button/Button';

const Footer: React.FC = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h2>CRISMA</h2>
          <p className="footer-tagline">Gestionale moda. Offline. Tuo.</p>
        </div>

        <div className="footer-column">
          <h3>Supporto</h3>
          <ul>
          <li><a href="#hero">Torna Su</a></li>
            <li><a href="#faq">Domande Frequenti</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Scarica</h3>
          <Button
            text="📦 Scarica ora"
            onClick={() =>
              window.open('https://github.com/Francescosommellaa/Crisma/releases', '_blank')
            }
          />
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Crisma – Tutti i diritti riservati</p>
        <p className="footer-credit">Realizzato da Francesco Sommella</p>
      </div>
    </footer>
  );
};

export default Footer;
