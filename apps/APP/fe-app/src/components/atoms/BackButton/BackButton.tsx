import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.scss';

interface BackButtonProps {
  label?: string;
  onClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ label = 'Indietro', onClick }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button className="back-button" onClick={handleBack}>
      {label}
    </button>
  );
};

export default BackButton;
