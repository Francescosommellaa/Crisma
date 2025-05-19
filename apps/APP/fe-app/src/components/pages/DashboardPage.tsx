import React, { useEffect, useState } from 'react';
import { getBrands } from '../../api/brandApi';

interface Brand {
  id: number;
  nome: string;
  abbreviazione: string;
}

const DashboardPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error('Errore nel recupero dei brand:', error);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div>
      <h2>Dashboard - Elenco Brand</h2>
      <ul>
        {brands.map((brand) => (
          <li key={brand.id}>{brand.nome} ({brand.abbreviazione})</li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;
