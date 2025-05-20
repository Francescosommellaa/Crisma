import { Request, Response } from 'express';
import Capo from '../models/capo.model.js';
import File from '../models/file.model.js';
import { generateCodes } from '../utils/capo.util.js';

export const createCapo = async (req: Request, res: Response) => {
  const {
    categoria,
    base,
    descrizione,
    tm,
    prezzo,
    taglia,
    tm2,
    fornitoreTex,
    fornitore,
    prezzo2,
    codiceColoreCampione,
    varianti,
    pacchetto,
    fileId
  } = req.body;

  try {
    const parsedPrezzo = Number(prezzo);
    const parsedPrezzo2 = prezzo2 !== '' ? Number(prezzo2) : null;

    if (isNaN(parsedPrezzo)) {
      return res.status(400).json({ message: 'Prezzo non valido' });
    }

    const file = await File.findByPk(fileId);
    if (!file) return res.status(404).json({ message: 'File non trovato' });

    const codes = await generateCodes(
      fileId,
      categoria,
      file.brandAbbreviazione,
      file.brandAbbreviazione,
      file.stagione,
      file.anno
    );

    const capo = await Capo.create({
      categoria: categoria.toUpperCase(),
      base,
      descrizione,
      tm,
      prezzo: parsedPrezzo,
      prezzo2: parsedPrezzo2,
      taglia,
      tm2,
      fornitoreTex,
      fornitore,
      codiceColoreCampione,
      varianti,
      pacchetto,
      fileId,
      ...codes
    });

    res.status(201).json(capo);
  } catch (err) {
    console.error('Errore nella creazione del capo:', err);
    res.status(500).json({ message: 'Errore nella creazione del capo' });
  }
};

export const getCapiByFile = async (req: Request, res: Response) => {
  const { fileId } = req.query;

  if (!fileId) {
    return res.status(400).json({ message: 'fileId richiesto' });
  }

  try {
    const capi = await Capo.findAll({
      where: { fileId: Number(fileId) },
      order: [['id', 'ASC']],
    });
    res.json(capi);

  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero dei capi' });
  }
};
