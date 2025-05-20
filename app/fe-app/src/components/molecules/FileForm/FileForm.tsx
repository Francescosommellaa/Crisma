import React, { useState } from 'react';
import { createFile } from '../../../api/fileApi';
import './FileForm.scss';

interface FileFormProps {
  brandAbbreviazione: string;
  onClose: () => void;
  onSuccess: () => void;
}

const FileForm: React.FC<FileFormProps> = ({ brandAbbreviazione, onClose, onSuccess }) => {
  const [stagione, setStagione] = useState<'SS' | 'FW'>('SS');
  const [anno, setAnno] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!/^\d{1,2}$/.test(anno)) {
      setError('Inserisci un anno valido (1-2 cifre)');
      return;
    }

    try {
      await createFile(brandAbbreviazione, stagione, anno);
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Errore sconosciuto');
    }
  };

  return (
    <div className="file-form">
      <h3>Nuovo File</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <label>Abbreviazione:</label>
      <input value={brandAbbreviazione} disabled />

      <label>Stagione:</label>
      <select value={stagione} onChange={(e) => setStagione(e.target.value as 'SS' | 'FW')}>
        <option value="SS">SS</option>
        <option value="FW">FW</option>
      </select>

      <label>Anno (max 2 cifre):</label>
      <input
        type="text"
        maxLength={2}
        value={anno}
        onChange={(e) => setAnno(e.target.value)}
      />

      <button onClick={handleSubmit}>Crea</button>
      <button onClick={onClose}>Annulla</button>
    </div>
  );
};

export default FileForm;
