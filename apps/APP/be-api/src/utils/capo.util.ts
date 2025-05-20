import Capo from '../models/capo.model.js';
import File from '../models/file.model.js';

export const generateCodes = async (
  fileId: number,
  categoria: string,
  brand: string,
  abbreviazione: string,
  stagione: string,
  anno: string
) => {
  const count = await Capo.count({ where: { fileId } });
  const progressivo = 1000 + count;

  const cat = categoria.toUpperCase().substring(0, 3);
  const abbrev = abbreviazione.toUpperCase();
  const brandUpper = brand.toUpperCase();
  const year = anno.padStart(2, '0');

  const gestionale = `${abbrev}${year}${progressivo}${cat}`;
  const marka = `${stagione.toUpperCase()}${year}${abbrev}-${progressivo}${cat}`;

  return {
    brand: brandUpper,
    abbreviazione: abbrev,
    gestionale: gestionale.toUpperCase(),
    marka: marka.toUpperCase()
  };
};
