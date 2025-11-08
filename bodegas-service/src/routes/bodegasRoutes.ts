import { Router } from 'express';

import { bodegasMock } from '../data/bodegasMock';

const router = Router();

router.get('/', (_req, res) => {
  res.json(bodegasMock);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const bodega = bodegasMock.find((item) => item.id === id);

  if (!bodega) {
    return res.status(404).json({ message: 'Bodega no encontrada' });
  }

  return res.json(bodega);
});

export default router;
