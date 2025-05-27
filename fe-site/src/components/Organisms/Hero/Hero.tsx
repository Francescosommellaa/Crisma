import React from 'react';
import Button from '../../Atoms/Button/Button';
import Icon from '../../Atoms/Icon/Icon';
import './Hero.scss';

const Hero: React.FC = () => {

  return (
    <section className="hero-section">
      <div className='text-center'>
        <h1>SCARICA CRISMA</h1>
        <Button
          text="SCARICA ORA"
          onClick={() => window.open("https://github.com/Francescosommellaa/Crisma/releases", "_blank")}
        />
      </div>

      <div className="hero-footer">
        <p>VAI ALLE FAQ</p>
        <Icon src="/assets/icon/Arrow.svg" alt="Arrow Icon" />
      </div>
    </section>
  );
};

export default Hero;