import express from 'express';
import cors from 'cors';

// Rotte
import configRoutes from './routes/config.routes.js';
import brandRoutes from './routes/brand.routes.js';
import fileRoutes from './routes/file.routes.js';
import capoRoutes from './routes/garments.routes.js';

const app = express();

app.use(cors());

app.use(express.json());
app.use('/api/config', configRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/garments', capoRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🌐 Server in esecuzione su http://localhost:${PORT}`);
});