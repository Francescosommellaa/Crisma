import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.get('/', (req, res) => {
  res.json({ message: 'API Crisma Online!' });
});

app.listen(PORT, () => {
  console.log(`🌐 Server in esecuzione su http://localhost:${PORT}`);
});