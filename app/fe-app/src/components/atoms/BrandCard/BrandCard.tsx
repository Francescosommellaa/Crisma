import React, { useState } from 'react';
import { updateBrand, deleteBrand } from '../../../api/brandApi';
import { useNavigate } from 'react-router-dom';

interface BrandCardProps {
  id: number;
  nome: string;
  abbreviazione: string;
  onUpdate: () => void;
}

const BrandCard: React.FC<BrandCardProps> = ({ id, nome, abbreviazione, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [newNome, setNewNome] = useState(nome);
  const [newAbbreviazione, setNewAbbreviazione] = useState(abbreviazione);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpdate = async () => {
    try {
      await updateBrand(id, newNome, newAbbreviazione);
      setEditMode(false);
      onUpdate();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Errore sconosciuto');
      }
    }
  };
  
  const handleDelete = async () => {
    try {
      await deleteBrand(id);
      onUpdate();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Errore sconosciuto');
      }
    }
  };

  return (
    <div className="brand-card">
      {editMode ? (
        <>
          <input value={newNome} onChange={(e) => setNewNome(e.target.value)} />
          <input value={newAbbreviazione} onChange={(e) => setNewAbbreviazione(e.target.value)} />
          <button onClick={handleUpdate}>Salva</button>
          <button onClick={() => setEditMode(false)}>Annulla</button>
        </>
      ) : (
        <>
          <h4>{nome}</h4>
          <p>{abbreviazione}</p>
          <button onClick={() => navigate(`/brands/${abbreviazione}/files`)}>Entra</button>
          <button onClick={() => setEditMode(true)}>Modifica</button>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}>Elimina</button>
          ) : (
            <>
              <p>Sei sicuro?</p>
              <button onClick={handleDelete}>Conferma</button>
              <button onClick={() => setConfirmDelete(false)}>Annulla</button>
            </>
          )}
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default BrandCard;
