import { readJSON, writeJSON, ensureDir } from '../services/fsService.js';
import path from 'path';

const COLOR_FILE = ['colors', 'colori.json'];

export const getColorName = async (codice: string): Promise<string | null> => {
  const map = (await readJSON(...COLOR_FILE)) || {};
  return map[codice] || null;
};

export const saveColorIfMissing = async (codice: string, nome: string) => {
  const colors = (await readJSON(...COLOR_FILE)) || {};
  if (!colors[codice]) {
    colors[codice] = nome;
    await ensureDir(path.join(...COLOR_FILE.slice(0, -1))); // crea /colors se non esiste
    await writeJSON(colors, ...COLOR_FILE);
  }
};

export const getColorMap = async (): Promise<Record<string, string>> => {
  return (await readJSON(...COLOR_FILE)) || {};
};
