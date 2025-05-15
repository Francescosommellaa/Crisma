import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import brandRoutes from './routes/brand.routes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/brands', brandRoutes);
sequelize.sync({ force: true })
    .then(() => console.log('✅ Modelli sincronizzati con il database'))
    .catch((err) => console.error('❌ Errore durante la sincronizzazione:', err));
app.listen(PORT, () => {
    console.log(`🌐 Server in esecuzione su http://localhost:${PORT}`);
});
