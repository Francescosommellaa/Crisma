import { Router } from 'express';
import { register, login, logout, deleteUser, resetPassword, verifyCode } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/verify', verifyCode);
router.post('/login', login);
router.post('/logout', logout);
router.post('/reset-password', resetPassword);
router.delete('/delete', deleteUser);

export default router;
