import { Request, Response } from 'express';
import { readJSON, listDirectories, writeJSON, deleteDirectory, ensureDir } from '../services/fsService.js';
import path from 'path';

// Helpers
const getFileDir = (abbrev: string, nomeFile: string) =>
  ['brands', abbrev.toUpperCase(), 'files', nomeFile];
const getMetadataPath = (abbrev: string, nomeFile: string) =>
  [...getFileDir(abbrev, nomeFile), 'metadata.json'];

export const getAllFiles = async (req: Request, res: Response) => {
  const { abbreviazione } = req.query;
  if (!abbreviazione) {
    return res.status(400).json({ message: 'Abbreviazione mancante' });
  }

  try {
    const files: any[] = [];
    const folders = await listDirectories('brands', String(abbreviazione).toUpperCase(), 'files');

    for (const folder of folders) {
      const meta = await readJSON('brands', String(abbreviazione).toUpperCase(), 'files', folder, 'metadata.json');
      if (meta) files.push(meta);
    }

    res.json(files);
  } catch (err) {
    console.error('Errore lettura files:', err);
    res.status(500).json({ message: 'Errore nella lettura dei file' });
  }
};

export const createFile = async (req: Request, res: Response) => {
  const { abbreviazione, stagione, anno } = req.body;

  if (!abbreviazione || !stagione || !anno) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
  }

  const ABBR = abbreviazione.toUpperCase();
  const STAG = stagione.toUpperCase();
  const nome = `${ABBR}-${STAG}-${anno}`;

  const dirPath = getFileDir(ABBR, nome);
  const metadataPath = getMetadataPath(ABBR, nome);

  try {
    const existing = await readJSON(...metadataPath);
    if (existing) {
      return res.status(400).json({ message: 'Il file esiste già' });
    }

    await ensureDir(path.join(...dirPath));

    const newFile = {
      abbreviazione: ABBR,
      stagione: STAG,
      anno,
      nome,
      createdAt: new Date().toISOString()
    };

    await writeJSON(newFile, ...metadataPath);
    res.status(201).json(newFile);
  } catch (err) {
    console.error('Errore nella creazione file:', err);
    res.status(500).json({ message: 'Errore durante la creazione del file' });
  }
};

export const updateFile = async (req: Request, res: Response) => {
  const { nome } = req.params;
  const { abbreviazione, stagione, anno } = req.body;

  const OLD_ABBR = nome.split('-')[0];
  const NEW_ABBR = abbreviazione.toUpperCase();
  const NEW_STAG = stagione.toUpperCase();
  const newName = `${NEW_ABBR}-${NEW_STAG}-${anno}`;

  const oldPath = getFileDir(OLD_ABBR, nome);
  const newPath = getFileDir(NEW_ABBR, newName);

  try {
    const metadata = await readJSON(...getMetadataPath(OLD_ABBR, nome));
    if (!metadata) return res.status(404).json({ message: 'File non trovato' });

    const updated = {
      ...metadata,
      abbreviazione: NEW_ABBR,
      stagione: NEW_STAG,
      anno,
      nome: newName
    };

    await ensureDir(path.join(...newPath));
    await writeJSON(updated, ...getMetadataPath(NEW_ABBR, newName));

    if (newName !== nome || OLD_ABBR !== NEW_ABBR) {
      await deleteDirectory(...oldPath);
    }

    res.json(updated);
  } catch (err) {
    console.error('Errore aggiornamento file:', err);
    res.status(500).json({ message: 'Errore aggiornamento file' });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  const { nome } = req.params;
  const ABBR = nome.split('-')[0]; // es. AW-SS-26 → AW

  try {
    await deleteDirectory(...getFileDir(ABBR, nome));
    res.json({ message: 'File eliminato con successo' });
  } catch (err) {
    console.error('Errore eliminazione file:', err);
    res.status(500).json({ message: 'Errore eliminazione file' });
  }
};
