import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FileListPage.scss';
import axios from 'axios';
import {
  getFiles,
  createFile,
  updateFile,
  deleteFile
} from '../../../api/fileApi';

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

  useEffect(() => {
    const fetch = async () => {
      if (abbreviazione) {
        const data = await getFiles(abbreviazione.toUpperCase());
        setFiles(data);
      }
    };
    fetch();
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
      const updated = await updateFile(oldNome, abbreviazione, editStagione, editAnno);
      setFiles(files.map(f => f.nome === oldNome ? updated : f));
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
      <h2>File del Brand <strong>{abbreviazione}</strong></h2>

      <div className="file-form">
        <select value={stagione} onChange={(e) => setStagione(e.target.value as 'SS' | 'FW')}>
          <option value="SS">SS</option>
          <option value="FW">FW</option>
        </select>
        <input
          value={anno}
          onChange={(e) => setAnno(e.target.value)}
          placeholder="Anno (es. 25)"
          maxLength={2}
        />
        <button onClick={handleCreate}>Crea File</button>
      </div>

      <ul>
        {files.map(file => (
          <li key={file.nome}>
            {editingNome === file.nome ? (
              <>
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
                <button onClick={() => handleUpdate(file.nome)}>Salva</button>
                <button onClick={() => setEditingNome(null)}>Annulla</button>
              </>
            ) : (
              <>
                <strong>{file.nome}</strong> – <small>{new Date(file.createdAt).toLocaleString()}</small>
                <button onClick={() => handleOpen(file)}>Apri</button>
                <button onClick={() => {
                  setEditingNome(file.nome);
                  setEditAnno(file.anno);
                  setEditStagione(file.stagione);
                }}>Modifica</button>
                <button onClick={() => handleDelete(file.nome)}>Elimina</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileListPage;
