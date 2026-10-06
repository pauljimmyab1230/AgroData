import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { createError } from './error.middleware';

// Mapa MIME -> extensión canónica. La extensión NUNCA se toma del cliente:
// previene XSS almacenado vía .html/.svg/.php con Content-Type spoofeado.
const EXTENSIONES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};

const MIME_PERMITIDOS = Object.keys(EXTENSIONES);

// Firmas binarias (magic bytes) aceptadas por MIME.
const FIRMAS: Record<string, (buf: Buffer) => boolean> = {
  'image/jpeg': (b) => b.length > 2 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  'image/png': (b) => b.length > 7 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  'image/gif': (b) => b.length > 5 && (b.subarray(0, 6).toString('latin1') === 'GIF87a' || b.subarray(0, 6).toString('latin1') === 'GIF89a'),
  'image/webp': (b) => b.length > 11 && b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP',
  'application/pdf': (b) => b.length > 4 && b.subarray(0, 5).toString('latin1') === '%PDF-',
  'application/msword': (b) => b.length > 7 && b.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])),
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': (b) => b.length > 3 && b[0] === 0x50 && b[1] === 0x4b && (b[2] === 0x03 || b[2] === 0x05),
};

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    let folder = 'uploads/documentos';
    if (file.fieldname === 'foto') folder = 'uploads/fotos';
    if (file.fieldname === 'firma') folder = 'uploads/firmas';
    cb(null, path.join(__dirname, '..', '..', folder));
  },
  filename: (_req, file, cb) => {
    const ext = EXTENSIONES[file.mimetype] ?? '';
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (MIME_PERMITIDOS.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(createError(`Tipo de archivo no permitido: ${file.mimetype}`, 415));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Valida la firma binaria del archivo ya escrito en disco (magic bytes).
export function validarFirmaArchivo(
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction,
): void {
  const file = req.file;
  if (!file) {
    next();
    return;
  }
  const verificar = FIRMAS[file.mimetype];
  if (!verificar) {
    fs.unlink(file.path, () => undefined);
    next(createError('Tipo de archivo no permitido', 415));
    return;
  }
  let fd: number | undefined;
  try {
    fd = fs.openSync(file.path, 'r');
    const buf = Buffer.alloc(16);
    fs.readSync(fd, buf, 0, 16, 0);
    if (!verificar(buf)) {
      fs.unlink(file.path, () => undefined);
      next(createError('El archivo no coincide con el tipo declarado', 415));
      return;
    }
    next();
  } catch {
    fs.unlink(file.path, () => undefined);
    next(createError('No se pudo validar el archivo', 400));
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

// Rate limiter simple en memoria
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(windowMs: number, maxRequests: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
      rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    entry.count++;
    if (entry.count > maxRequests) {
      res.status(429).json({
        success: false,
        message: 'Demasiadas peticiones. Intenta más tarde.',
      });
      return;
    }
    next();
  };
}
