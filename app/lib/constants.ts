// Listas fijas (dropdowns) para carga guiada desde el celular.
// No editables por el usuario: mantienen la imputación consistente entre lotes y campañas.

export const CULTIVOS = [
  "Soja",
  "Maíz",
  "Trigo",
  "Girasol",
  "Sorgo",
  "Cebada",
  "Avena",
  "Colza",
  "Otro",
] as const;

export type Cultivo = (typeof CULTIVOS)[number];

export const DESTINOS_SIEMBRA = [
  "Grano comercial",
  "Semilla",
  "Forraje / Silaje",
  "Consumo interno",
  "Otro",
] as const;

export type DestinoSiembra = (typeof DESTINOS_SIEMBRA)[number];
