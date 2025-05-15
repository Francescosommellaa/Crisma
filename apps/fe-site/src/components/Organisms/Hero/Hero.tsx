import React from 'react';
import Button from '../../Atoms/Button/Button';
import Icon from '../../Atoms/Icon/Icon';
import './Hero.scss';

const Hero: React.FC = () => {
  const handleDownload = () => {
    alert("Scarica il gestionale!");
  };

  return (
    <section className="hero-section">
      <div className='text-center'>
        <h1>SCARICA IL GESTIONALE</h1>
        <Button text="SCARICA ORA" onClick={handleDownload} />
      </div>

      <div className="hero-footer">
        <p>VAI ALLE FAQ</p>
        <Icon src="/assets/icon/Arrow.svg" alt="Arrow Icon" />
      </div>
    </section>
  );
};

export default Hero;