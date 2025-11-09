"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bodegasMock_1 = require("../data/bodegasMock");
const router = (0, express_1.Router)();
const ESTADOS_VALIDOS = ['DISPONIBLE', 'RESERVADA', 'OCUPADA', 'POR_VENCER'];
function isValidDate(value) {
    if (typeof value !== 'string') {
        return false;
    }
    const time = Date.parse(value);
    return !Number.isNaN(time);
}
function findBodegaIndex(id) {
    return bodegasMock_1.bodegasMock.findIndex((item) => item.id === id || item.codigo === id);
}
function sanitizeUpdates(payload) {
    if (!payload || typeof payload !== 'object') {
        return {};
    }
    const updates = payload;
    const sanitized = {};
    if ('nombre' in updates) {
        const nombre = updates.nombre;
        if (typeof nombre !== 'string' || !nombre.trim()) {
            throw new Error('El nombre debe ser un texto no vacío.');
        }
        sanitized.nombre = nombre.trim();
    }
    if ('metrosCuadrados' in updates) {
        const metrosCuadrados = updates.metrosCuadrados;
        if (typeof metrosCuadrados !== 'number' || Number.isNaN(metrosCuadrados) || metrosCuadrados <= 0) {
            throw new Error('Los metros cuadrados deben ser un número mayor a cero.');
        }
        sanitized.metrosCuadrados = metrosCuadrados;
    }
    if ('piso' in updates) {
        const piso = updates.piso;
        if (typeof piso !== 'number' || !Number.isInteger(piso)) {
            throw new Error('El piso debe ser un número entero.');
        }
        sanitized.piso = piso;
    }
    if ('estado' in updates) {
        const estado = updates.estado;
        if (typeof estado !== 'string' || !ESTADOS_VALIDOS.includes(estado)) {
            throw new Error('El estado proporcionado no es válido.');
        }
        sanitized.estado = estado;
    }
    if ('tarifaUf' in updates) {
        const tarifaUf = updates.tarifaUf;
        if (typeof tarifaUf !== 'number' || Number.isNaN(tarifaUf) || tarifaUf <= 0) {
            throw new Error('La tarifa en UF debe ser un número mayor a cero.');
        }
        sanitized.tarifaUf = Number(tarifaUf);
    }
    if ('fechaContratacion' in updates) {
        const fechaContratacion = updates.fechaContratacion;
        if (!isValidDate(fechaContratacion)) {
            throw new Error('La fecha de contratación no es válida.');
        }
        sanitized.fechaContratacion = fechaContratacion;
    }
    if ('fechaTermino' in updates) {
        const fechaTermino = updates.fechaTermino;
        if (!isValidDate(fechaTermino)) {
            throw new Error('La fecha de término no es válida.');
        }
        sanitized.fechaTermino = fechaTermino;
    }
    if ('observaciones' in updates) {
        const observaciones = updates.observaciones;
        if (typeof observaciones !== 'string') {
            throw new Error('Las observaciones deben ser texto.');
        }
        sanitized.observaciones = observaciones.trim();
    }
    return sanitized;
}
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
router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const index = findBodegaIndex(id);
    if (index === -1) {
        return res.status(404).json({ message: 'Bodega no encontrada' });
    }
    try {
        const updates = sanitizeUpdates(req.body);
        if (Object.keys(updates).length === 0) {
            return res.json(bodegasMock_1.bodegasMock[index]);
        }
        const updatedBodega = { ...bodegasMock_1.bodegasMock[index], ...updates };
        const fechaContratacion = Date.parse(updatedBodega.fechaContratacion);
        const fechaTermino = Date.parse(updatedBodega.fechaTermino);
        if (!Number.isNaN(fechaContratacion) && !Number.isNaN(fechaTermino)) {
            if (fechaTermino < fechaContratacion) {
                return res
                    .status(400)
                    .json({ message: 'La fecha de término no puede ser anterior a la fecha de contratación.' });
            }
        }
        bodegasMock_1.bodegasMock[index] = updatedBodega;
        return res.json(updatedBodega);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Datos de actualización inválidos';
        return res.status(400).json({ message });
    }
});
exports.default = router;
