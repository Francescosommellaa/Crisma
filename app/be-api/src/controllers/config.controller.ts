import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

let localDataPath: string = '';

const CONFIG_PATH = path.join(os.homedir(), '.crisma-config.json'); // ✅ persistente e sicuro

export const setLocalDataPath = async (req: Request, res: Response) => {
  const { path: newPath } = req.body;

  if (!newPath) return res.status(400).json({ message: 'Path mancante' });

  localDataPath = newPath;

  await fs.writeFile(CONFIG_PATH, JSON.stringify({ LOCAL_DATA_PATH: newPath }, null, 2));
  res.json({ message: 'Path configurato', path: newPath });
};

export const getLocalDataPath = async (req: Request, res: Response) => {
  try {
    const path = await getConfiguredPath();
    res.json({ path });
  } catch (err) {
    console.error('Errore in getLocalDataPath:', err);
    res.status(500).json({ message: 'Errore nel recuperare il path' });
  }
};

export const getConfiguredPath = async (): Promise<string> => {
  if (localDataPath) return localDataPath;

  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf-8');
    const json = JSON.parse(data);
    localDataPath = json.LOCAL_DATA_PATH || './data';
    return localDataPath;
  } catch {
    return './data';
  }
};
