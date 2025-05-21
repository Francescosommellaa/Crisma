import React, { useEffect, useState } from 'react';
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand
} from '../../../api/brandApi';

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

  const fetchBrands = async () => {
    const data = await getBrands();
    setBrands(data);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreate = async () => {
    if (!nome || !abbreviazione) return alert('Campi obbligatori');
    await createBrand(nome, abbreviazione);
    setNome('');
    setAbbreviazione('');
    fetchBrands();
  };

  const handleUpdate = async (id: number) => {
    await updateBrand(id, editedNome, editedAbbreviazione);
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
    <div className="brand-list">
      <h2>Lista Brand</h2>
      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        placeholder="Abbreviazione"
        value={abbreviazione}
        onChange={(e) => setAbbreviazione(e.target.value)}
      />
      <button onClick={handleCreate}>Crea Brand</button>

      <ul>
        {brands.map((b) => (
          <li key={b.id}>
            {editingId === b.id ? (
              <>
                <input
                  value={editedNome}
                  onChange={(e) => setEditedNome(e.target.value)}
                />
                <input
                  value={editedAbbreviazione}
                  onChange={(e) => setEditedAbbreviazione(e.target.value)}
                />
                <button onClick={() => handleUpdate(b.id)}>Salva</button>
                <button onClick={() => setEditingId(null)}>Annulla</button>
              </>
            ) : (
              <>
                <strong>{b.nome}</strong> ({b.abbreviazione}) –{' '}
                <small>{new Date(b.createdAt).toLocaleString()}</small>
                <button
                  onClick={() => {
                    setEditingId(b.id);
                    setEditedNome(b.nome);
                    setEditedAbbreviazione(b.abbreviazione);
                  }}
                >
                  Modifica
                </button>
                <button onClick={() => handleDelete(b.id)}>Elimina</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrandListPage;
