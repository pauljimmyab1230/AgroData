import { Response, NextFunction } from 'express';
import * as recepcionService from '../services/recepcion.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await recepcionService.getAll({
      search: req.query.search as string | undefined,
      estado: req.query.estado as string | undefined,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
    });
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const recepcion = await recepcionService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: recepcion,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const recepcion = await recepcionService.create(req.body, req.user?.id);
    res.status(201).json({
      success: true,
      message: 'Recepción registrada exitosamente',
      data: recepcion,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const recepcion = await recepcionService.update(req.params.id, req.body, req.user?.id);
    res.status(200).json({
      success: true,
      message: 'Recepción actualizada exitosamente',
      data: recepcion,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await recepcionService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const addEvidencia = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const evidencia = await recepcionService.addEvidencia(req.params.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Evidencia agregada exitosamente',
      data: evidencia,
    });
  } catch (error) {
    next(error);
  }
};

export const removeEvidencia = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await recepcionService.removeEvidencia(req.params.id, req.params.evidenciaId);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
