"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bodegasMock_1 = require("../data/bodegasMock");
const router = (0, express_1.Router)();
router.get('/', (_req, res) => {
    res.json(bodegasMock_1.bodegasMock);
});
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const bodega = bodegasMock_1.bodegasMock.find((item) => item.id === id);
    if (!bodega) {
        return res.status(404).json({ message: 'Bodega no encontrada' });
    }
    return res.json(bodega);
});
exports.default = router;
