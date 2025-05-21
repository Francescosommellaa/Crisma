import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

// SCSS
import './FileListPage.scss';

// API
import {
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
  const { abbreviazione } = useParams<{ abbreviazione: string }>();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [stagione, setStagione] = useState<'SS' | 'FW'>('SS');
  const [anno, setAnno] = useState('');
  if (!abbreviazione) return <p>Abbreviazione mancante</p>;

  const handleCreate = async () => {
    const file = await createFile(abbreviazione, stagione, anno);
    setFiles([...files, file]);
  };

  const handleUpdate = async (file: FileItem) => {
    const updated = await updateFile(file.nome, file.abbreviazione, file.stagione, file.anno);
    setFiles(files.map(f => f.nome === file.nome ? updated : f));
  };

  const handleDelete = async (nome: string) => {
    if (confirm('Vuoi eliminare questo file?')) {
      await deleteFile(nome);
      setFiles(files.filter(f => f.nome !== nome));
    }
  };

  return (
    <div>
      <h2>File del Brand {abbreviazione}</h2>

      <div>
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
            {file.nome} – {new Date(file.createdAt).toLocaleString()}
            <button onClick={() => handleDelete(file.nome)}>Elimina</button>
            <button onClick={() => handleUpdate(file)}>Modifica</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileListPage;
