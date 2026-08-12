import { Router, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import type { AuthRequest } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.use(authMiddleware);

router.post(
  '/documentos',
  upload.single('archivo'),
  (req: AuthRequest, res: Response) => {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No se envió ningún archivo' });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const ruta_archivo = `${baseUrl}/uploads/documentos/${req.file.filename}`;

    res.status(201).json({
      success: true,
      data: {
        nombre_archivo: req.file.originalname,
        ruta_archivo,
        tamano_bytes: req.file.size,
        mime_type: req.file.mimetype,
      },
    });
  },
);

router.post(
  '/fotos',
  upload.single('archivo'),
  (req: AuthRequest, res: Response) => {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No se envió ningún archivo' });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const ruta_archivo = `${baseUrl}/uploads/fotos/${req.file.filename}`;

    res.status(201).json({
      success: true,
      data: {
        nombre_archivo: req.file.originalname,
        ruta_archivo,
        tamano_bytes: req.file.size,
        mime_type: req.file.mimetype,
      },
    });
  },
);

router.post(
  '/firmas',
  upload.single('archivo'),
  (req: AuthRequest, res: Response) => {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No se envió ningún archivo' });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const ruta_archivo = `${baseUrl}/uploads/firmas/${req.file.filename}`;

    res.status(201).json({
      success: true,
      data: {
        nombre_archivo: req.file.originalname,
        ruta_archivo,
        tamano_bytes: req.file.size,
        mime_type: req.file.mimetype,
      },
    });
  },
);

export default router;
