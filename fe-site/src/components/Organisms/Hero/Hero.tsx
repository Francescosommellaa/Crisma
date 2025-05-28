import React from 'react';
import Button from '../../Atoms/Button/Button';
import Icon from '../../Atoms/Icon/Icon';
import './Hero.scss';

const Hero: React.FC = () => {
  const scrollToFaq = () => {
    const faqSection = document.getElementById('faq');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          GESTIONALE <span className="highlight">CRISMA</span><br />
          PER LA MODA
        </h1>
        <p className="hero-subtitle">
          Organizza brand, stagioni e capi in un click. Tutto offline, tutto tuo.
        </p>
        <Button
          text="📦 SCARICA ORA"
          onClick={() =>
            window.open(
              'https://github.com/Francescosommellaa/Crisma/releases',
              '_blank'
            )
          }
        />
      </div>

      <div className="hero-footer" onClick={scrollToFaq}>
        <p className="faq-link">VAI ALLE FAQ</p>
        <Icon src="/assets/icon/Arrow.svg" alt="Arrow Icon" />
      </div>
    </section>
  );
};

export default Hero;
