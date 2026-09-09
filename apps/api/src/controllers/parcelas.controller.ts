import { Response, NextFunction } from 'express';
import * as parcelasService from '../services/parcelas.service';
import { AuthRequest } from '../middleware/auth.middleware';

function parseIdParam(value: string): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0 || !Number.isInteger(n)) {
    throw Object.assign(new Error('ID inválido'), { statusCode: 400 });
  }
  return n;
}

function parsePageParam(value: string | undefined): number {
  const n = parseInt(value ?? '', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function parseLimitParam(value: string | undefined): number {
  const n = parseInt(value ?? '', 10);
  return Number.isFinite(n) && n > 0 && n <= 100 ? n : 20;
}

export const getStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await parcelasService.getStats({
      search: req.query.search as string | undefined,
      comunidad: req.query.comunidad as string | undefined,
      cultivo: req.query.cultivo as string | undefined,
      estado: req.query.estado as string | undefined,
      productores_id: req.query.productor_id as string | undefined,
    });
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await parcelasService.getAll({
      search: req.query.search as string | undefined,
      comunidad: req.query.comunidad as string | undefined,
      cultivo: req.query.cultivo as string | undefined,
      estado: req.query.estado as string | undefined,
      productores_id: req.query.productor_id as string | undefined,
      page: parsePageParam(req.query.page as string),
      limit: parseLimitParam(req.query.limit as string),
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) { next(error); }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseIdParam(req.params.id);
    const parcela = await parcelasService.getById(id);
    res.status(200).json({ success: true, data: parcela });
  } catch (error) { next(error); }
};

export const getHistorial = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseIdParam(req.params.id);
    const historial = await parcelasService.getHistorial(id);
    res.status(200).json({ success: true, data: historial });
  } catch (error) { next(error); }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parcela = await parcelasService.create(req.body, req.user?.id);
    res.status(201).json({ success: true, message: 'Parcela registrada exitosamente', data: parcela });
  } catch (error) { next(error); }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseIdParam(req.params.id);
    const parcela = await parcelasService.update(id, req.body, req.user?.id);
    res.status(200).json({ success: true, message: 'Parcela actualizada exitosamente', data: parcela });
  } catch (error) { next(error); }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseIdParam(req.params.id);
    const result = await parcelasService.remove(id);
    res.status(200).json({ success: true, ...result });
  } catch (error) { next(error); }
};

// --- Documentos ---

export const getDocumentos = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseIdParam(req.params.id);
    const documentos = await parcelasService.getDocumentos(id);
    res.status(200).json({ success: true, data: documentos, total: documentos.length });
  } catch (error) { next(error); }
};

export const createDocumento = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseIdParam(req.params.id);
    const documento = await parcelasService.createDocumento(id, req.body);
    res.status(201).json({ success: true, message: 'Documento registrado exitosamente', data: documento });
  } catch (error) { next(error); }
};

export const updateDocumento = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseIdParam(req.params.id);
    const documentoId = parseIdParam(req.params.documentoId);
    const documento = await parcelasService.updateDocumento(id, documentoId, req.body);
    res.status(200).json({ success: true, message: 'Documento actualizado exitosamente', data: documento });
  } catch (error) { next(error); }
};

export const removeDocumento = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseIdParam(req.params.id);
    const documentoId = parseIdParam(req.params.documentoId);
    const result = await parcelasService.removeDocumento(id, documentoId);
    res.status(200).json({ success: true, ...result });
  } catch (error) { next(error); }
};

// --- Fotos ---

export const getFotos = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseIdParam(req.params.id);
    const fotos = await parcelasService.getFotos(id);
    res.status(200).json({ success: true, data: fotos, total: fotos.length });
  } catch (error) { next(error); }
};

export const createFoto = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseIdParam(req.params.id);
    const foto = await parcelasService.createFoto(id, req.body);
    res.status(201).json({ success: true, message: 'Fotografía registrada exitosamente', data: foto });
  } catch (error) { next(error); }
};

export const updateFoto = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseIdParam(req.params.id);
    const fotoId = parseIdParam(req.params.fotoId);
    const foto = await parcelasService.updateFoto(id, fotoId, req.body);
    res.status(200).json({ success: true, message: 'Fotografía actualizada exitosamente', data: foto });
  } catch (error) { next(error); }
};

export const removeFoto = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseIdParam(req.params.id);
    const fotoId = parseIdParam(req.params.fotoId);
    const result = await parcelasService.removeFoto(id, fotoId);
    res.status(200).json({ success: true, ...result });
  } catch (error) { next(error); }
};
