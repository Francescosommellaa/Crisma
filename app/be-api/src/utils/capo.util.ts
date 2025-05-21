import { readJSON } from '../services/fsService.js';
import path from 'path';

export const generateCodes = async (
  fileId: string,
  categoria: string,
  brand: string,
  abbreviazione: string,
  stagione: string,
  anno: string
) => {
  const fileDir = path.join('files', fileId);
  const capi = await readJSON(fileDir, 'capi.json') || [];

  const progressivo = 1000 + capi.length;

  const cat = categoria.toUpperCase().substring(0, 3);
  const abbrev = abbreviazione.toUpperCase();
  const brandUpper = brand.toUpperCase();
  const year = anno.padStart(2, '0');

  const gestionale = `${abbrev}${year}${progressivo}${cat}`;
  const marka = `${stagione.toUpperCase()}${year}-${progressivo}${cat}`;

  return {
    brand: brandUpper,
    abbreviazione: abbrev,
    gestionale: gestionale.toUpperCase(),
    marka: marka.toUpperCase()
  };
};
