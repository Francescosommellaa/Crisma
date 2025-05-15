import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import { generateToken } from '../utils/token.util.js';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Verifica se l'email è già registrata
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email già in uso' });
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creazione dell'utente
    const user = await User.create({ email, password: hashedPassword, role: 'user' });
    const token = generateToken(user.id);

    res.status(201).json({ message: 'Registrazione riuscita', token });
  } catch (error: any) {
    console.error('Errore durante la registrazione:', error.message);
    res.status(500).json({ message: 'Errore durante la registrazione' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    const token = generateToken(user.id);
    res.json({ message: 'Login riuscito', token });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il login' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.json({ message: 'Logout riuscito' });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    await User.destroy({ where: { email } });
    res.json({ message: 'Account eliminato' });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante l\'eliminazione' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'Utente non trovato' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      res.json({ message: 'Password aggiornata con successo' });
    } catch (error) {
      res.status(500).json({ message: 'Errore durante il reset della password' });
    }
  };
