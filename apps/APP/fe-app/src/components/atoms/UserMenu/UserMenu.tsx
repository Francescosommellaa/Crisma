import React, { useState } from 'react';
import './UserMenu.scss';

const UserMenu: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="user-menu">
      <button onClick={() => setOpen(!open)}>☰</button>
      {open && (
        <div className="dropdown">
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleInvite}>Invita Utente</button>
          <button onClick={handleDeleteAccount}>Elimina Account</button>
        </div>
      )}
    </div>
  );
};

const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/';
};

const handleInvite = () => {
  const email = prompt('Inserisci l\'email del nuovo utente da invitare:');
  if (email && email.includes('@')) {
    // TODO: chiamata API per invito
    console.log('Invito inviato a', email);
  }
};

const handleDeleteAccount = () => {
  if (confirm('Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile.')) {
    // TODO: chiamata API per eliminare l'account
    console.log('Account eliminato');
  }
};

export default UserMenu;
