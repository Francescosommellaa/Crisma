import { Request, Response } from 'express';
import { readJSON, writeJSON, ensureDir, deleteDirectory } from '../services/fsService.js';
import path from 'path';

const BRANDS_FILE = 'brands.json';

// Utility per generare struttura cartella brand
const getBrandDirPath = (abbrev: string) => ['brands', abbrev.toUpperCase(), 'files'];

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

  // Crea la struttura cartelle
  await ensureDir(path.join(...getBrandDirPath(abbreviazione)));

  res.status(201).json(newBrand);
};

export const updateBrand = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, abbreviazione } = req.body;

  const brands = (await readJSON(BRANDS_FILE)) || [];
  const index = brands.findIndex((b: any) => String(b.id) === id);

  if (index === -1) return res.status(404).json({ message: 'Brand non trovato' });

  if (abbreviazione) {
    brands[index].abbreviazione = abbreviazione.toUpperCase();
  }

  if (nome) {
    brands[index].nome = nome;
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
