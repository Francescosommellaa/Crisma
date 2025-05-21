import { Request, Response } from 'express';
import { readJSON, writeJSON } from '../services/fsService.js';
import path from 'path';

export const getCapiByFile = async (req: Request, res: Response) => {
  const { fileId } = req.query;

  if (!fileId) return res.status(400).json({ message: 'fileId richiesto' });

  const fileDir = path.join('files', fileId as string);
  const capi = await readJSON(fileDir, 'capi.json') || [];

  res.json(capi);
};

export const createCapo = async (req: Request, res: Response) => {
  const {
    fileId,
    codiceColoreCampione,
    varianti,
    pacchetto,
    categoria,
    tm,
    base,
    descrizione,
    prezzo,
    prezzo2,
    taglia = 'S',
    tm2,
    fornitore,
    fornitore2
  } = req.body;

  if (!fileId || !codiceColoreCampione || !varianti || !categoria || !tm || !base || !descrizione) {
    return res.status(400).json({ message: 'Campi obbligatori mancanti' });
  }

  const fileDir = path.join('files', fileId);
  const metadata = await readJSON(fileDir, 'metadata.json');
  if (!metadata) return res.status(404).json({ message: 'File non trovato' });

  const capi = await readJSON(fileDir, 'capi.json') || [];

  const nextProgressivo = 1000 + capi.length;

  const gestionale = `${metadata.abbreviazione}${metadata.anno}${nextProgressivo}${categoria.toUpperCase()}`;
  const marka = `${metadata.stagione}${metadata.anno}-${nextProgressivo}${categoria.toUpperCase()}`;

  const nuovoCapo = {
    id: Date.now(),
    gestionale,
    codiceColoreCampione,
    varianti,
    pacchetto,
    marka,
    categoria,
    tm,
    base,
    descrizione,
    prezzo,
    prezzo2,
    taglia,
    tm2,
    fornitore,
    fornitore2,
    createdAt: new Date().toISOString()
  };

  capi.push(nuovoCapo);
  await writeJSON(capi, fileDir, 'capi.json');

  res.status(201).json(nuovoCapo);
};
