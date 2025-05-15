import Brand from '../models/brand.model.js';
export const createBrand = async (req, res) => {
    const { name, abbreviation } = req.body;
    if (!name || !abbreviation) {
        return res.status(400).json({ message: 'Nome e abbreviazione sono obbligatori' });
    }
    try {
        const brand = await Brand.create({ name, abbreviation });
        res.status(201).json({ message: 'Brand creato con successo', brand });
    }
    catch (error) {
        res.status(500).json({ message: 'Errore durante la creazione del brand', error });
    }
};
export const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.findAll();
        res.json({ brands });
    }
    catch (error) {
        res.status(500).json({ message: 'Errore durante il recupero dei brand', error });
    }
};
export const updateBrand = async (req, res) => {
    const { id } = req.params;
    const { name, abbreviation } = req.body;
    try {
        const brand = await Brand.findByPk(id);
        if (!brand)
            return res.status(404).json({ message: 'Brand non trovato' });
        brand.name = name;
        brand.abbreviation = abbreviation;
        await brand.save();
        res.json({ message: 'Brand aggiornato con successo', brand });
    }
    catch (error) {
        res.status(500).json({ message: 'Errore durante l\'aggiornamento del brand', error });
    }
};
export const deleteBrand = async (req, res) => {
    const { id } = req.params;
    try {
        const brand = await Brand.findByPk(id);
        if (!brand)
            return res.status(404).json({ message: 'Brand non trovato' });
        await brand.destroy();
        res.json({ message: 'Brand eliminato con successo' });
    }
    catch (error) {
        res.status(500).json({ message: 'Errore durante l\'eliminazione del brand', error });
    }
};
