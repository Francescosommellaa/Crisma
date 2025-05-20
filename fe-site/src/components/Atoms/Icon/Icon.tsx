import React from 'react';
import './Icon.scss';

interface IconProps {
  src: string;
  alt: string;
}

const Icon: React.FC<IconProps> = ({ src, alt }) => {
  return (
    <img className="atom-icon" src={src} alt={alt} />
  );
};

export default Icon;