import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

//SCSS
import './CapiTablePage.scss';

//API
import { getCapiByFile, createCapo } from '../../../api/capoApi';
import CapoFormStepper from '../../molecules/CapoFormStepper/CapoFormStepper';
import {type Capo, type CapoFormData } from '../../../types/capo';

const CapiTablePage: React.FC = () => {
  const { fileId } = useParams();
  const [capi, setCapi] = useState<Capo[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchCapi = useCallback(async () => {
    if (!fileId) return;
    const data = await getCapiByFile(Number(fileId));
    setCapi(data);
  }, [fileId]);
  
  useEffect(() => {
    fetchCapi();
  }, [fetchCapi]);

  const handleCreateCapo = async (data: CapoFormData) => {
    try {
      await createCapo(data);
      setShowForm(false);
      fetchCapi();
    } catch (err) {
      console.error('Errore creazione capo:', err);
    }
  };

  return (
    <div>
      <h2>Tabella dei Capi – File ID: {fileId}</h2>

      <button onClick={() => setShowForm(true)}>➕ Nuovo Capo</button>

      {showForm && (
        <CapoFormStepper
          fileId={Number(fileId)}
          onSubmit={handleCreateCapo}
          onCancel={() => setShowForm(false)}
        />
      )}

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
          {capi.map(capo => (
            <tr key={capo.id}>
              <td>{capo.gestionale}</td>
              <td>{capo.codiceColoreCampione}</td>
              <td>{capo.varianti}</td>
              <td>{capo.pacchetto || '-'}</td>
              <td>{capo.marka}</td>
              <td>{capo.categoria}</td>
              <td>{capo.tm}</td>
              <td>{capo.base}</td>
              <td>{capo.descrizione}</td>
              <td>{capo.prezzo || '-'}</td>
              <td>{capo.prezzo2 || '-'}</td>
              <td>{capo.taglia}</td>
              <td>{capo.tm2 || '-'}</td>
              <td>{capo.fornitore || '-'}</td>
              <td>{capo.fornitoreTex || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CapiTablePage;
