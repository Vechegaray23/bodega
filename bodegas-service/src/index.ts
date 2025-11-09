import express from 'express';
import cors from 'cors';
import path from 'path';


import bodegasRoutes from './routes/bodegasRoutes';

const app = express();
const port = Number(process.env.PORT) || 4000;

// Ruta absoluta a la carpeta "public" (donde está el build de React)
const publicPath = path.join(__dirname, '../public');


app.use(cors());
app.use(express.json());

// Servir archivos estáticos del front (build de React)
app.use(express.static(publicPath));


app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/bodegas', bodegasRoutes);
// Fallback para frontend (SPA): cualquier otra ruta devuelve index.html
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});



app.listen(port, () => {
  console.log(`Bodegas service listening on port ${port}`);
});
