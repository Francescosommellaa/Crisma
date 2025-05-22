import React, { useState } from 'react';
import {type Garment } from '../../../types/Garment';
import { deleteGarment, updateGarment } from '../../../api/garmentsApi';

interface Props {
  garments: Garment[];
  setGarments: React.Dispatch<React.SetStateAction<Garment[]>>;
  abbrev: string;
  fileId: string;
}

const GarmentsTable: React.FC<Props> = ({ garments, setGarments, abbrev, fileId }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Garment>>({});

  const startEdit = (garment: Garment) => {
    setEditingId(garment.idGarment);
    setFormData({
      base: garment.base,
      descrizione: garment.descrizione,
      categoria: garment.categoria,
      tm: garment.tm?.replace('TM', '') || '',
      prezzo: garment.prezzo ?? undefined,
      taglia: garment.taglia ?? '',
    });
  };

  const handleChange = (field: keyof Garment, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (id: number) => {
    try {
      const updated = await updateGarment(abbrev, fileId, id, {
        ...formData,
      });
      setGarments((prev) =>
        prev.map((g) => (g.idGarment === id ? updated : g))
      );
      setEditingId(null);
    } catch (err) {
      alert('Errore aggiornamento capo');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Vuoi eliminare questo capo?')) {
      try {
        await deleteGarment(abbrev, fileId, id);
        setGarments((prev) => prev.filter((g) => g.idGarment !== id));
      } catch (err) {
        alert('Errore eliminazione capo');
        console.error(err);
      }
    }
  };

  return (
    <table className="garments-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Categoria</th>
          <th>Base</th>
          <th>Descrizione</th>
          <th>TM</th>
          <th>Prezzo</th>
          <th>Taglia</th>
          <th>Gestionale</th>
          <th>Marka</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        {garments.map((g) => (
          <tr key={g.idGarment}>
            <td>{g.idGarment}</td>

            {editingId === g.idGarment ? (
              <>
                <td>
                  <input
                    value={formData.categoria || ''}
                    onChange={(e) => handleChange('categoria', e.target.value.toUpperCase())}
                  />
                </td>
                <td>
                  <input
                    value={formData.base || ''}
                    onChange={(e) => handleChange('base', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    value={formData.descrizione || ''}
                    onChange={(e) => handleChange('descrizione', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    value={formData.tm || ''}
                    onChange={(e) => handleChange('tm', e.target.value)}
                    maxLength={3}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.prezzo ?? ''}
                    onChange={(e) => handleChange('prezzo', parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <input
                    value={formData.taglia || ''}
                    onChange={(e) => handleChange('taglia', e.target.value)}
                  />
                </td>
              </>
            ) : (
              <>
                <td>{g.categoria}</td>
                <td>{g.base}</td>
                <td>{g.descrizione}</td>
                <td>{g.tm}</td>
                <td>{g.prezzo?.toFixed(3)}</td>
                <td>{g.taglia}</td>
              </>
            )}

            <td>{g.gestionale}</td>
            <td>{g.marka}</td>
            <td>
              {editingId === g.idGarment ? (
                <>
                  <button onClick={() => handleSave(g.idGarment)}>Salva</button>
                  <button onClick={() => setEditingId(null)}>Annulla</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(g)}>Modifica</button>
                  <button onClick={() => handleDelete(g.idGarment)}>Elimina</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GarmentsTable;
