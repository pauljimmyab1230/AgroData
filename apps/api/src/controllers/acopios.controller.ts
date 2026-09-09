import type { Response, NextFunction } from 'express';
import * as acopiosService from '../services/acopios.service';
import type { AuthRequest } from '../middleware/auth.middleware';

export const getAll = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await acopiosService.getAll({
      search: req.query.search as string | undefined,
      estado: req.query.estado as string | undefined,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    });
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
    const acopio = await acopiosService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: acopio,
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

export const update = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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

export const remove = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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

export const getStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const stats = await acopiosService.getStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const getByCodigo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const acopio = await acopiosService.getByCodigo(req.params.codigo);
    res.status(200).json({
      success: true,
      data: acopio,
    });
  } catch (error) {
    next(error);
  }
};
