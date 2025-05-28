import React, { useState } from 'react';
import Button from '../../Atoms/Button/Button';
import './Navbar.scss';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // trigger eventuale apertura sidebar
    document.dispatchEvent(new CustomEvent('toggleSidebar'));
  };

  return (
    <nav className="organism-navbar">
      <div className="navbar-inner">
        <div className="navbar-logo">
          <a href="#hero">CRISMA</a>
        </div>

        <ul className="navbar-menu desktop-only">
          <li><a href="#hero">HOME</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>

        <div className="desktop-only">
          <Button
            text="SCARICA ORA"
            onClick={() =>
              window.open('https://github.com/Francescosommellaa/Crisma/releases', '_blank')
            }
          />
        </div>

        <div className="mobile-menu-icon" onClick={handleToggleMenu}>
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
