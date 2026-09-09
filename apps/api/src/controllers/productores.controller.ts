import type { Response, NextFunction } from 'express';
import * as productoresService from '../services/productores.service';
import type {
  CreateProductorInput,
  UpdateProductorInput,
  CreateFamiliarInput,
  UpdateFamiliarInput,
  CreateDocumentoInput,
  DocumentoEstado,
  EstadoProductor,
  Sexo,
  CargoProductor,
  NivelEducativo,
} from '../services/productores.service';
import { toProductorId, toFamiliarId, toDocumentoId } from '../services/productores.service';
import type { AuthRequest } from '../middleware/auth.middleware';

// ─── Stats ────────────────────────────────────────────────

export const getStats = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const stats = await productoresService.getStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

// ─── Productores ────────────────────────────────────────────

export const getComunidades = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const comunidades = await productoresService.getComunidades();
    res.status(200).json({ success: true, data: comunidades });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const estado = req.query.estado as EstadoProductor | undefined;
    const cargo = req.query.cargo as CargoProductor | undefined;
    const sexo = req.query.sexo as Sexo | undefined;
    const comunidad = req.query.comunidad as string | undefined;
    const nivel_educativo = req.query.nivel_educativo as NivelEducativo | undefined;
    const idioma_principal = req.query.idioma_principal as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await productoresService.getAll(search, estado, cargo, sexo, comunidad, nivel_educativo, idioma_principal, page, limit);
    res.status(200).json({ success: true, data: result.data, total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages });
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
    const productor = await productoresService.getById(toProductorId(Number(req.params.id)));
    res.status(200).json({ success: true, data: productor });
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
    const input: CreateProductorInput = req.body;
    const productor = await productoresService.create(input, req.user?.id);
    res.status(201).json({ success: true, message: 'Productor registrado exitosamente', data: productor });
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
    const input: UpdateProductorInput = req.body;
    const productor = await productoresService.update(toProductorId(Number(req.params.id)), input, req.user?.id);
    res.status(200).json({ success: true, message: 'Productor actualizado exitosamente', data: productor });
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
    const result = await productoresService.remove(toProductorId(Number(req.params.id)));
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

// ─── Familiares ─────────────────────────────────────────────

export const getFamiliares = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const familiares = await productoresService.getFamiliares(toProductorId(Number(req.params.id)));
    res.status(200).json({ success: true, data: familiares });
  } catch (error) {
    next(error);
  }
};

export const createFamiliar = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input: CreateFamiliarInput = req.body;
    const familiar = await productoresService.createFamiliar(toProductorId(Number(req.params.id)), input);
    res.status(201).json({ success: true, message: 'Familiar registrado exitosamente', data: familiar });
  } catch (error) {
    next(error);
  }
};

export const updateFamiliar = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input: UpdateFamiliarInput = req.body;
    const familiar = await productoresService.updateFamiliar(
      toProductorId(Number(req.params.id)),
      toFamiliarId(Number(req.params.familiarId)),
      input,
    );
    res.status(200).json({ success: true, message: 'Familiar actualizado exitosamente', data: familiar });
  } catch (error) {
    next(error);
  }
};

export const removeFamiliar = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await productoresService.removeFamiliar(
      toProductorId(Number(req.params.id)),
      toFamiliarId(Number(req.params.familiarId)),
    );
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

// ─── Documentos ─────────────────────────────────────────────

export const getDocumentos = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const documentos = await productoresService.getDocumentos(toProductorId(Number(req.params.id)));
    res.status(200).json({ success: true, data: documentos });
  } catch (error) {
    next(error);
  }
};

export const createDocumento = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input: CreateDocumentoInput = req.body;
    const documento = await productoresService.createDocumento(toProductorId(Number(req.params.id)), input);
    res.status(201).json({ success: true, message: 'Documento registrado exitosamente', data: documento });
  } catch (error) {
    next(error);
  }
};

export const updateDocumentoEstado = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { estado } = req.body as { estado: DocumentoEstado };
    const documento = await productoresService.updateDocumentoEstado(
      toProductorId(Number(req.params.id)),
      toDocumentoId(Number(req.params.documentoId)),
      estado,
    );
    res.status(200).json({ success: true, message: 'Estado del documento actualizado', data: documento });
  } catch (error) {
    next(error);
  }
};

export const removeDocumento = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await productoresService.removeDocumento(
      toProductorId(Number(req.params.id)),
      toDocumentoId(Number(req.params.documentoId)),
    );
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const removeOrphanDocumentos = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { keptDocumentIds } = req.body as { keptDocumentIds?: number[] };
    await productoresService.removeOrphanDocumentos(
      toProductorId(Number(req.params.id)),
      keptDocumentIds || [],
    );
    res.status(200).json({ success: true, message: 'Documentos huérfanos eliminados' });
  } catch (error) {
    next(error);
  }
};
