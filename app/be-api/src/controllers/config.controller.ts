import { Request, Response } from 'express';
import fs from 'fs/promises';

let localDataPath: string = process.env.LOCAL_DATA_PATH || '';

export const setLocalDataPath = async (req: Request, res: Response) => {
  const { path } = req.body;

  if (!path) return res.status(400).json({ message: 'Path mancante' });

  localDataPath = path;

  // Salva in un file config locale
  await fs.writeFile('./local-config.json', JSON.stringify({ LOCAL_DATA_PATH: path }, null, 2));

  res.json({ message: 'Path configurato', path });
};

export const getLocalDataPath = async (req: Request, res: Response) => {
  res.json({ path: localDataPath });
};

// usato da fsService
export const getConfiguredPath = async (): Promise<string> => {
  if (localDataPath) return localDataPath;

  try {
    const data = await fs.readFile('./local-config.json', 'utf-8');
    const json = JSON.parse(data);
    return json.LOCAL_DATA_PATH || './data';
  } catch {
    return './data';
  }
};
