import fs from 'fs/promises';
import path from 'path';
import { getConfiguredPath } from '../controllers/config.controller.js';

// Crea directory all’interno del path configurato
export const ensureDir = async (...segments: string[]) => {
  try {
    const basePath = await getConfiguredPath();
    const dirPath = path.join(basePath, ...segments);
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err) {
    console.error('Errore nella creazione directory:', err);
    throw err;
  }
};

// Legge file JSON dal path configurato
export const readJSON = async (...segments: string[]) => {
  try {
    const basePath = await getConfiguredPath();
    const filePath = path.join(basePath, ...segments);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
};

// Scrive file JSON nel path configurato
export const writeJSON = async (data: any, ...segments: string[]) => {
  try {
    const basePath = await getConfiguredPath();
    const filePath = path.join(basePath, ...segments);
    const dirSegments = path.dirname(path.join(...segments)).split(path.sep);
    await ensureDir(...dirSegments);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Errore nel salvataggio JSON:', err);
    throw err;
  }
};

// Scrive file CSV nel path configurato
export const writeCSV = async (csvData: string, ...segments: string[]) => {
  try {
    const basePath = await getConfiguredPath();
    const filePath = path.join(basePath, ...segments);
    const dirSegments = path.dirname(path.join(...segments)).split(path.sep);
    await ensureDir(...dirSegments);
    await fs.writeFile(filePath, csvData, 'utf-8');
  } catch (err) {
    console.error('Errore nel salvataggio CSV:', err);
    throw err;
  }
};

// Elimina un file
export const deleteFile = async (...segments: string[]) => {
  try {
    const basePath = await getConfiguredPath();
    const filePath = path.join(basePath, ...segments);
    await fs.unlink(filePath);
  } catch (err) {
    console.error('Errore eliminazione file:', err);
    throw err;
  }
};

// Elimina una directory ricorsiva
export const deleteDirectory = async (...segments: string[]) => {
  try {
    const basePath = await getConfiguredPath();
    const dirPath = path.join(basePath, ...segments);
    await fs.rm(dirPath, { recursive: true, force: true });
  } catch (err) {
    console.error('Errore eliminazione directory:', err);
    throw err;
  }
};

// Elenca directory in un path
export const listDirectories = async (...segments: string[]) => {
  const basePath = await getConfiguredPath();
  const fullPath = path.join(basePath, ...segments);
  const entries = await fs.readdir(fullPath, { withFileTypes: true });
  return entries.filter(entry => entry.isDirectory()).map(entry => entry.name);
};

// Elenca file in un path
export const listFiles = async (...segments: string[]) => {
  const basePath = await getConfiguredPath();
  const fullPath = path.join(basePath, ...segments);
  const entries = await fs.readdir(fullPath, { withFileTypes: true });
  return entries.filter(entry => entry.isFile()).map(entry => entry.name);
};

// Rinomina un file
export const renameFile = async (oldRelative: string, newRelative: string) => {
  const base = await getConfiguredPath();
  const oldPath = path.join(base, oldRelative);
  const newPath = path.join(base, newRelative);

  try {
    await fs.rename(oldPath, newPath);
  } catch (err) {
    console.error('Errore in renameFile:', err);
    throw err;
  }
};

// Rinomina una directory
export const renameDirectory = async (oldRelative: string, newRelative: string) => {
  const base = await getConfiguredPath();
  const oldPath = path.join(base, oldRelative);
  const newPath = path.join(base, newRelative);

  try {
    // Se la nuova directory esiste già, errore esplicito
    try {
      await fs.access(newPath);
      throw new Error(`La cartella di destinazione "${newRelative}" esiste già.`);
    } catch { /* ok, non esiste */ }

    await fs.rename(oldPath, newPath);
  } catch (err) {
    console.error('Errore in renameDirectory:', err);
    throw err;
  }
};
