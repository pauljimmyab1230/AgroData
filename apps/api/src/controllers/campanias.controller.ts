import type { Response, NextFunction } from 'express';
import * as campaniasService from '../services/campanias.service';
import type { AuthRequest } from '../middleware/auth.middleware';

export const getAll = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await campaniasService.getAll({
      search: req.query.search as string | undefined,
      estado: req.query.estado as string | undefined,
      anio_agricola: req.query.anio_agricola as string | undefined,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    });
    res.status(200).json({
      success: true,
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
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
    const campania = await campaniasService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: campania,
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
    const campania = await campaniasService.create(req.body, req.user?.id);
    res.status(201).json({
      success: true,
      message: 'Campaña registrada exitosamente',
      data: campania,
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
    const campania = await campaniasService.update(req.params.id, req.body, req.user?.id);
    res.status(200).json({
      success: true,
      message: 'Campaña actualizada exitosamente',
      data: campania,
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
    const result = await campaniasService.remove(req.params.id);
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
    const stats = await campaniasService.getStats(req.params.id);
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const getGlobalStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const stats = await campaniasService.getGlobalStats({
      search: req.query.search as string | undefined,
      estado: req.query.estado as string | undefined,
      anio_agricola: req.query.anio_agricola as string | undefined,
    });
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const getTimeline = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const timeline = await campaniasService.getTimeline(req.params.id);
    res.status(200).json({
      success: true,
      data: timeline,
    });
  } catch (error) {
    next(error);
  }
};
