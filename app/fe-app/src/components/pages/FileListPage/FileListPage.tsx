import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  getFiles,
  createFile,
  updateFile,
  deleteFile
} from '../../../api/fileApi';

// Atoms
import Button from '../../atoms/Button/Button';

//SCSS
import './FileListPage.scss';

interface FileItem {
  nome: string;
  abbreviazione: string;
  stagione: 'SS' | 'FW';
  anno: string;
  createdAt: string;
}

const FileListPage: React.FC = () => {
  const [editingNome, setEditingNome] = useState<string | null>(null);
  const [editStagione, setEditStagione] = useState<'SS' | 'FW'>('SS');
  const [editAnno, setEditAnno] = useState('');
  const { abbreviazione } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [stagione, setStagione] = useState<'SS' | 'FW'>('SS');
  const [anno, setAnno] = useState('');

  const fetchFiles = async () => {
    if (abbreviazione) {
      const data = await getFiles(abbreviazione.toUpperCase());
      setFiles(data);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [abbreviazione]);

  if (!abbreviazione) return <p>Abbreviazione mancante</p>;

  const handleCreate = async () => {
    if (!anno || isNaN(Number(anno)) || anno.length !== 2) {
      return alert('Inserisci un anno valido (es. 25)');
    }

    try {
      const file = await createFile(abbreviazione, stagione, anno);
      setFiles(prev => [...prev, file]);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || 'Errore nella creazione');
      } else {
        alert('Errore generico');
      }
    }
  };

  const handleDelete = async (nome: string) => {
    if (confirm('Vuoi eliminare questo file?')) {
      try {
        await deleteFile(nome);
        setFiles(files.filter(f => f.nome !== nome));
      } catch (err) {
        console.error('Errore eliminazione file:', err);
      }
    }
  };

  const handleOpen = (file: FileItem) => {
    navigate(`/${file.abbreviazione}/files/${file.nome}/garments`);
  };

  const handleUpdate = async (oldNome: string) => {
    try {
      await updateFile(oldNome, abbreviazione, editStagione, editAnno);
      // Rifetch per riflettere il nuovo nome e abbreviazione
      await fetchFiles();
      setEditingNome(null);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || 'Errore aggiornamento');
      } else {
        alert('Errore generico');
      }
    }
  };

  return (
    <div className="file-list-page">
  <h2>File del Brand <span className="highlight">{abbreviazione}</span></h2>

  <div className="file-form">
    <select value={stagione} onChange={(e) => setStagione(e.target.value as 'SS' | 'FW')}>
      <option value="SS">SS</option>
      <option value="FW">FW</option>
    </select>
    <input
      type='number'
      className='number-clean'
      value={anno}
      onChange={(e) => setAnno(e.target.value)}
      placeholder="Anno (es. 25)"
      maxLength={2}
    />
    <Button label="Crea File" type="primary" size="l" onClick={handleCreate} />
  </div>

  <ul className="file-list">
    {files
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map(file => (
        <li key={file.nome} className="file-item">
          {editingNome === file.nome ? (
            <div className="file-edit-form">
              <select
                value={editStagione}
                onChange={(e) => setEditStagione(e.target.value as 'SS' | 'FW')}
              >
                <option value="SS">SS</option>
                <option value="FW">FW</option>
              </select>
              <input
                value={editAnno}
                onChange={(e) => setEditAnno(e.target.value)}
                maxLength={2}
                placeholder="Anno"
              />
              <Button label="Salva" type="primary" size="l" onClick={() => handleUpdate(file.nome)} />
              <Button label="Annulla" type="secondary" size="l" onClick={() => setEditingNome(null)} />
            </div>
          ) : (
            <div className="file-item-content">
              <div>
                <strong>{file.nome}</strong>
                <small>{new Date(file.createdAt).toLocaleString()}</small>
              </div>
              <div className="file-actions">
                <Button label="Apri" type="primary" size="l" onClick={() => handleOpen(file)} />
                <Button label="Modifica" type="secondary" size="l" onClick={() => {
                  setEditingNome(file.nome);
                  setEditAnno(file.anno);
                  setEditStagione(file.stagione);
                }} />
                <Button label="Elimina" type="secondary" size="l" onClick={() => handleDelete(file.nome)} />
              </div>
            </div>
          )}
        </li>
      ))}
  </ul>
</div>
  );
};

export default FileListPage;
