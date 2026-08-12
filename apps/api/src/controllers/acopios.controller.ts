import { Response, NextFunction } from 'express';
import * as acopiosService from '../services/acopios.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await acopiosService.getAll({
      search: req.query.search as string | undefined,
      estado: req.query.estado as string | undefined,
      campania_id: req.query.campania_id as string | undefined,
      productor_id: req.query.productor_id as string | undefined,
      comunidad: req.query.comunidad as string | undefined,
      acopiador: req.query.acopiador as string | undefined,
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
    const acopio = await acopiosService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: acopio,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const acopio = await acopiosService.create(req.body, req.user?.id);
    res.status(201).json({
      success: true,
      message: 'Acopio registrado exitosamente',
      data: acopio,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const acopio = await acopiosService.update(req.params.id, req.body, req.user?.id);
    res.status(200).json({
      success: true,
      message: 'Acopio actualizado exitosamente',
      data: acopio,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await acopiosService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await acopiosService.getStats(req.query.campania_id as string | undefined);
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
