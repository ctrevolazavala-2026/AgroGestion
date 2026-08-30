import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const establecimientos = sqliteTable("establecimientos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  cuitTitular: text("cuit_titular"),
  ubicacion: text("ubicacion"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const lotes = sqliteTable("lotes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  establecimientoId: integer("establecimiento_id")
    .notNull()
    .references(() => establecimientos.id),
  nombre: text("nombre").notNull(),
  hectareas: real("hectareas").notNull(),
  coordenadas: text("coordenadas"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const campanas = sqliteTable("campanas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  fechaInicio: text("fecha_inicio").notNull(),
  fechaFin: text("fecha_fin").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const planesSiembra = sqliteTable("planes_siembra", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  loteId: integer("lote_id")
    .notNull()
    .references(() => lotes.id),
  campanaId: integer("campana_id")
    .notNull()
    .references(() => campanas.id),
  cultivo: text("cultivo").notNull(),
  hectareas: real("hectareas").notNull(),
  destino: text("destino"),
  fecha: text("fecha").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const cosechas = sqliteTable("cosechas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  loteId: integer("lote_id")
    .notNull()
    .references(() => lotes.id),
  campanaId: integer("campana_id")
    .notNull()
    .references(() => campanas.id),
  cultivo: text("cultivo").notNull(),
  rindeObtenido: real("rinde_obtenido").notNull(),
  stockResultante: real("stock_resultante"),
  fecha: text("fecha").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
