import React from 'react';
import Button from '../../Atoms/Button/Button';
import './Navbar.scss';

const Navbar: React.FC = () => {
  const handleDownload = () => {
    alert("Download Gestionale");
  };

  return (
    <nav className="organism-navbar">
      <div className="navbar-logo">GESTIONALE ABITI</div>
      <Button text="GESTIONALE ABITI" onClick={handleDownload} />
    </nav>
  );
};

export default Navbar;