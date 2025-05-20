import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getFilesByBrand } from '../../api/fileApi';
import FileForm from '../molecules/FileForm/FileForm';
import FileItem from '../atoms/FileItem/FileItem';

interface FileItem {
  id: number;
  nome: string;
  stagione: 'SS' | 'FW';
  anno: string;
  createdAt: string;
}

const FileListPage: React.FC = () => {
  const { abbreviazione } = useParams();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  

  const fetchFiles = useCallback(async () => {
    try {
      const data = await getFilesByBrand(abbreviazione || '');
      const sorted = data.sort((a, b) => {
        const aKey = `${a.anno}-${a.stagione}`;
        const bKey = `${b.anno}-${b.stagione}`;
        return bKey.localeCompare(aKey);
      });
      setFiles(sorted);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Errore sconosciuto');
    }
  }, [abbreviazione]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <div>
      <h2>File del Brand: {abbreviazione}</h2>
      <button onClick={() => setShowForm(true)}>Crea Nuovo File</button>

      {showForm && (
      <FileForm
        brandAbbreviazione={abbreviazione || ''}
        onClose={() => setShowForm(false)}
        onSuccess={() => {
            fetchFiles();
        }}
      />
    )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {files.length === 0 ? (
        <p>Nessun file trovato</p>
      ) : (
        <ol>
          {files.map((file) => (
            <FileItem
              key={file.id}
              id={file.id}
              nome={file.nome}
              stagione={file.stagione}
              anno={file.anno}
              createdAt={file.createdAt}
              brandAbbreviazione={abbreviazione || ''}
              onUpdate={fetchFiles}
            />
          ))}
        </ol>
      )}
    </div>
  );
};

export default FileListPage;
