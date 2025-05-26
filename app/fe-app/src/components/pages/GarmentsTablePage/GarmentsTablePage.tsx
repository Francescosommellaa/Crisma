import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getGarmentsByFile, exportGarmentsCSV } from '../../../api/garmentsApi';
import { type Garment } from '../../../types/Garment';
import GarmentsTable from '../../organisms/GarmentsTable/GarmentsTable';
import GarmentFormStepper from '../../molecules/GarmentFormStepper/GarmentFormStepper';

// Atoms
import Button from '../../atoms/Button/Button';

// SCSS
import './GarmentsTablePage.scss';

const GarmentsTablePage: React.FC = () => {
  const { abbrev, fileId } = useParams<{ abbrev: string; fileId: string }>();

  const [garments, setGarments] = useState<Garment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [filterResetCounter, setFilterResetCounter] = useState(0);

  const fetchGarments = useCallback(async () => {
    try {
      const data = await getGarmentsByFile(abbrev!, fileId!);
      setGarments(data);
    } catch (err) {
      console.error('Errore nel caricamento capi:', err);
    }
  }, [abbrev, fileId]);

  useEffect(() => {
    if (abbrev && fileId) fetchGarments();
  }, [abbrev, fileId, fetchGarments]);

  const handleGarmentSuccess = (newGarment: Garment) => {
    setGarments((prev) => [...prev, newGarment]);
    setFilterResetCounter((c) => c + 1);
    setShowForm(false);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
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
      <div className="header">
        <h2>Capi</h2>
        <code className="file-id">{fileId}</code>
      </div>

      <div className="actions">
        <Button
          label="Aggiungi Capo"
          type="primary"
          size="l"
          onClick={() => setShowForm(true)}
        />
        <Button
          label="Esporta CSV"
          type="secondary"
          size="l"
          onClick={handleExport}
        />
      </div>

      <GarmentsTable
        garments={garments}
        setGarments={setGarments}
        abbrev={abbrev}
        fileId={fileId}
        showToast={toastVisible}
        resetTrigger={filterResetCounter}
      />

      {showForm && (
        <GarmentFormStepper
          abbrev={abbrev}
          fileId={fileId}
          onClose={() => setShowForm(false)}
          onSuccess={handleGarmentSuccess}
        />
      )}
    </div>
  );
};

export default GarmentsTablePage;
