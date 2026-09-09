import type { Response, NextFunction } from 'express';
import * as procesamientoService from '../services/procesamiento.service';
import type { AuthRequest } from '../middleware/auth.middleware';
import type { ProcesamientoFilters } from '../types/procesamiento.types';

export const getAll = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const filters: ProcesamientoFilters = {
      search: req.query.search as string | undefined,
      estado: req.query.estado as ProcesamientoFilters['estado'],
      tipo_proceso: req.query.tipo_proceso as ProcesamientoFilters['tipo_proceso'],
      linea_procesamiento: req.query.linea_procesamiento as ProcesamientoFilters['linea_procesamiento'],
      recepcion_id: req.query.recepcion_id ? Number(req.query.recepcion_id) : undefined,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
    };

    const result = await procesamientoService.getAll(filters);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const procesamiento = await procesamientoService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: procesamiento,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const procesamiento = await procesamientoService.create(req.body, req.user?.id);
    res.status(201).json({
      success: true,
      message: 'Procesamiento registrado exitosamente',
      data: procesamiento,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const procesamiento = await procesamientoService.update(req.params.id, req.body, req.user?.id);
    res.status(200).json({
      success: true,
      message: 'Procesamiento actualizado exitosamente',
      data: procesamiento,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await procesamientoService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
