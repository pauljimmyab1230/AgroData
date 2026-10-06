import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import type { AuthRequest } from '../middleware/auth.middleware';
import type { ChangePasswordInput, RefreshInput } from '../types/auth.types';

// Login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Refresh token rotativo
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input: RefreshInput = req.body;
    const result = await authService.refresh(input);
    res.status(200).json({
      success: true,
      message: 'Token refrescado',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Logout: revoca el refresh token
export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ success: false, message: 'No autenticado' });
      return;
    }
    const refreshToken = req.body?.refreshToken as string | undefined;
    await authService.logout(req.user.id, refreshToken);
    res.status(200).json({
      success: true,
      message: 'Sesión cerrada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

// Cambio de contraseña (exige la actual)
export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ success: false, message: 'No autenticado' });
      return;
    }
    const input: ChangePasswordInput = req.body;
    await authService.changePassword(req.user.id, input);
    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada. Se han cerrado las demás sesiones.',
    });
  } catch (error) {
    next(error);
  }
};

// Get Profile
export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        success: false,
        message: 'Token de acceso no válido',
      });
      return;
    }

    const user = await authService.getProfile(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
