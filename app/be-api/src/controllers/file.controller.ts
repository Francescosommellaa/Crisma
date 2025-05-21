import { Request, Response } from 'express';
import { readJSON, writeJSON, deleteDirectory, ensureDir } from '../services/fsService.js';
import path from 'path';

const FILES_DIR = 'files';

export const getAllFiles = async (req: Request, res: Response) => {
  // In locale, potremmo leggere tutte le directory ma per ora limitiamoci a un array manuale (estendibile in futuro)
  res.status(200).json({ message: 'Questa rotta verrà estesa con lettura da disco' });
};

export const createFile = async (req: Request, res: Response) => {
  const { abbreviazione, stagione, anno } = req.body;

  if (!abbreviazione || !stagione || !anno) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
  }

  const nome = `${abbreviazione.toUpperCase()}-${stagione.toUpperCase()}-${anno}`;
  const dirPath = path.join(FILES_DIR, nome);
  const filePath = path.join(dirPath, 'metadata.json');

  try {
    const existing = await readJSON(filePath);
    if (existing) {
      return res.status(400).json({ message: 'Il file esiste già' });
    }

    await ensureDir(dirPath);

    const newFile = {
      abbreviazione: abbreviazione.toUpperCase(),
      stagione: stagione.toUpperCase(),
      anno,
      nome,
      createdAt: new Date().toISOString()
    };

    await writeJSON(newFile, filePath);
    res.status(201).json(newFile);
  } catch (err) {
    console.error('Errore nella creazione file:', err);
    res.status(500).json({ message: 'Errore durante la creazione del file' });
  }
};

export const updateFile = async (req: Request, res: Response) => {
  const { nome } = req.params;
  const { abbreviazione, stagione, anno } = req.body;

  const newName = `${abbreviazione.toUpperCase()}-${stagione.toUpperCase()}-${anno}`;
  const oldPath = path.join(FILES_DIR, nome);
  const newPath = path.join(FILES_DIR, newName);

  try {
    const metadata = await readJSON(path.join(oldPath, 'metadata.json'));
    if (!metadata) return res.status(404).json({ message: 'File non trovato' });

    const updated = {
      ...metadata,
      abbreviazione: abbreviazione.toUpperCase(),
      stagione: stagione.toUpperCase(),
      anno,
      nome: newName
    };

    await ensureDir(newPath);
    await writeJSON(updated, path.join(newPath, 'metadata.json'));

    if (newName !== nome) {
      await deleteDirectory(oldPath); // elimina la vecchia cartella se è stato rinominato
    }

    res.json(updated);
  } catch (err) {
    console.error('Errore aggiornamento file:', err);
    res.status(500).json({ message: 'Errore aggiornamento file' });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  const { nome } = req.params;

  try {
    const dir = path.join(FILES_DIR, nome);
    await deleteDirectory(dir);
    res.json({ message: 'File eliminato con successo' });
  } catch (err) {
    console.error('Errore eliminazione file:', err);
    res.status(500).json({ message: 'Errore eliminazione file' });
  }
};
