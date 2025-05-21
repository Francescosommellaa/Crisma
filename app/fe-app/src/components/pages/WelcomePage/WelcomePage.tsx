import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { openDB } from 'idb';

// SCSS
import './WelcomePage.scss';

const API_URL = import.meta.env.VITE_API_URL;

const WelcomePage: React.FC = () => {
  const [savedPath, setSavedPath] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const path = localStorage.getItem('savePath');
    if (path) setSavedPath(path);
  }, []);

  useEffect(() => {
    const checkFolderAccess = async () => {
      const path = localStorage.getItem('savePath');
      if (path) {
        try {
          const db = await openDB('my-db', 1);
          const handle = await db.get('folders', 'savedHandle');
  
          if (!handle) throw new Error('Handle non trovato');
  
          const permission = await handle.queryPermission?.({ mode: 'readwrite' });
          if (permission !== 'granted') throw new Error('Permesso negato');
  
          // prova a leggere
          await handle.getFileHandle('dati.json');
          setSavedPath(path);
        } catch {
          // se qualcosa fallisce, resetta
          localStorage.removeItem('savePath');
          setSavedPath(null);
        }
      }
    };
  
    checkFolderAccess();
  }, []);

  const handleChooseFolder = async () => {
    try {
      if (!window.showDirectoryPicker) {
        alert('Il tuo browser non supporta showDirectoryPicker.');
        return;
      }

      const directoryHandle = await window.showDirectoryPicker();
      const permission = await directoryHandle.requestPermission({ mode: 'readwrite' });

      if (permission !== 'granted') {
        alert('Permesso negato alla cartella');
        return;
      }

      const pathName = directoryHandle.name;

      // ✅ Invio del path al backend
      await axios.post(`${API_URL}/config/set-path`, {
        path: pathName
      });

      // ✅ Salva localmente per uso futuro
      localStorage.setItem('savePath', pathName);
      setSavedPath(pathName);

      // ✅ Test di scrittura
      const fileHandle = await directoryHandle.getFileHandle('dati.json', { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify({ test: true }));
      await writable.close();
    } catch (err) {
      console.error('Errore nella selezione della cartella:', err);
      alert('Errore nella selezione della cartella');
    }
  };

  const handleEnter = () => {
    navigate('/brands');
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
    <button onClick={handleChooseFolder}>Cambia cartella</button> {/* ✅ nuovo */}
  </>
) : (
  <button onClick={handleChooseFolder}>Scegli una cartella per salvare i dati</button>
)}
    </div>
  );
};

export default WelcomePage;
