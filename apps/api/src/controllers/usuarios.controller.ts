import type { Response, NextFunction } from 'express';
import * as usuariosService from '../services/usuarios.service';
import type { AuthRequest } from '../middleware/auth.middleware';
import type { CreateUsuarioInput, UpdateUsuarioInput, UpdateMeInput, ListUsuariosQuery } from '../types/usuarios.types';

// ─── List ───────────────────────────────────────────────────
export const getAll = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { search, rol, rol_sic, page, limit } = req.query as ListUsuariosQuery;
    const result = await usuariosService.getAll(
      search,
      rol,
      rol_sic,
      Number(page) || 1,
      Number(limit) || 20,
    );
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get By ID ──────────────────────────────────────────────
export const getById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const usuario = await usuariosService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: usuario,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Create ─────────────────────────────────────────────────
export const create = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input: CreateUsuarioInput = req.body;
    const usuario = await usuariosService.create(input);
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: usuario,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Update ─────────────────────────────────────────────────
export const update = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input: UpdateUsuarioInput = req.body;
    const actor = req.user as { id: string; rol: string };
    const usuario = await usuariosService.update(req.params.id, input, actor);
    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: usuario,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Remove ─────────────────────────────────────────────────
// Update del propio usuario autenticado: solo perfil, nunca rol/activo
export const updateMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input: UpdateMeInput = req.body;
    const usuario = await usuariosService.updateMe(req.user!.id, input);
    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: usuario,
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
    const result = await usuariosService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Basic ──────────────────────────────────────────────
export const getBasic = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const rol_sic = req.query.rol_sic as string | undefined;
    const data = await usuariosService.getBasic(rol_sic);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
