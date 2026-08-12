import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages,
      });
      return;
    }

    req[property] = value;
    next();
  };
};
