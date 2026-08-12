import { Response, NextFunction } from 'express';
import * as parcelasService from '../services/parcelas.service';
import { AuthRequest } from '../middleware/auth.middleware';

// ─── Parcelas ───────────────────────────────────────────────

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await parcelasService.getAll({
      search: req.query.search as string | undefined,
      comunidad: req.query.comunidad as string | undefined,
      cultivo: req.query.cultivo as string | undefined,
      estado: req.query.estado as string | undefined,
      productor_id: req.query.productor_id as string | undefined,
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
    const parcela = await parcelasService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: parcela,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parcela = await parcelasService.create(req.body, req.user?.id);
    res.status(201).json({
      success: true,
      message: 'Parcela registrada exitosamente',
      data: parcela,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parcela = await parcelasService.update(req.params.id, req.body, req.user?.id);
    res.status(200).json({
      success: true,
      message: 'Parcela actualizada exitosamente',
      data: parcela,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await parcelasService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Documentos ─────────────────────────────────────────────

export const getDocumentos = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const documentos = await parcelasService.getDocumentos(req.params.id);
    res.status(200).json({
      success: true,
      data: documentos,
      total: documentos.length,
    });
  } catch (error) {
    next(error);
  }
};

export const createDocumento = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const documento = await parcelasService.createDocumento(req.params.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Documento registrado exitosamente',
      data: documento,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDocumento = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const documento = await parcelasService.updateDocumento(req.params.id, req.params.documentoId, req.body);
    res.status(200).json({
      success: true,
      message: 'Documento actualizado exitosamente',
      data: documento,
    });
  } catch (error) {
    next(error);
  }
};

export const removeDocumento = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await parcelasService.removeDocumento(req.params.id, req.params.documentoId);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Fotos ──────────────────────────────────────────────────

export const getFotos = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fotos = await parcelasService.getFotos(req.params.id);
    res.status(200).json({
      success: true,
      data: fotos,
      total: fotos.length,
    });
  } catch (error) {
    next(error);
  }
};

export const createFoto = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const foto = await parcelasService.createFoto(req.params.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Fotografía registrada exitosamente',
      data: foto,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFoto = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const foto = await parcelasService.updateFoto(req.params.id, req.params.fotoId, req.body);
    res.status(200).json({
      success: true,
      message: 'Fotografía actualizada exitosamente',
      data: foto,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFoto = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await parcelasService.removeFoto(req.params.id, req.params.fotoId);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
