import React, { useState } from 'react';
import { updateFile, deleteFile } from '../../../api/fileApi';
import { useNavigate } from 'react-router-dom';

interface FileItemProps {
  id: number;
  nome: string;
  stagione: 'SS' | 'FW';
  anno: string;
  createdAt: string;
  brandAbbreviazione: string;
  onUpdate: () => void;
}

const FileItem: React.FC<FileItemProps> = ({
  id,
  nome,
  stagione,
  anno,
  createdAt,
  brandAbbreviazione,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newStagione, setNewStagione] = useState(stagione);
  const [newAnno, setNewAnno] = useState(anno);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpdate = async () => {
    if (!/^\d{1,2}$/.test(newAnno)) {
      setError('Anno non valido (max 2 cifre)');
      return;
    }

    try {
      await updateFile(id, brandAbbreviazione, newStagione, newAnno);
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Errore sconosciuto');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFile(id);
      onUpdate();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Errore sconosciuto');
    }
  };

  return (
    <li className="file-item">
      {isEditing ? (
        <>
          <strong>{brandAbbreviazione}-</strong>
          <select value={newStagione} onChange={(e) => setNewStagione(e.target.value as 'SS' | 'FW')}>
            <option value="SS">SS</option>
            <option value="FW">FW</option>
          </select>
          <input
            value={newAnno}
            maxLength={2}
            onChange={(e) => setNewAnno(e.target.value)}
          />
          <button onClick={handleUpdate}>Salva</button>
          <button onClick={() => setIsEditing(false)}>Annulla</button>
        </>
      ) : (
        <>
          <strong>{nome}</strong> – {stagione} {anno} – creato il{' '}
          {new Date(createdAt).toLocaleString()}
          <button onClick={() => navigate(`/files/${id}/capi`)}>Apri</button>
          <button onClick={() => setIsEditing(true)}>Modifica</button>
          {confirmDelete ? (
            <>
              <span> Sei sicuro?</span>
              <button onClick={handleDelete}>Conferma</button>
              <button onClick={() => setConfirmDelete(false)}>Annulla</button>
            </>
          ) : (
            <button onClick={() => setConfirmDelete(true)}>Elimina</button>
          )}
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </li>
  );
};

export default FileItem;
