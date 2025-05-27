import React from 'react';
import Button from '../../Atoms/Button/Button';
import './Navbar.scss';

const Navbar: React.FC = () => {

  return (
    <nav className="organism-navbar">
      <div className="navbar-logo">Crisma</div>
      <Button
          text="SCARICA ORA"
          onClick={() => window.open("https://github.com/Francescosommellaa/Crisma/releases", "_blank")}
        />
    </nav>
  );
};

export default Navbar;