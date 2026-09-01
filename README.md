# AgroGestión — Etapa 1 (Agrícola)

App de gestión para productores agropecuarios. Esta es la primera etapa: plan de siembra, cosecha y un dashboard con el plan de siembra por lote. El resto de las etapas (ganadero, fiscal y patrimonial, insumos RE/OT, comercial, cash flow) se construyen una por una — ver `PROYECTO_AGROGESTION.md`.

## Cómo correrla

```bash
npm install
npx drizzle-kit migrate   # crea agrogestion.db si no existe
npm run dev
```

Abrir `http://localhost:3000` en el navegador.

## Stack

- **Next.js 16 + TypeScript + Tailwind** — app web mobile-first.
- **SQLite + Drizzle ORM** (`db/schema.ts`, `db/index.ts`) — local en desarrollo (archivo `agrogestion.db`), o [Turso](https://turso.tech) en producción (mismo motor SQLite alojado en la nube) vía las variables `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN`.
- **Recharts** — el gráfico de torta del dashboard.
- **Server Actions de Next.js** (`app/actions.ts`) — todas las altas y consultas, con la regla de imputación completa (establecimiento + lote + campaña + cultivo) validada en el servidor.

## Estructura

```
app/
  page.tsx                       → Dashboard
  establecimientos/              → Alta de campo
  lotes/                         → Alta de lotes
  campanas/                      → Alta de campañas
  siembra/                       → Plan de siembra
  cosecha/                       → Cosecha
  actions.ts                     → Server Actions (altas, listados, validación de imputación)
  lib/constants.ts               → Listas fijas (cultivos, destinos) para los dropdowns
  components/GraficoSiembra.tsx  → Gráfico de torta
  components/NavBar.tsx          → Navegación
  components/SubmitButton.tsx    → Botón con estado "guardando"
db/
  schema.ts                      → Modelo de datos (Drizzle)
  index.ts                       → Conexión a SQLite
  migrations/                    → Migraciones generadas
```

## Comandos de base de datos

- `npm run db:generate` — genera una migración nueva después de cambiar `db/schema.ts`.
- `npm run db:migrate` — aplica las migraciones pendientes.
- `npm run db:studio` — abre una interfaz visual para ver los datos cargados.

## Siguiente paso

Cuando esta etapa esté probada con datos reales del campo, seguir con la **Etapa 2 — Ganadero** (Sección 5 y 8.5 de `PROYECTO_AGROGESTION.md`), pidiéndoselo a Claude Code en esta misma carpeta.

## Deploy

1. Crear una base gratuita en [Turso](https://turso.tech) y copiar la **Database URL** y un **Auth Token**.
2. Importar este repositorio en [Vercel](https://vercel.com) ("Add New Project" → elegir `AgroGestion`).
3. En las variables de entorno del proyecto en Vercel, cargar `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN`.
4. Deploy. El build corre `drizzle-kit migrate` automáticamente antes de compilar, así que las tablas se crean solas en la base de Turso la primera vez.
