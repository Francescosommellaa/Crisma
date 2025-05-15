import { Request, Response } from 'express';
import Brand from '../models/brand.model.js';

// Crea un nuovo brand
export const createBrand = async (req: Request, res: Response) => {
  const { nome, abbreviazione } = req.body;

  try {
    const brand = await Brand.create({ nome, abbreviazione });
    res.status(201).json({ message: 'Brand creato con successo', brand });
  } catch (error) {
    console.error('Errore durante la creazione del brand:', error);
    res.status(500).json({ message: 'Errore durante la creazione del brand' });
  }
};

// Ottieni tutti i brand
export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await Brand.findAll();
    res.json(brands);
  } catch (error) {
    console.error('Errore durante il recupero dei brand:', error);
    res.status(500).json({ message: 'Errore durante il recupero dei brand' });
  }
};

// Modifica un brand esistente
export const updateBrand = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, abbreviazione } = req.body;

  try {
    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand non trovato' });
    }

    brand.nome = nome;
    brand.abbreviazione = abbreviazione;
    await brand.save();

    res.json({ message: 'Brand aggiornato con successo', brand });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del brand:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento del brand' });
  }
};

// Elimina un brand
export const deleteBrand = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await Brand.destroy({ where: { id } });
    if (result) {
      res.json({ message: 'Brand eliminato con successo' });
    } else {
      res.status(404).json({ message: 'Brand non trovato' });
    }
  } catch (error) {
    console.error('Errore durante l\'eliminazione del brand:', error);
    res.status(500).json({ message: 'Errore durante l\'eliminazione del brand' });
  }
};
