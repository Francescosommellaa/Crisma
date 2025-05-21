import { Request, Response } from 'express';
import { readJSON, writeJSON } from '../services/fsService.js';
import path from 'path';
import { generateCodes } from '../utils/capo.util.js';

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

  // ✅ Genera i codici dinamicamente
  const { gestionale, marka, brand, abbreviazione } = await generateCodes(
    fileId,
    categoria,
    metadata.nome || metadata.abbreviazione,
    metadata.abbreviazione,
    metadata.stagione,
    metadata.anno
  );

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
