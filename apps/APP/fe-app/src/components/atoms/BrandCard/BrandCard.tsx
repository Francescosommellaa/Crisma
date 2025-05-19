import React from 'react';
import './BrandCard.scss';

interface BrandCardProps {
  nome: string;
  abbreviazione: string;
}

const BrandCard: React.FC<BrandCardProps> = ({ nome, abbreviazione }) => {
  return (
    <div className="brand-card">
      <h4>{nome}</h4>
      <p>{abbreviazione}</p>
    </div>
  );
};

export default BrandCard;
