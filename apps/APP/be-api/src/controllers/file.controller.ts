import { Request, Response } from 'express';
import File from '../models/file.model.js';

export const createFile = async (req: Request, res: Response) => {
  const { brandAbbreviazione, stagione, anno } = req.body;

  if (!brandAbbreviazione || !stagione || !anno) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
  }

  const nome = `${brandAbbreviazione}-${stagione}-${anno}`;

  try {
    const existing = await File.findOne({ where: { nome } });
    if (existing) return res.status(400).json({ message: 'Il file esiste già' });

    const file = await File.create({ brandAbbreviazione, stagione, anno, nome });
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ message: 'Errore durante la creazione del file' });
  }
};

export const getFiles = async (req: Request, res: Response) => {
  try {
    const files = await File.findAll();
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero dei file' });
  }
};

export const getFileById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const file = await File.findByPk(id);
    if (!file) return res.status(404).json({ message: 'File non trovato' });
    res.json(file);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero del file' });
  }
};

export const updateFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { brandAbbreviazione, stagione, anno } = req.body;

  const nome = `${brandAbbreviazione}-${stagione}-${anno}`;

  try {
    const file = await File.findByPk(id);
    if (!file) return res.status(404).json({ message: 'File non trovato' });

    const conflict = await File.findOne({ where: { nome } });
    if (conflict && conflict.id !== Number(id)) {
      return res.status(400).json({ message: 'Un altro file con lo stesso nome esiste già' });
    }

    file.brandAbbreviazione = brandAbbreviazione;
    file.stagione = stagione;
    file.anno = anno;
    file.nome = nome;
    await file.save();

    res.json(file);
  } catch (err) {
    res.status(500).json({ message: 'Errore durante l\'aggiornamento del file' });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const file = await File.findByPk(id);
    if (!file) return res.status(404).json({ message: 'File non trovato' });

    await file.destroy();
    res.json({ message: 'File eliminato con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Errore durante l\'eliminazione del file' });
  }
};
