import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  changePasswordSchema,
  refreshTokenSchema,
} from '../validators/auth.validator';
import {
  updateMeSchema,
  updateUsuarioSchema,
  createUsuarioSchema,
} from '../validators/usuarios.validator';

describe('validadores de autenticación', () => {
  describe('loginSchema', () => {
    it('acepta credenciales válidas', () => {
      const { error } = loginSchema.validate({
        email: 'admin@agrodata.com',
        password: 'Admin123!',
      });
      expect(error).toBeUndefined();
    });

    it('rechaza un email inválido', () => {
      const { error } = loginSchema.validate({
        email: 'no-es-email',
        password: 'x',
      });
      expect(error).toBeDefined();
    });
  });

  describe('changePasswordSchema', () => {
    it('exige la contraseña actual', () => {
      const { error } = changePasswordSchema.validate({
        passwordNueva: 'NuevaClave1',
      });
      expect(error).toBeDefined();
    });

    it('exige complejidad en la nueva contraseña', () => {
      const { error } = changePasswordSchema.validate({
        passwordActual: 'ViejaClave1',
        passwordNueva: 'simple',
      });
      expect(error).toBeDefined();
    });

    it('acepta una contraseña nueva válida', () => {
      const { error } = changePasswordSchema.validate({
        passwordActual: 'ViejaClave1',
        passwordNueva: 'NuevaClave1',
      });
      expect(error).toBeUndefined();
    });
  });

  describe('refreshTokenSchema', () => {
    it('exige el refreshToken', () => {
      const { error } = refreshTokenSchema.validate({});
      expect(error).toBeDefined();
    });

    it('acepta un token con longitud suficiente', () => {
      const { error } = refreshTokenSchema.validate({
        refreshToken: 'abc123def456ghi789',
      });
      expect(error).toBeUndefined();
    });
  });
});

describe('validadores de usuarios (prevención de escalada de privilegios)', () => {
  describe('updateMeSchema', () => {
    it('NO acepta el campo rol', () => {
      const { error, value } = updateMeSchema.validate({
        nombre: 'Test',
        rol: 'ADMIN',
      }, { stripUnknown: true });
      // stripUnknown elimina `rol`: no debe aparecer en el valor validado.
      expect(value.rol).toBeUndefined();
    });

    it('NO acepta el campo activo', () => {
      const { value } = updateMeSchema.validate({
        nombre: 'Test',
        activo: false,
      }, { stripUnknown: true });
      expect(value.activo).toBeUndefined();
    });

    it('NO acepta el campo rol_sic', () => {
      const { value } = updateMeSchema.validate({
        nombre: 'Test',
        rol_sic: 'INSPECTOR',
      }, { stripUnknown: true });
      expect(value.rol_sic).toBeUndefined();
    });

    it('sí acepta nombre, email y password', () => {
      const { error, value } = updateMeSchema.validate({
        nombre: 'Nuevo Nombre',
        email: 'nuevo@test.com',
        password: 'Clave123',
      });
      expect(error).toBeUndefined();
      expect(value.nombre).toBe('Nuevo Nombre');
    });
  });

  describe('updateUsuarioSchema', () => {
    it('sí acepta rol (este schema es solo para admin)', () => {
      const { value } = updateUsuarioSchema.validate({ rol: 'ADMIN' });
      expect(value.rol).toBe('ADMIN');
    });
  });

  describe('createUsuarioSchema', () => {
    it('asigna USER por defecto si no se especifica rol', () => {
      const { value } = createUsuarioSchema.validate({
        nombre: 'Test',
        email: 'test@test.com',
        password: 'Clave123',
      });
      expect(value.rol).toBe('USER');
    });
  });
});
