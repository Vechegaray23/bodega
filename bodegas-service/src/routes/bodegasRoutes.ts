import { Router } from 'express';

import { bodegasContractsMock } from '../data/bodegasContractsMock';
import { bodegasInfoMock } from '../data/bodegasInfoMock';
import {
  createEmptyContract,
  mergeBodegaData,
  type Bodega,
  type BodegaContract,
  type BodegaInfo,
  type EstadoBodega,
} from '../domain/bodegas';

const router = Router();

const ESTADOS_VALIDOS: EstadoBodega[] = ['DISPONIBLE', 'RESERVADA', 'OCUPADA', 'POR_VENCER'];
const RUT_REGEX = /^(\d{1,2})\.?(\d{3})\.?(\d{3})-([0-9kK])$/;
const PHONE_REGEX = /^\+?[0-9\s()-]{6,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type UpdatePayload = Partial<Omit<BodegaContract, 'bodegaId'>>;

function isValidDate(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }

  const time = Date.parse(value);
  return !Number.isNaN(time);
}

function findBodegaInfo(identifier: string): BodegaInfo | undefined {
  return bodegasInfoMock.find((item) => item.id === identifier || item.codigo === identifier);
}

function findContractIndex(bodegaId: string): number {
  return bodegasContractsMock.findIndex((item) => item.bodegaId === bodegaId);
}

function getContractForBodega(bodegaId: string): BodegaContract {
  const index = findContractIndex(bodegaId);

  if (index === -1) {
    return createEmptyContract(bodegaId);
  }

  return bodegasContractsMock[index];
}

function sanitizeUpdates(payload: unknown): UpdatePayload {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  const updates = payload as Record<string, unknown>;
  const sanitized: UpdatePayload = {};

  if ('contratanteNombre' in updates) {
    const contratanteNombre = updates.contratanteNombre;
    if (typeof contratanteNombre !== 'string') {
      throw new Error('El nombre del contratante debe ser un texto válido.');
    }
    sanitized.contratanteNombre = contratanteNombre.trim();
  }

  if ('contratanteRut' in updates) {
    const contratanteRut = updates.contratanteRut;
    if (typeof contratanteRut !== 'string') {
      throw new Error('El RUT del contratante no es válido.');
    }
    const trimmedRut = contratanteRut.trim();
    if (trimmedRut && !RUT_REGEX.test(trimmedRut)) {
      throw new Error('El RUT del contratante no es válido.');
    }
    sanitized.contratanteRut = trimmedRut;
  }

  if ('contratanteTelefono' in updates) {
    const contratanteTelefono = updates.contratanteTelefono;
    if (typeof contratanteTelefono !== 'string') {
      throw new Error('El teléfono del contratante no es válido.');
    }
    const trimmedTelefono = contratanteTelefono.trim();
    if (trimmedTelefono && !PHONE_REGEX.test(trimmedTelefono)) {
      throw new Error('El teléfono del contratante no es válido.');
    }
    sanitized.contratanteTelefono = trimmedTelefono;
  }

  if ('contratanteEmail' in updates) {
    const contratanteEmail = updates.contratanteEmail;
    if (typeof contratanteEmail !== 'string') {
      throw new Error('El correo electrónico del contratante no es válido.');
    }
    const trimmedEmail = contratanteEmail.trim();
    if (trimmedEmail && !EMAIL_REGEX.test(trimmedEmail)) {
      throw new Error('El correo electrónico del contratante no es válido.');
    }
    sanitized.contratanteEmail = trimmedEmail;
  }

  if ('estado' in updates) {
    const estado = updates.estado;
    if (typeof estado !== 'string' || !ESTADOS_VALIDOS.includes(estado as EstadoBodega)) {
      throw new Error('El estado proporcionado no es válido.');
    }
    sanitized.estado = estado as EstadoBodega;
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
    if (typeof fechaContratacion !== 'string') {
      throw new Error('La fecha de contratación no es válida.');
    }
    const trimmedFechaContratacion = fechaContratacion.trim();
    if (trimmedFechaContratacion && !isValidDate(trimmedFechaContratacion)) {
      throw new Error('La fecha de contratación no es válida.');
    }
    sanitized.fechaContratacion = trimmedFechaContratacion;
  }

  if ('fechaTermino' in updates) {
    const fechaTermino = updates.fechaTermino;
    if (typeof fechaTermino !== 'string') {
      throw new Error('La fecha de término no es válida.');
    }
    const trimmedFechaTermino = fechaTermino.trim();
    if (trimmedFechaTermino && !isValidDate(trimmedFechaTermino)) {
      throw new Error('La fecha de término no es válida.');
    }
    sanitized.fechaTermino = trimmedFechaTermino;
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

function buildBodegaResponse(info: BodegaInfo): Bodega {
  const contract = getContractForBodega(info.id);
  return mergeBodegaData(info, contract);
}

router.get('/', (_req, res) => {
  const bodegas = bodegasInfoMock.map(buildBodegaResponse);
  res.json(bodegas);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const info = findBodegaInfo(id);

  if (!info) {
    return res.status(404).json({ message: 'Bodega no encontrada' });
  }

  const bodega = buildBodegaResponse(info);
  return res.json(bodega);
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const info = findBodegaInfo(id);

  if (!info) {
    return res.status(404).json({ message: 'Bodega no encontrada' });
  }

  try {
    const updates = sanitizeUpdates(req.body);
    const contractIndex = findContractIndex(info.id);
    const currentContract =
      contractIndex === -1 ? createEmptyContract(info.id) : bodegasContractsMock[contractIndex];

    if (Object.keys(updates).length === 0) {
      return res.json(mergeBodegaData(info, currentContract));
    }

    const updatedContract: BodegaContract = {
      ...currentContract,
      ...updates,
    };

    const fechaContratacionTime = updatedContract.fechaContratacion
      ? Date.parse(updatedContract.fechaContratacion)
      : Number.NaN;
    const fechaTerminoTime = updatedContract.fechaTermino
      ? Date.parse(updatedContract.fechaTermino)
      : Number.NaN;

    if (!Number.isNaN(fechaContratacionTime) && !Number.isNaN(fechaTerminoTime)) {
      if (fechaTerminoTime < fechaContratacionTime) {
        return res
          .status(400)
          .json({ message: 'La fecha de término no puede ser anterior a la fecha de contratación.' });
      }
    }

    if (contractIndex === -1) {
      bodegasContractsMock.push(updatedContract);
    } else {
      bodegasContractsMock[contractIndex] = updatedContract;
    }

    const response: Bodega = mergeBodegaData(info, updatedContract);
    return res.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Datos de actualización inválidos';
    return res.status(400).json({ message });
  }
});

export default router;
