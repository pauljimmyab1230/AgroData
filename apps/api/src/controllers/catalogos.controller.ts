import type { Request, Response, NextFunction } from 'express';
import * as catalogosService from '../services/catalogos.service';
import type { AuthRequest } from '../middleware/auth.middleware';

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { tipo } = req.params;
    const result = await catalogosService.getAll(tipo, {
      search: req.query.search as string,
      activo: req.query.activo !== undefined ? req.query.activo === 'true' : undefined,
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });
    res.json({ success: true, data: result.data, total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages });
  } catch (error) {
    next(error);
  }
};

export const getActivos = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { tipo } = req.params;
    const data = await catalogosService.getActivos(tipo);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const data = await catalogosService.getById(id);
    res.json({ success: true, data });
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
    const { tipo } = req.params;
    const data = await catalogosService.create(tipo, req.body, req.user?.id);
    res.status(201).json({ success: true, data });
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
    const id = Number(req.params.id);
    const data = await catalogosService.update(id, req.body, req.user?.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const result = await catalogosService.remove(id);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const toggleActivo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const data = await catalogosService.toggleActivo(id, req.user?.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
