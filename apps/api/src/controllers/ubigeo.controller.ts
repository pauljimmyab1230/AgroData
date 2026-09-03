import { Request, Response, NextFunction } from 'express';
import * as ubigeoService from '../services/ubigeo.service';

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { dpto, prov } = req.query;
    const filters: ubigeoService.UbigeoQuery = {};
    if (dpto && typeof dpto === 'string') filters.dpto = dpto;
    if (prov && typeof prov === 'string') filters.prov = prov;

    const data = await ubigeoService.getAllUbigeo(filters);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getDepartamentos(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await ubigeoService.getDepartamentos();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getProvincias(req: Request, res: Response, next: NextFunction) {
  try {
    const { dpto } = req.params;
    if (!dpto) {
      res.status(400).json({ success: false, message: 'Departamento es requerido' });
      return;
    }
    const data = await ubigeoService.getProvincias(dpto);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getDistritos(req: Request, res: Response, next: NextFunction) {
  try {
    const { dpto, prov } = req.params;
    if (!dpto || !prov) {
      res.status(400).json({ success: false, message: 'Departamento y provincia son requeridos' });
      return;
    }
    const data = await ubigeoService.getDistritos(dpto, prov);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getByCodigo(req: Request, res: Response, next: NextFunction) {
  try {
    const { codigo } = req.params;
    const data = await ubigeoService.getUbigeoByCodigo(codigo);
    if (!data) {
      res.status(404).json({ success: false, message: 'Ubigeo no encontrado' });
      return;
    }
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
