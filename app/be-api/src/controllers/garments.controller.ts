import { Request, Response } from 'express';
import { readJSON, writeJSON } from '../services/fsService.js';
import { getColorName, saveColorIfMissing} from '../services/colorService.js';
import { generateCSV } from '../utils/csvExporter.js';
import {
  normalizeTM,
  generateCodes,
  getGarmentsPath,
  getMetadataPath,
  buildGarment
} from '../utils/garmentUtils.js';

export const getGarments = async (req: Request, res: Response) => {
  const { abbrev, fileId } = req.params;
  try {
    const garments = (await readJSON(...getGarmentsPath(abbrev, fileId))) || [];
    res.json(garments);
  } catch (err) {
    console.error('Errore lettura capi:', err);
    res.status(500).json({ message: 'Errore lettura capi' });
  }
};

export const addGarment = async (req: Request, res: Response) => {
  const { abbrev, fileId } = req.params;
  const body = req.body;

  if (!body.categoria || !body.base || !body.descrizione || !body.tm || !body.codiceColoreCampione) {
    return res.status(400).json({ message: 'Campi obbligatori mancanti' });
  }

  try {
    const garmentsPath = getGarmentsPath(abbrev, fileId);
    const metadata = await readJSON(...getMetadataPath(abbrev, fileId));
    const garments = (await readJSON(...garmentsPath)) || [];

    const nextId = Math.max(1000, ...garments.map((g: any) => g.idGarment || 999)) + 1;

    const { gestionale, marka } = generateCodes(
      abbrev.toUpperCase(),
      metadata.anno,
      metadata.stagione,
      nextId,
      body.categoria
    );

    const codice = body.codiceColoreCampione;
    const colore = await getColorName(codice);
    if (!colore && !body.coloreCampione) {
      return res.status(400).json({ message: `Codice colore "${codice}" non trovato. Specificare nome colore.` });
    }
    if (!colore && body.coloreCampione) {
      await saveColorIfMissing(codice, body.coloreCampione);
    }

    const garment = buildGarment(
      nextId,
      abbrev.toUpperCase(),
      metadata.anno,
      metadata.stagione,
      body,
      colore || body.coloreCampione
    );

    garments.push(garment);
    await writeJSON(garments, ...garmentsPath);
    res.status(201).json(garment);
  } catch (err) {
    console.error('Errore creazione capo:', err);
    res.status(500).json({ message: 'Errore creazione capo' });
  }
};

export const updateGarment = async (req: Request, res: Response) => {
  const { abbrev, fileId, id } = req.params;
  const garmentId = parseInt(id);
  const body = req.body;

  try {
    const garmentsPath = getGarmentsPath(abbrev, fileId);
    const metadata = await readJSON(...getMetadataPath(abbrev, fileId));
    const garments = (await readJSON(...garmentsPath)) || [];

    const index = garments.findIndex((g: any) => g.idGarment === garmentId);
    if (index === -1) return res.status(404).json({ message: 'Garment non trovato' });

    const codice = body.codiceColoreCampione;
    const colore = await getColorName(codice);
    if (!colore && body.coloreCampione) {
      await saveColorIfMissing(codice, body.coloreCampione);
    }

    const updated = {
      ...garments[index],
      ...body,
      categoria: body.categoria?.toUpperCase() || garments[index].categoria,
      tm: normalizeTM(body.tm),
      tm2: normalizeTM(body.tm2),
      prezzo: parseFloat(body.prezzo) || null,
      prezzoTex: parseFloat(body.prezzoTex) || null,
      taglia: body.taglia || 'S',
      codiceColoreCampione: codice,
      coloreCampione: colore || body.coloreCampione,
    };

    const { gestionale, marka } = generateCodes(
      abbrev.toUpperCase(),
      metadata.anno,
      metadata.stagione,
      garmentId,
      updated.categoria
    );

    updated.gestionale = gestionale;
    updated.marka = marka;

    garments[index] = updated;
    await writeJSON(garments, ...garmentsPath);
    res.json(updated);
  } catch (err) {
    console.error('Errore modifica capo:', err);
    res.status(500).json({ message: 'Errore modifica capo' });
  }
};

export const deleteGarment = async (req: Request, res: Response) => {
  const { abbrev, fileId, id } = req.params;
  const garmentId = parseInt(id);

  try {
    const garmentsPath = getGarmentsPath(abbrev, fileId);
    const garments = (await readJSON(...garmentsPath)) || [];
    const updated = garments.filter((g: any) => g.idGarment !== garmentId);
    await writeJSON(updated, ...garmentsPath);
    res.json({ message: 'Garment eliminato' });
  } catch (err) {
    console.error('Errore eliminazione capo:', err);
    res.status(500).json({ message: 'Errore eliminazione capo' });
  }
};

export const exportGarmentsCSV = async (req: Request, res: Response) => {
  const { abbrev, fileId } = req.params;
  try {
    const garments = (await readJSON(...getGarmentsPath(abbrev, fileId))) || [];
    const csv = generateCSV(garments);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=garments-${fileId}.csv`);
    res.send(csv);
  } catch (err) {
    console.error('Errore esportazione CSV:', err);
    res.status(500).json({ message: 'Errore esportazione CSV' });
  }
};
