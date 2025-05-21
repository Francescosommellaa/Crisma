import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { openDB } from 'idb';

// SCSS
import './WelcomePage.scss';

const WelcomePage: React.FC = () => {
  const [savedPath, setSavedPath] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const path = localStorage.getItem('savePath');
    if (path) setSavedPath(path);
  }, []);

  const handleChooseFolder = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker?.();
      if (!directoryHandle) throw new Error('DirectoryHandle non supportato');

      const permission = await directoryHandle.requestPermission({ mode: 'readwrite' });
      if (permission !== 'granted') {
        alert('Permesso negato alla cartella');
        return;
      }

      // Test scrittura file
      const fileHandle = await directoryHandle.getFileHandle('dati.json', { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify({ foo: 'bar' }));
      await writable.close();

      // Salva l'handle in IndexedDB
      const db = await openDB('my-db', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('folders')) {
            db.createObjectStore('folders');
          }
        },
      });
      await db.put('folders', directoryHandle, 'savedHandle');

      // Salva nome cartella visivamente
      localStorage.setItem('savePath', directoryHandle.name);
      setSavedPath(directoryHandle.name);
    } catch (err) {
      console.error('Errore nella selezione della cartella:', err);
      alert('Errore nella selezione della cartella');
    }
  };

  const handleEnter = () => {
    navigate('/dashboard');
  };

  return (
    <div className="welcome-page">
      <h1>{savedPath ? 'Bentornato!' : 'Benvenuto!'}</h1>
      {savedPath ? (
        <>
          <p>Cartella configurata:</p>
          <code>{savedPath}</code>
          <br />
          <button onClick={handleEnter}>Entra</button>
        </>
      ) : (
        <button onClick={handleChooseFolder}>Scegli una cartella per salvare i dati</button>
      )}
    </div>
  );
};

export default WelcomePage;
