import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  DATABASE_URL: string;
  FRONTEND_URL: string;
}

const envSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('24h'),
  DATABASE_URL: Joi.string().required(),
  FRONTEND_URL: Joi.string().default('http://localhost:5173'),
}).unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Error de validación de variables de entorno: ${error.message}`);
}

export const env: EnvConfig = {
  PORT: value.PORT,
  NODE_ENV: value.NODE_ENV,
  JWT_SECRET: value.JWT_SECRET,
  JWT_EXPIRES_IN: value.JWT_EXPIRES_IN,
  DATABASE_URL: value.DATABASE_URL,
  FRONTEND_URL: value.FRONTEND_URL,
};
