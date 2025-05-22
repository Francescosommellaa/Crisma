import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGarmentsByFile, exportGarmentsCSV } from '../../../api/garmentsApi';
import {type Garment } from '../../../types/Garment';
import GarmentsTable from '../../molecules/GarmentFormStepper/GarmentFormStepper';
import GarmentFormStepper from '../../molecules/GarmentFormStepper/GarmentFormStepper';

const GarmentsTablePage: React.FC = () => {
  const { abbrev, fileId } = useParams<{ abbrev: string; fileId: string }>();
  const [garments, setGarments] = useState<Garment[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (abbrev && fileId) {
      fetchGarments();
    }
  }, [abbrev, fileId]);

  const fetchGarments = async () => {
    try {
      const data = await getGarmentsByFile(abbrev!, fileId!);
      setGarments(data);
    } catch (err) {
      console.error('Errore nel caricamento capi:', err);
    }
  };

  const handleExport = async () => {
    try {
      await exportGarmentsCSV(abbrev!, fileId!);
    } catch (err) {
      console.error('Errore esportazione:', err);
    }
  };

  if (!abbrev || !fileId) return <p>Errore: URL non valido.</p>;

  return (
    <div className="garments-page">
      <h2>
        Capi – <code>{fileId}</code>
      </h2>

      <div className="actions">
        <button onClick={() => setShowForm(true)}>Aggiungi Capo</button>
        <button onClick={handleExport}>Esporta CSV</button>
      </div>

      <GarmentsTable
        garments={garments}
        setGarments={setGarments}
        abbrev={abbrev}
        fileId={fileId}
      />

      {showForm && (
        <GarmentFormStepper
          abbrev={abbrev}
          fileId={fileId}
          onClose={() => setShowForm(false)}
          onSuccess={(newGarment) => {
            setGarments([...garments, newGarment]);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
};

export default GarmentsTablePage;
