"use server";

import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  campanas,
  cosechas,
  establecimientos,
  lotes,
  planesSiembra,
} from "@/db/schema";
import { CULTIVOS, DESTINOS_SIEMBRA } from "@/app/lib/constants";

export type ActionState = { error?: string } | undefined;

function requireText(formData: FormData, field: string): string | null {
  const value = formData.get(field);
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}

function requirePositiveNumber(
  formData: FormData,
  field: string
): number | null {
  const raw = formData.get(field);
  if (typeof raw !== "string" || raw.trim() === "") return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

function optionalPositiveNumber(
  formData: FormData,
  field: string
): number | undefined {
  const raw = formData.get(field);
  if (typeof raw !== "string" || raw.trim() === "") return undefined;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

function optionalText(formData: FormData, field: string): string | undefined {
  const value = formData.get(field);
  if (typeof value !== "string" || value.trim() === "") return undefined;
  return value.trim();
}

// ---------- Establecimientos ----------

export async function crearEstablecimiento(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const nombre = requireText(formData, "nombre");
  if (!nombre) return { error: "El nombre del establecimiento es obligatorio." };

  await db.insert(establecimientos).values({
    nombre,
    cuitTitular: optionalText(formData, "cuitTitular"),
    ubicacion: optionalText(formData, "ubicacion"),
  });

  revalidatePath("/establecimientos");
  revalidatePath("/");
}

export async function listarEstablecimientos() {
  return db.select().from(establecimientos).orderBy(asc(establecimientos.nombre));
}

// ---------- Lotes ----------

export async function crearLote(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const establecimientoId = requirePositiveNumber(formData, "establecimientoId");
  const nombre = requireText(formData, "nombre");
  const hectareas = requirePositiveNumber(formData, "hectareas");

  if (!establecimientoId) return { error: "Elegí un establecimiento." };
  if (!nombre) return { error: "El nombre del lote es obligatorio." };
  if (!hectareas) return { error: "Cargá las hectáreas del lote." };

  await db.insert(lotes).values({
    establecimientoId,
    nombre,
    hectareas,
    coordenadas: optionalText(formData, "coordenadas"),
  });

  revalidatePath("/lotes");
  revalidatePath("/");
}

export async function listarLotes() {
  return db
    .select({
      id: lotes.id,
      nombre: lotes.nombre,
      hectareas: lotes.hectareas,
      coordenadas: lotes.coordenadas,
      establecimientoId: lotes.establecimientoId,
      establecimientoNombre: establecimientos.nombre,
    })
    .from(lotes)
    .innerJoin(establecimientos, eq(lotes.establecimientoId, establecimientos.id))
    .orderBy(asc(lotes.nombre));
}

// ---------- Campañas ----------

export async function crearCampana(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const nombre = requireText(formData, "nombre");
  const fechaInicio = requireText(formData, "fechaInicio");
  const fechaFin = requireText(formData, "fechaFin");

  if (!nombre) return { error: 'El nombre de la campaña es obligatorio (ej. "2025/26").' };
  if (!fechaInicio || !fechaFin)
    return { error: "Cargá la fecha de inicio y de fin de la campaña." };

  await db.insert(campanas).values({ nombre, fechaInicio, fechaFin });

  revalidatePath("/campanas");
  revalidatePath("/siembra");
  revalidatePath("/cosecha");
  revalidatePath("/");
}

export async function listarCampanas() {
  return db.select().from(campanas).orderBy(asc(campanas.nombre));
}

// ---------- Plan de Siembra ----------
// Regla de imputación completa: establecimiento (vía lote) + lote + campaña + cultivo.
// Si falta alguno, no se guarda.

export async function crearPlanSiembra(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const loteId = requirePositiveNumber(formData, "loteId");
  const campanaId = requirePositiveNumber(formData, "campanaId");
  const cultivo = requireText(formData, "cultivo");
  const hectareas = requirePositiveNumber(formData, "hectareas");
  const fecha = requireText(formData, "fecha");

  if (!loteId) return { error: "Elegí un lote." };
  if (!campanaId) return { error: "Elegí una campaña." };
  if (!cultivo || !CULTIVOS.includes(cultivo as (typeof CULTIVOS)[number]))
    return { error: "Elegí un cultivo de la lista." };
  if (!hectareas) return { error: "Cargá las hectáreas sembradas." };
  if (!fecha) return { error: "Cargá la fecha de siembra." };

  const destino = optionalText(formData, "destino");
  if (destino && !DESTINOS_SIEMBRA.includes(destino as (typeof DESTINOS_SIEMBRA)[number]))
    return { error: "Elegí un destino válido de la lista." };

  await db.insert(planesSiembra).values({
    loteId,
    campanaId,
    cultivo,
    hectareas,
    destino,
    fecha,
  });

  revalidatePath("/siembra");
  revalidatePath("/");
}

export async function listarPlanesSiembra() {
  return db
    .select({
      id: planesSiembra.id,
      cultivo: planesSiembra.cultivo,
      hectareas: planesSiembra.hectareas,
      destino: planesSiembra.destino,
      fecha: planesSiembra.fecha,
      loteNombre: lotes.nombre,
      establecimientoNombre: establecimientos.nombre,
      campanaNombre: campanas.nombre,
    })
    .from(planesSiembra)
    .innerJoin(lotes, eq(planesSiembra.loteId, lotes.id))
    .innerJoin(establecimientos, eq(lotes.establecimientoId, establecimientos.id))
    .innerJoin(campanas, eq(planesSiembra.campanaId, campanas.id))
    .orderBy(asc(planesSiembra.fecha));
}

// Datos agregados para el gráfico de torta del dashboard: hectáreas por lote.
export async function obtenerSiembraPorLote() {
  const filas = await listarPlanesSiembra();
  const porLote = new Map<string, number>();
  for (const fila of filas) {
    const clave = `${fila.loteNombre} (${fila.cultivo})`;
    porLote.set(clave, (porLote.get(clave) ?? 0) + fila.hectareas);
  }
  return Array.from(porLote.entries()).map(([nombre, hectareas]) => ({
    nombre,
    hectareas,
  }));
}

// ---------- Cosecha ----------

export async function crearCosecha(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const loteId = requirePositiveNumber(formData, "loteId");
  const campanaId = requirePositiveNumber(formData, "campanaId");
  const cultivo = requireText(formData, "cultivo");
  const rindeObtenido = requirePositiveNumber(formData, "rindeObtenido");
  const fecha = requireText(formData, "fecha");

  if (!loteId) return { error: "Elegí un lote." };
  if (!campanaId) return { error: "Elegí una campaña." };
  if (!cultivo || !CULTIVOS.includes(cultivo as (typeof CULTIVOS)[number]))
    return { error: "Elegí un cultivo de la lista." };
  if (!rindeObtenido) return { error: "Cargá el rinde obtenido." };
  if (!fecha) return { error: "Cargá la fecha de cosecha." };

  await db.insert(cosechas).values({
    loteId,
    campanaId,
    cultivo,
    rindeObtenido,
    stockResultante: optionalPositiveNumber(formData, "stockResultante"),
    fecha,
  });

  revalidatePath("/cosecha");
  revalidatePath("/");
}

export async function listarCosechas() {
  return db
    .select({
      id: cosechas.id,
      cultivo: cosechas.cultivo,
      rindeObtenido: cosechas.rindeObtenido,
      stockResultante: cosechas.stockResultante,
      fecha: cosechas.fecha,
      loteNombre: lotes.nombre,
      establecimientoNombre: establecimientos.nombre,
      campanaNombre: campanas.nombre,
    })
    .from(cosechas)
    .innerJoin(lotes, eq(cosechas.loteId, lotes.id))
    .innerJoin(establecimientos, eq(lotes.establecimientoId, establecimientos.id))
    .innerJoin(campanas, eq(cosechas.campanaId, campanas.id))
    .orderBy(asc(cosechas.fecha));
}
