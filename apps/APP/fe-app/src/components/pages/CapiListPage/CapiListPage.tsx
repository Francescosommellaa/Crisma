import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getCapiByFile, createCapo } from '../../../api/capoApi';
import { getFileById } from '../../../api/fileApi';
import CapoFormStepper from '../../molecules/CapoFormStepper/CapoFormStepper';
import { type CapoFormData, type Capo } from '../../../types/capo';
import './CapiListPage.scss';

const CapiListPage: React.FC = () => {
  const { fileId } = useParams();
  const [capi, setCapi] = useState<Capo[]>([]);
  const [error, setError] = useState('');
  const [file, setFile] = useState<{ nome: string } | null>(null);
  const [showForm, setShowForm] = useState(false);

    const fetchCapi = useCallback(async () => {
      try {
        const data = await getCapiByFile(Number(fileId));
        setCapi(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError('Errore sconosciuto');
      }
    }, [fileId]);

    useEffect(() => {
      fetchCapi();
    }, [fetchCapi]);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const data = await getFileById(Number(fileId));
        setFile(data);
      } catch (err) {
        console.error('Errore file:', err);
      }
    };
  
    fetchFile();
  }, [fileId]);

  const handleSubmitCapo = async (data: CapoFormData) => {
    try {
      await createCapo({ ...data, fileId: Number(fileId) });
      setShowForm(false);
      fetchCapi();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Lista Capi: {file ? file.nome : `File #${fileId}`}</h2>
      <button onClick={() => setShowForm(true)}>Crea Nuovo Capo</button>

      {showForm && (
        <CapoFormStepper
          onSubmit={handleSubmitCapo}
          onCancel={() => setShowForm(false)}
        />
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {capi.length === 0 ? (
        <p>Nessun capo presente</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Gestionale</th>
              <th>Codice Colore Campione</th>
              <th>Varianti</th>
              <th>Pacchetto</th>
              <th>Marka</th>
              <th>Categoria</th>
              <th>TM</th>
              <th>Base</th>
              <th>Descrizione</th>
              <th>Prezzo</th>
              <th>Prezzo-2</th>
              <th>Taglia</th>
              <th>TM-2</th>
              <th>Fornitore</th>
              <th>Fornitore-2</th>
            </tr>
          </thead>
          <tbody>
            {capi.map((c: Capo) => (
              <tr key={c.id}>
                <td>{c.gestionale?.toString() ?? '-'}</td>
                <td>{c.codiceColoreCampione?.toString() ?? '-'}</td>
                <td>{c.varianti?.toString() ?? '-'}</td>
                <td>{c.pacchetto?.toString() ?? '-'}</td>
                <td>{c.marka?.toString() ?? '-'}</td>
                <td>{c.categoria?.toString() ?? '-'}</td>
                <td>{c.tm?.toString() ?? '-'}</td>
                <td>{c.base?.toString() ?? '-'}</td>
                <td>{c.descrizione?.toString() ?? '-'}</td>
                <td>{c.prezzo?.toString() ?? '-'}</td>
                <td>{c.prezzo2?.toString() ?? '-'}</td>
                <td>{c.taglia?.toString() ?? '-'}</td>
                <td>{c.tm2?.toString() ?? '-'}</td>
                <td>{c.fornitore?.toString() ?? '-'}</td>
                <td>{c.fornitoreTex?.toString() ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CapiListPage;
