import React, { useState, useMemo } from 'react';
import { type Garment } from '../../../types/Garment';
import { deleteGarment, updateGarment } from '../../../api/garmentsApi';
import Button from '../../atoms/Button/Button';
import './GarmentsTable.scss';

interface Props {
  garments: Garment[];
  setGarments: React.Dispatch<React.SetStateAction<Garment[]>>;
  abbrev: string;
  fileId: string;
  resetTrigger?: number;
}



const columns = [
  { key: 'categoria', label: 'Categoria' },
  { key: 'base', label: 'Base' },
  { key: 'descrizione', label: 'Descrizione' },
  { key: 'gestionale', label: 'Gestionale' },
  { key: 'marka', label: 'Marka' },
  { key: 'codiceColoreCampione', label: 'Cod. ColoreC' },
  { key: 'coloreCampione', label: 'ColoreC' },
  { key: 'varianti', label: 'Varianti' },
  { key: 'tm', label: 'TM' },
  { key: 'fornitoreTex', label: 'FornitoreTex' },
  { key: 'prezzoTex', label: 'PrezzoTex' },
  { key: 'tm2', label: 'TM2' },
  { key: 'fornitore', label: 'Fornitore' },
  { key: 'prezzo', label: 'Prezzo' },
  { key: 'taglia', label: 'Taglia' },
  { key: 'pacchetto', label: 'Pacchetto' },
];

const GarmentsTable: React.FC<Props> = ({ garments, setGarments, abbrev, fileId }) => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Garment>>({});

  const filteredData = useMemo(() => {
    return garments.filter((item) =>
      columns.every(({ key }) => {
        const filterValue = filters[key]?.toLowerCase() || '';
        return item[key as keyof Garment]?.toString().toLowerCase().includes(filterValue);
      })
    );
  }, [garments, filters]);

  const startEdit = (garment: Garment) => {
    setEditingId(garment.idGarment);
    setFormData({
      ...garment,
      tm: garment.tm?.replace('TM', '') || '',
      tm2: garment.tm2?.replace('TM', '') || '',
    });
  };

  const handleChange = (field: keyof Garment, value: string | number) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === 'codiceColoreCampione') {
        if (prev.coloreCampione) updated.coloreCampione = '';
      }

      if (field === 'coloreCampione') {
        if (prev.codiceColoreCampione) updated.codiceColoreCampione = prev.codiceColoreCampione;
      }

      return updated;
    });
  };

  const handleSave = async (id: number) => {
    try {
      const payload = {
        ...formData,
        tm: formData.tm?.padStart(3, '0'),
        tm2: formData.tm2?.padStart(3, '0'),
        prezzo: formData.prezzo ? parseFloat(formData.prezzo.toString()) : undefined,
        prezzoTex: formData.prezzoTex ? parseFloat(formData.prezzoTex.toString()) : undefined,
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
          <th>#</th>
          {columns.map(({ key, label }) => (
            <th key={key}>
              {label}
              <br />
              <input
                className="filter-input"
                type="text"
                value={filters[key] || ''}
                onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                placeholder={`Filtra ${label}`}
              />
            </th>
          ))}
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((item, index) => (
          <tr key={item.idGarment}>
            <td>{index + 1}</td>
            {columns.map(({ key }) => (
              <td key={key}>
                {editingId === item.idGarment ? (
                  <input
                    type={key.includes('prezzo') ? 'number' : 'text'}
                    value={formData[key as keyof Garment]?.toString() || ''}
                    onChange={(e) =>
                      handleChange(
                        key as keyof Garment,
                        key.includes('prezzo')
                          ? parseFloat(e.target.value)
                          : e.target.value
                      )
                    }
                  />
                ) : (
                  item[key as keyof Garment]
                )}
              </td>
            ))}
            <td>
              {editingId === item.idGarment ? (
                <>
                  <Button label="Salva" onClick={() => handleSave(item.idGarment)} size="s" />
                  <Button label="Annulla" onClick={() => setEditingId(null)} type="secondary" size="s" />
                </>
              ) : (
                <>
                  <Button label="Modifica" onClick={() => startEdit(item)} size="s" />
                  <Button label="Elimina" onClick={() => handleDelete(item.idGarment)} type="secondary" size="s" />
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
