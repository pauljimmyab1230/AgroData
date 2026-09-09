import { type Request, type Response, type NextFunction } from 'express';
import Joi from 'joi';
import { createError } from './error.middleware';

type RequestProperty = 'body' | 'query' | 'params';

export const validate = (schema: Joi.ObjectSchema, property: RequestProperty = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      const err = createError('Error de validación', 422);
      err.errors = errors;
      next(err);
      return;
    }

    // Type-safe assignment
    switch (property) {
      case 'body':
        req.body = value;
        break;
      case 'query':
        req.query = value;
        break;
      case 'params':
        req.params = value;
        break;
    }

    next();
  };
};

// ─── Validation schemas for common params ───────────────────
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

export const searchSchema = Joi.object({
  search: Joi.string().max(200).allow('', null),
});
