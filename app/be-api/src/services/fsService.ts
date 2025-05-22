import fs from 'fs/promises';
import path from 'path';
import { getConfiguredPath } from '../controllers/config.controller.js';

export const ensureDir = async (targetPath: string) => {
  try {
    await fs.mkdir(targetPath, { recursive: true });
  } catch (err) {
    console.error('Errore nella creazione directory:', err);
    throw err;
  }
};

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

export const writeJSON = async (data: any, ...segments: string[]) => {
  try {
    const basePath = await getConfiguredPath();
    const filePath = path.join(basePath, ...segments);
    await ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Errore nel salvataggio JSON:', err);
    throw err;
  }
};

export const writeCSV = async (csvData: string, ...segments: string[]) => {
  try {
    const basePath = await getConfiguredPath();
    const filePath = path.join(basePath, ...segments);
    await ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, csvData, 'utf-8');
  } catch (err) {
    console.error('Errore nel salvataggio CSV:', err);
    throw err;
  }
};

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

export const listDirectories = async (...segments: string[]) => {
  const basePath = await getConfiguredPath();
  const fullPath = path.join(basePath, ...segments);
  const entries = await fs.readdir(fullPath, { withFileTypes: true });
  return entries.filter(entry => entry.isDirectory()).map(entry => entry.name);
};

export const listFiles = async (...segments: string[]) => {
  const basePath = await getConfiguredPath();
  const fullPath = path.join(basePath, ...segments);
  const entries = await fs.readdir(fullPath, { withFileTypes: true });
  return entries.filter(entry => entry.isFile()).map(entry => entry.name);
};
