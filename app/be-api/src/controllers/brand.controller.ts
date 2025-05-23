import { Request, Response } from 'express';
import {
  readJSON,
  writeJSON,
  ensureDir,
  deleteDirectory,
  renameDirectory,
  listDirectories,
} from '../services/fsService.js';
import path from 'path';
import { getGarmentsPath, generateCodes } from '../utils/garmentUtils.js';

const BRANDS_FILE = 'brands.json';

export const getAllBrands = async (req: Request, res: Response) => {
  const brands = (await readJSON(BRANDS_FILE)) || [];
  res.json(brands);
};

export const createBrand = async (req: Request, res: Response) => {
  let { nome, abbreviazione } = req.body;

  if (!nome || !abbreviazione) {
    return res.status(400).json({ message: 'Nome e abbreviazione sono obbligatori' });
  }

  abbreviazione = abbreviazione.toUpperCase();
  const brands = (await readJSON(BRANDS_FILE)) || [];

  const exists = brands.find((b: any) => b.abbreviazione === abbreviazione);
  if (exists) {
    return res.status(400).json({ message: 'Abbreviazione già esistente' });
  }

  const newBrand = {
    id: Date.now(),
    nome,
    abbreviazione,
    createdAt: new Date().toISOString()
  };

  brands.push(newBrand);
  await writeJSON(brands, BRANDS_FILE);

  // Crea la struttura cartelle correttamente nella cartella scelta dall’utente
  await ensureDir(path.join('brands', abbreviazione, 'files'));

  res.status(201).json(newBrand);
};

export const updateBrand = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, abbreviazione } = req.body;

  const brands = (await readJSON(BRANDS_FILE)) || [];
  const index = brands.findIndex((b: any) => String(b.id) === id);

  if (index === -1) return res.status(404).json({ message: 'Brand non trovato' });

  const oldAbbrev = brands[index].abbreviazione;
  const newAbbrev = abbreviazione?.toUpperCase();

  if (nome) brands[index].nome = nome;

  if (abbreviazione && newAbbrev !== oldAbbrev) {
    brands[index].abbreviazione = newAbbrev;

    const oldBrandDir = path.join('brands', oldAbbrev);
    const newBrandDir = path.join('brands', newAbbrev);

    try {
      await renameDirectory(oldBrandDir, newBrandDir);
      const fileDirs = await listDirectories(newBrandDir, 'files');

      for (const oldFolder of fileDirs) {
        if (!oldFolder.startsWith(oldAbbrev + '-')) continue;
        const parts = oldFolder.split('-');
        if (parts.length !== 3) continue;

        const [_, stagione, anno] = parts;
        const newFolder = `${newAbbrev}-${stagione}-${anno}`;
        const oldPath = path.join(newBrandDir, 'files', oldFolder);
        const newPath = path.join(newBrandDir, 'files', newFolder);

        await renameDirectory(oldPath, newPath);

        const metadataPath = path.join(newPath, 'metadata.json');
        const metadata = await readJSON(metadataPath);
        if (metadata) {
          metadata.abbreviazione = newAbbrev;
          metadata.nome = newFolder;
          await writeJSON(metadata, metadataPath);
        }

        const garmentsPathSegments = getGarmentsPath(newAbbrev, newFolder);
        const garments = (await readJSON(...garmentsPathSegments)) || [];

        const updatedGarments = garments.map((g: any) => {
          const { gestionale, marka } = generateCodes(
            newAbbrev,
            anno,
            stagione,
            g.idGarment,
            g.categoria
          );
          return {
            ...g,
            abbreviazione: newAbbrev,
            gestionale,
            marka
          };
        });

        await writeJSON(updatedGarments, ...garmentsPathSegments);
      }
    } catch (err: any) {
      console.error('Errore durante rinomina cartelle brand:', err.stack || err.message || err);
      return res.status(500).json({ message: 'Errore durante la modifica del brand' });
    }
  }

  await writeJSON(brands, BRANDS_FILE);
  res.json(brands[index]);
};

export const deleteBrand = async (req: Request, res: Response) => {
  const { id } = req.params;

  const brands = (await readJSON(BRANDS_FILE)) || [];
  const index = brands.findIndex((b: any) => String(b.id) === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Brand non trovato' });
  }

  const abbreviazione = brands[index].abbreviazione;

  // Elimina dal JSON
  const updated = brands.filter((b: any) => String(b.id) !== id);
  await writeJSON(updated, BRANDS_FILE);

  // Elimina cartella del brand
  await deleteDirectory('brands', abbreviazione);

  res.json({ message: 'Brand eliminato' });
};
