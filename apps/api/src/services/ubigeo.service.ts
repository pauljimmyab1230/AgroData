import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface UbigeoQuery {
  dpto?: string;
  prov?: string;
}

export async function getAllUbigeo(filters?: UbigeoQuery) {
  const where: Record<string, string> = {};

  if (filters?.dpto) {
    where.dpto = filters.dpto;
  }
  if (filters?.prov) {
    where.prov = filters.prov;
  }

  return prisma.ubigeo.findMany({
    where,
    orderBy: [{ dpto: 'asc' }, { prov: 'asc' }, { distrito: 'asc' }],
  });
}

export async function getDepartamentos() {
  const results = await prisma.ubigeo.findMany({
    select: { dpto: true },
    distinct: ['dpto'],
    orderBy: { dpto: 'asc' },
  });
  return results.map((r) => r.dpto);
}

export async function getProvincias(dpto: string) {
  const results = await prisma.ubigeo.findMany({
    where: { dpto },
    select: { prov: true },
    distinct: ['prov'],
    orderBy: { prov: 'asc' },
  });
  return results.map((r) => r.prov);
}

export async function getDistritos(dpto: string, prov: string) {
  const results = await prisma.ubigeo.findMany({
    where: { dpto, prov },
    select: { distrito: true, ubigeo: true },
    orderBy: { distrito: 'asc' },
  });
  return results;
}

export async function getUbigeoByCodigo(codigo: string) {
  return prisma.ubigeo.findUnique({
    where: { ubigeo: codigo },
  });
}
