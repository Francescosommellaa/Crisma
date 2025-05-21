import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Rotte
import brandRoutes from './routes/brand.routes.js';
import fileRoutes from './routes/file.routes.js';
import capoRoutes from './routes/capo.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.use(express.json());
app.use('/api/brands', brandRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/capi', capoRoutes);

app.listen(PORT, () => {
  console.log(`🌐 Server in esecuzione su http://localhost:${PORT}`);
});