import React, { useEffect } from 'react';
import './Sidebar.scss';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="sidebar-overlay" onClick={onClose}>
      <div className="sidebar" onClick={(e) => e.stopPropagation()}>
        <button className="sidebar-close" onClick={onClose} aria-label="Chiudi menu">
          ✕
        </button>

        <div className="sidebar-logo">
          <a href="#hero" onClick={onClose}>CRISMA</a>
        </div>

        <ul className="sidebar-nav">
          <li><a href="#hero" onClick={onClose}>HOME</a></li>
          <li><a href="#faq" onClick={onClose}>FAQ</a></li>
        </ul>

        <div className="sidebar-download">
          <button
            onClick={() =>
              window.open('https://github.com/Francescosommellaa/Crisma/releases', '_blank')
            }
          >
            SCARICA ORA
          </button>
          <p>Disponibile solo per Windows</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
