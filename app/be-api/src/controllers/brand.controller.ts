import { Request, Response } from 'express';
import { readJSON, writeJSON } from '../services/fsService.js';
import path from 'path';

const BRANDS_FILE = 'brands.json';

const getAllBrands = async (req: Request, res: Response) => {
  const brands = (await readJSON(BRANDS_FILE)) || [];
  res.json(brands);
};

const createBrand = async (req: Request, res: Response) => {
  const { nome, abbreviazione } = req.body;

  if (!nome || !abbreviazione) {
    return res.status(400).json({ message: 'Nome e abbreviazione sono obbligatori' });
  }

  const brands = (await readJSON(BRANDS_FILE)) || [];

  // Evita duplicati
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
  res.status(201).json(newBrand);
};

const updateBrand = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, abbreviazione } = req.body;

  const brands = (await readJSON(BRANDS_FILE)) || [];
  const index = brands.findIndex((b: any) => String(b.id) === id);

  if (index === -1) return res.status(404).json({ message: 'Brand non trovato' });

  brands[index] = {
    ...brands[index],
    nome: nome || brands[index].nome,
    abbreviazione: abbreviazione || brands[index].abbreviazione
  };

  await writeJSON(brands, BRANDS_FILE);
  res.json(brands[index]);
};

const deleteBrand = async (req: Request, res: Response) => {
  const { id } = req.params;

  const brands = (await readJSON(BRANDS_FILE)) || [];
  const updated = brands.filter((b: any) => String(b.id) !== id);

  if (updated.length === brands.length) {
    return res.status(404).json({ message: 'Brand non trovato' });
  }

  await writeJSON(updated, BRANDS_FILE);
  res.json({ message: 'Brand eliminato' });
};

export { getAllBrands, createBrand, updateBrand, deleteBrand };
