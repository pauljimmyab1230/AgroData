import { Response, NextFunction } from 'express';
import * as usuariosService from '../services/usuarios.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAll = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const usuarios = await usuariosService.getAll();
    res.status(200).json({
      success: true,
      data: usuarios,
      total: usuarios.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const usuario = await usuariosService.getById(req.params.id as string);
    res.status(200).json({
      success: true,
      data: usuario,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const usuario = await usuariosService.update(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: usuario,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await usuariosService.remove(req.params.id as string);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
