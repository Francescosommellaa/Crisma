import { Router } from 'express';
const router = Router();
router.get('/test', (req, res) => {
    res.json({ message: 'Route di Test Funzionante!' });
});
export default router;
