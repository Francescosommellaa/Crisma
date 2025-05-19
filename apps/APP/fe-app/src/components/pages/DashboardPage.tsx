import React, { useState, useEffect } from 'react';
import { getBrands } from '../../api/brandApi';
import BrandCard from '../atoms/BrandCard/BrandCard';
import BrandForm from '../molecules/BrandForm/BrandForm';

interface Brand {
  id: number;
  nome: string;
  abbreviazione: string;
}

const DashboardPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);

  const fetchBrands = async () => {
    try {
      const data = await getBrands();
      setBrands(data);
    } catch (error) {
      console.error('Errore nel recupero dei brand:', error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSuccess = () => {
    fetchBrands();
  };

  return (
    <div>
      <h2>Dashboard - Elenco Brand</h2>
      <button onClick={() => setShowForm(true)}>Crea Nuovo Brand</button>
      {showForm && (
        <BrandForm onClose={() => setShowForm(false)} onSuccess={handleSuccess} />
      )}
      <div className="brand-list">
        {brands.map((brand) => (
          <BrandCard key={brand.id} nome={brand.nome} abbreviazione={brand.abbreviazione} />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
