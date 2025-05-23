import React from 'react';
import './Button.scss';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'primary' | 'secondary';
  size?: 's' | 'l';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = 'primary',
  size = 'l',
  disabled = false
}) => {
  const className = `button ${type} ${size}`;

  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;
