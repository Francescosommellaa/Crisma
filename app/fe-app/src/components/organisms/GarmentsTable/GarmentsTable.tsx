import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { type Garment } from '../../../types/Garment';
import GarmentTable from '../../../db/GarmentTable';
import { deleteGarment, updateGarment } from '../../../api/garmentsApi';
import Button from '../../atoms/Button/Button';
import './GarmentsTable.scss';

interface Props {
  garments: Garment[];
  setGarments: React.Dispatch<React.SetStateAction<Garment[]>>;
  abbrev: string;
  fileId: string;
  showToast?: boolean;
  resetTrigger?: number;
}

const GarmentsTable: React.FC<Props> = ({
  garments,
  setGarments,
  abbrev,
  fileId,
  resetTrigger,
  showToast = false
}) => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Garment>>({});

  const filteredGarments = useMemo(() => {
    return garments.filter((item) =>
      GarmentTable.every(({ key }) => {
        const filter = filters[key];
        if (!filter) return true;
        return item[key]?.toString().toLowerCase().includes(filter.toLowerCase());
      })
    );
  }, [garments, filters]);

  const activeFiltersCount = useMemo(
    () => Object.values(filters).filter((v) => v?.trim()).length,
    [filters]
  );

  const resetFilters = () => setFilters({});

  const startEdit = useCallback((garment: Garment) => {
    setEditingId(garment.idGarment);
    setFormData({
      ...garment,
      tm: garment.tm?.replace('TM', '') || '',
      tm2: garment.tm2?.replace('TM', '') || '',
    });
  }, []);

  const handleChange = useCallback((field: keyof Garment, value: string | number) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'codiceColoreCampione' && prev.coloreCampione) updated.coloreCampione = '';
      if (field === 'coloreCampione' && prev.codiceColoreCampione) updated.codiceColoreCampione = prev.codiceColoreCampione;
      return updated;
    });
  }, []);

  const handleSave = async (id: number) => {
    try {
      const payload: Partial<Garment> = {
        ...formData,
        tm: formData.tm?.padStart(3, '0'),
        tm2: formData.tm2?.padStart(3, '0'),
        prezzo: formData.prezzo ? +formData.prezzo : undefined,
        prezzoTex: formData.prezzoTex ? +formData.prezzoTex : undefined,
      };
      const updated = await updateGarment(abbrev, fileId, id, payload);
      setGarments((prev) => prev.map((g) => (g.idGarment === id ? updated : g)));
      setEditingId(null);
    } catch (err) {
      alert('Errore aggiornamento capo');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Vuoi eliminare questo capo?')) return;
    try {
      await deleteGarment(abbrev, fileId, id);
      setGarments((prev) => prev.filter((g) => g.idGarment !== id));
    } catch (err) {
      alert('Errore eliminazione capo');
      console.error(err);
    }
  };

  useEffect(() => {
    setFilters({});
  }, [resetTrigger]);

  return (
    <>
      <div className="filters-bar">
        {activeFiltersCount > 0 && (
          <span className="filter-badge">
            {activeFiltersCount} filtro{activeFiltersCount > 1 ? 'i' : ''} attivo{activeFiltersCount > 1 ? 'i' : ''}
          </span>
        )}
        <Button label="Reset Filtri" size="s" type="secondary" onClick={resetFilters} />
      </div>

      <div className="garments-table-wrapper">
        <table className="garments-table">
          <thead>
            <tr>
              <th>#</th>
              {GarmentTable.map(({ key, label }) => (
                <th key={key}>
                  {label}
                  <input
                    className="filter-input"
                    type="text"
                    placeholder={`Filtra ${label}`}
                    value={filters[key] || ''}
                    onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                  />
                </th>
              ))}
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filteredGarments.length === 0 && (
              <tr>
                <td colSpan={GarmentTable.length + 2}>Nessun capo trovato</td>
              </tr>
            )}
            {filteredGarments.map((item, index) => (
              <tr key={item.idGarment}>
                <td>{index + 1}</td>
                {GarmentTable.map(({ key }) => (
                  <td
                    key={key}
                    className={['gestionale', 'marka', 'tm', 'tm2', 'prezzo', 'prezzoTex'].includes(key) ? 'monospace' : ''}
                  >
                    {editingId === item.idGarment ? (
                      <input
                        type={key.includes('prezzo') ? 'number' : 'text'}
                        value={formData[key]?.toString() || ''}
                        onChange={(e) =>
                          handleChange(key, key.includes('prezzo') ? +e.target.value : e.target.value)
                        }
                      />
                    ) : (
                      item[key]
                    )}
                  </td>
                ))}
                <td>
                  {editingId === item.idGarment ? (
                    <>
                      <Button label="Salva" size="s" onClick={() => handleSave(item.idGarment)} />
                      <Button label="Annulla" size="s" type="secondary" onClick={() => setEditingId(null)} />
                    </>
                  ) : (
                    <>
                      <Button label="Modifica" size="s" onClick={() => startEdit(item)} />
                      <Button label="Elimina" size="s" type="secondary" onClick={() => handleDelete(item.idGarment)} />
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showToast && (
        <div className="toast-success">✅ Capo creato con successo</div>
      )}
    </>
  );
};

export default GarmentsTable;
