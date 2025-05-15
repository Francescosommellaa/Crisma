import { Router } from 'express';
import User from '../models/user.model';

const router = Router();

router.post('/create', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Errore nella creazione dell\'utente' });
  }
});

export default router;
