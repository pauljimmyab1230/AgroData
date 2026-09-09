// ─── Branded Types ──────────────────────────────────────────
// Type-safe ID prevents mixing IDs from different entities at compile time

declare const __brand: unique symbol;

export type Brand<T, B extends string> = T & { readonly [__brand]: B };

// ─── Entity IDs ─────────────────────────────────────────────
export type UserId = Brand<string, 'UserId'>;
export type UserEmail = Brand<string, 'UserEmail'>;
export type ProductorId = Brand<number, 'ProductorId'>;
export type FamiliarId = Brand<number, 'FamiliarId'>;
export type DocumentoId = Brand<number, 'DocumentoId'>;
export type ParcelaId = Brand<number, 'ParcelaId'>;
export type CampaniaId = Brand<number, 'CampaniaId'>;
export type CultivoId = Brand<number, 'CultivoId'>;
export type ActividadId = Brand<number, 'ActividadId'>;
export type InspeccionId = Brand<number, 'InspeccionId'>;
export type AcopioId = Brand<number, 'AcopioId'>;
export type RecepcionId = Brand<number, 'RecepcionId'>;
export type ProcesamientoId = Brand<number, 'ProcesamientoId'>;
export type KardexId = Brand<number, 'KardexId'>;
export type CatalogoId = Brand<number, 'CatalogoId'>;
export type UbigeoId = Brand<number, 'UbigeoId'>;
export type MovimientoId = Brand<number, 'MovimientoId'>;

// ─── Factory Functions ──────────────────────────────────────
export const toUserId = (id: string): UserId => id as UserId;
export const toProductorId = (id: number): ProductorId => id as ProductorId;
export const toFamiliarId = (id: number): FamiliarId => id as FamiliarId;
export const toDocumentoId = (id: number): DocumentoId => id as DocumentoId;
export const toParcelaId = (id: number): ParcelaId => id as ParcelaId;
export const toCampaniaId = (id: number): CampaniaId => id as CampaniaId;
export const toCultivoId = (id: number): CultivoId => id as CultivoId;
export const toActividadId = (id: number): ActividadId => id as ActividadId;
export const toInspeccionId = (id: number): InspeccionId => id as InspeccionId;
export const toAcopioId = (id: number): AcopioId => id as AcopioId;
export const toRecepcionId = (id: number): RecepcionId => id as RecepcionId;
export const toProcesamientoId = (id: number): ProcesamientoId => id as ProcesamientoId;
export const toKardexId = (id: number): KardexId => id as KardexId;
export const toCatalogoId = (id: number): CatalogoId => id as CatalogoId;
export const toUbigeoId = (id: number): UbigeoId => id as UbigeoId;
export const toMovimientoId = (id: number): MovimientoId => id as MovimientoId;

// ─── Brand Utility Type ─────────────────────────────────────
export type UnBrand<T> = T extends Brand<infer U, string> ? U : T;
