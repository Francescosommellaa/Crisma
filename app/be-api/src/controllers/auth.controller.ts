import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import { generateToken } from '../utils/token.util.js';
import { sendVerificationCode } from '../utils/email.util.js';

const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      if (!existingUser.isVerified) {
        return res.status(403).json({ message: 'Utente non verificato', redirectTo: 'verify' });
      }
      return res.status(400).json({ message: 'Email già in uso' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password non valida' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();

    await User.create({
      email,
      password: hashedPassword,
      verificationCode,
      isVerified: false,
    });

    await sendVerificationCode(email, verificationCode);
    res.status(201).json({ message: 'Utente creato. Codice di verifica inviato.' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nella registrazione' });
  }
};

export const verifyCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ where: { email, verificationCode: code } });

    if (!user) {
      return res.status(400).json({ message: 'Codice non valido o utente inesistente' });
    }

    // Codice valido: aggiorna l'utente
    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    const token = generateToken(user.id);
    res.json({ message: 'Verifica completata', token });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la verifica del codice' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    // Controllo se l'utente esiste
    if (!user) {
      return res.status(401).json({ message: 'Utente non trovato' });
    }

    // Controllo se l'utente è verificato
    if (!user.isVerified) {
      return res.status(403).json({ 
        message: 'Email non verificata', 
        redirectTo: 'verify', 
        email: user.email 
      });
    }

    // Controllo della password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Password non corretta' });
    }

    // Generazione del token JWT
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
    res.json({ message: 'Account eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante l\'eliminazione dell\'account' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: 'Password non valida' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password aggiornata con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il reset della password' });
  }
};
