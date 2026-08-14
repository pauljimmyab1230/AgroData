import { Response, NextFunction } from 'express';
import * as capacitacionesService from '../services/capacitaciones.service';
import { AuthRequest } from '../middleware/auth.middleware';

// ─── Capacitaciones ──────────────────────────────────────────

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search as string | undefined;
    const tipo = req.query.tipo as string | undefined;
    const fechaInicio = req.query.fecha_inicio as string | undefined;
    const fechaFin = req.query.fecha_fin as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await capacitacionesService.getAll(search, tipo, fechaInicio, fechaFin, page, limit);
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
    const capacitacion = await capacitacionesService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: capacitacion,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const capacitacion = await capacitacionesService.create(req.body, req.user?.id);
    res.status(201).json({
      success: true,
      message: 'Capacitación registrada exitosamente',
      data: capacitacion,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const capacitacion = await capacitacionesService.update(req.params.id, req.body, req.user?.id);
    res.status(200).json({
      success: true,
      message: 'Capacitación actualizada exitosamente',
      data: capacitacion,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await capacitacionesService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Participantes ───────────────────────────────────────────

export const addParticipante = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const participante = await capacitacionesService.addParticipante(req.params.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Participante agregado exitosamente',
      data: participante,
    });
  } catch (error) {
    next(error);
  }
};

export const updateParticipante = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const participante = await capacitacionesService.updateParticipante(
      req.params.id,
      req.params.participanteId,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: 'Participante actualizado exitosamente',
      data: participante,
    });
  } catch (error) {
    next(error);
  }
};

export const removeParticipante = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await capacitacionesService.removeParticipante(req.params.id, req.params.participanteId);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
