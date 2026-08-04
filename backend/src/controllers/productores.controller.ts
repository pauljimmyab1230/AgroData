import { Response, NextFunction } from 'express';
import * as productoresService from '../services/productores.service';
import { AuthRequest } from '../middleware/auth.middleware';

// ─── Productores ────────────────────────────────────────────

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search as string | undefined;
    const estado = req.query.estado as string | undefined;
    const productores = await productoresService.getAll(search, estado);
    res.status(200).json({
      success: true,
      data: productores,
      total: productores.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const productor = await productoresService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: productor,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const productor = await productoresService.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Productor registrado exitosamente',
      data: productor,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const productor = await productoresService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Productor actualizado exitosamente',
      data: productor,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await productoresService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Familiares ─────────────────────────────────────────────

export const getFamiliares = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const familiares = await productoresService.getFamiliares(req.params.id);
    res.status(200).json({
      success: true,
      data: familiares,
      total: familiares.length,
    });
  } catch (error) {
    next(error);
  }
};

export const createFamiliar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const familiar = await productoresService.createFamiliar(req.params.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Familiar registrado exitosamente',
      data: familiar,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFamiliar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const familiar = await productoresService.updateFamiliar(req.params.id, req.familiarId!, req.body);
    res.status(200).json({
      success: true,
      message: 'Familiar actualizado exitosamente',
      data: familiar,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFamiliar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await productoresService.removeFamiliar(req.params.id, req.familiarId!);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Parcelas ───────────────────────────────────────────────

export const getParcelas = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parcelas = await productoresService.getParcelas(req.params.id);
    res.status(200).json({
      success: true,
      data: parcelas,
      total: parcelas.length,
    });
  } catch (error) {
    next(error);
  }
};

export const createParcela = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parcela = await productoresService.createParcela(req.params.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Parcela registrada exitosamente',
      data: parcela,
    });
  } catch (error) {
    next(error);
  }
};

export const updateParcela = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parcela = await productoresService.updateParcela(req.params.id, req.parcelaId!, req.body);
    res.status(200).json({
      success: true,
      message: 'Parcela actualizada exitosamente',
      data: parcela,
    });
  } catch (error) {
    next(error);
  }
};

export const removeParcela = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await productoresService.removeParcela(req.params.id, req.parcelaId!);
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
    const documentos = await productoresService.getDocumentos(req.params.id);
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
    const documento = await productoresService.createDocumento(req.params.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Documento registrado exitosamente',
      data: documento,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDocumentoEstado = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const documento = await productoresService.updateDocumentoEstado(
      req.params.id,
      req.params.documentoId,
      req.body.estado,
    );
    res.status(200).json({
      success: true,
      message: 'Estado del documento actualizado',
      data: documento,
    });
  } catch (error) {
    next(error);
  }
};

export const removeDocumento = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await productoresService.removeDocumento(req.params.id, req.params.documentoId);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
