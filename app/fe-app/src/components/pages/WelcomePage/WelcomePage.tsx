import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Atoms
import Button from '../../atoms/Button/Button';

// SCSS
import './WelcomePage.scss';

const API_URL = import.meta.env.VITE_API_URL;

const WelcomePage: React.FC = () => {
  const [savedPath, setSavedPath] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const res = await axios.get(`${API_URL}/config/get-path`);
        const backendPath = res.data?.path;

        // fallback se il backend restituisce './data' o null
        if (backendPath && backendPath !== './data') {
          setSavedPath(backendPath);
          localStorage.setItem('savePath', backendPath);
        } else {
          setSavedPath(null);
        }
      } catch (err) {
        console.error('Errore nel recuperare il path salvato:', err);
      }
    };

    init();
  }, []);

  const handleChooseFolder = async () => {
    try {
      const folderPath = await window.api?.chooseDirectory();
      if (!folderPath) return;

      await axios.post(`${API_URL}/config/set-path`, {
        path: folderPath
      });

      localStorage.setItem('savePath', folderPath);
      setSavedPath(folderPath);
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
      <h1>{savedPath ? 'BENTORNATO!' : 'BENVENUTO!'}</h1>
      {savedPath ? (
        <>
          <p className="label">SEI NELLA CARTELLA:</p>
          <code className="folder">{savedPath}</code>
          <br />
          <Button label="ENTRA" onClick={handleEnter} type="primary" size="l" />
          <div className="ext">
            <Button label="CAMBIA CARTELLA" onClick={handleChooseFolder} type="secondary" size="l" />
          </div>
        </>
      ) : (
        <Button
          label="SCEGLI UNA CARTELLA PER SALVARE I DATI"
          onClick={handleChooseFolder}
          type="primary"
          size="l"
        />
      )}
    </div>
  );
};

export default WelcomePage;
