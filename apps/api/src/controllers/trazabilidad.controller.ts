import { Response, NextFunction } from 'express';
import * as trazabilidadService from '../services/trazabilidad.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await trazabilidadService.getAll({
      search: req.query.search as string | undefined,
      estado: req.query.estado as string | undefined,
      cultivo: req.query.cultivo as string | undefined,
      lote_id: req.query.lote_id as string | undefined,
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
    const item = await trazabilidadService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const item = await trazabilidadService.create(req.body, req.user?.id);
    res.status(201).json({
      success: true,
      message: 'Registro de trazabilidad creado exitosamente',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const item = await trazabilidadService.update(req.params.id, req.body, req.user?.id);
    res.status(200).json({
      success: true,
      message: 'Registro de trazabilidad actualizado exitosamente',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await trazabilidadService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const addEvento = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const evento = await trazabilidadService.addEvento(req.params.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Evento registrado exitosamente',
      data: evento,
    });
  } catch (error) {
    next(error);
  }
};

export const removeEvento = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await trazabilidadService.removeEvento(req.params.id, req.params.eventoId);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
