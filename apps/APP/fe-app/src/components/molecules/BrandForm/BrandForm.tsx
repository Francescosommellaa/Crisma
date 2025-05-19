import React, { useState } from 'react';
import { createBrand } from '../../../api/brandApi';

interface BrandFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const BrandForm: React.FC<BrandFormProps> = ({ onClose, onSuccess }) => {
  const [nome, setNome] = useState<string>('');
  const [abbreviazione, setAbbreviazione] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    if (!nome || !abbreviazione) {
      setError('Nome e abbreviazione sono obbligatori');
      return;
    }
    try {
      await createBrand(nome, abbreviazione);
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Errore sconosciuto');
      }
    }
  };

  return (
    <div className="brand-form">
      <h3>Crea Nuovo Brand</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="text"
        placeholder="Abbreviazione"
        value={abbreviazione}
        onChange={(e) => setAbbreviazione(e.target.value)}
      />
      <button onClick={handleSubmit}>Conferma</button>
      <button onClick={onClose}>Annulla</button>
    </div>
  );
};

export default BrandForm;
