import express from 'express';
import cors from 'cors';

import bodegasRoutes from './routes/bodegasRoutes';

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/bodegas', bodegasRoutes);

app.listen(port, () => {
  console.log(`Bodegas service listening on port ${port}`);
});
