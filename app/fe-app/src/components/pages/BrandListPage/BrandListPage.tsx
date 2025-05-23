import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand
} from '../../../api/brandApi';

// Atoms
import Button from '../../atoms/Button/Button';

//SCSS
import './BrandListPage.scss';

interface Brand {
  id: number;
  nome: string;
  abbreviazione: string;
  createdAt: string;
}

const BrandListPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [nome, setNome] = useState('');
  const [abbreviazione, setAbbreviazione] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedNome, setEditedNome] = useState('');
  const [editedAbbreviazione, setEditedAbbreviazione] = useState('');
  const navigate = useNavigate();

  const fetchBrands = async () => {
    const data = await getBrands();
    setBrands(data);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const normalizeAbbr = (abbr: string) => abbr.toUpperCase().trim();

  const handleCreate = async () => {
    if (!nome || !abbreviazione) {
      alert('Nome e abbreviazione sono obbligatori');
      return;
    }

    await createBrand(nome.trim(), normalizeAbbr(abbreviazione));
    setNome('');
    setAbbreviazione('');
    fetchBrands();
  };

  const handleUpdate = async (id: number) => {
    if (!editedNome || !editedAbbreviazione) {
      alert('Nome e abbreviazione sono obbligatori');
      return;
    }

    await updateBrand(id, editedNome.trim(), normalizeAbbr(editedAbbreviazione));
    setEditingId(null);
    fetchBrands();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Vuoi eliminare questo brand?')) {
      await deleteBrand(id);
      fetchBrands();
    }
  };

  return (
    <div className="brand-list-page">
    <h2>Lista Brand</h2>
  
    <div className="brand-form">
      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        placeholder="Abbreviazione"
        value={abbreviazione}
        onChange={(e) => setAbbreviazione(e.target.value.toUpperCase())}
        maxLength={5}
      />
      <Button label="Crea Brand" type="primary" size="l" onClick={handleCreate} />
    </div>
  
    <ul className="brand-list">
      {brands.map((b) => (
        <li key={b.id} className="brand-item">
          {editingId === b.id ? (
            <div className="brand-edit-form">
              <input
                value={editedNome}
                onChange={(e) => setEditedNome(e.target.value)}
                placeholder="Nome"
              />
              <input
                value={editedAbbreviazione}
                onChange={(e) => setEditedAbbreviazione(e.target.value.toUpperCase())}
                placeholder="Abbreviazione"
                maxLength={5}
              />
              <Button label="Salva" type="primary" size="l" onClick={() => handleUpdate(b.id)} />
              <Button label="Annulla" type="secondary" size="l" onClick={() => setEditingId(null)} />
            </div>
          ) : (
            <div className="brand-item-content">
              <div>
                <strong>{b.nome}</strong> ({b.abbreviazione})<br />
                <small>{new Date(b.createdAt).toLocaleString()}</small>
              </div>
              <div className="brand-actions">
                <Button
                  label="Modifica"
                  type="secondary"
                  size="l"
                  onClick={() => {
                    setEditingId(b.id);
                    setEditedNome(b.nome);
                    setEditedAbbreviazione(b.abbreviazione);
                  }}
                />
                <Button label="Elimina" type="secondary" size="l" onClick={() => handleDelete(b.id)} />
                <Button
                  label="Entra"
                  type="primary"
                  size="l"
                  onClick={() => navigate(`/${b.abbreviazione}/files`)}
                />
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
  );
};

export default BrandListPage;
