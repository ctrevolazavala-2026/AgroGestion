# AgroGestión
### Documento base para construir la app con Claude Code

**Autoría:** Cristian Trevolazavala, con Claude (Anthropic) como herramienta de desarrollo
**Fecha:** Agosto 2026
**Origen:** El proyecto nació en 2021 como una propuesta comercial en sociedad con la desarrolladora Intermedia (ver diagnóstico y módulos originales más abajo). Esa sociedad ya no está vigente: hoy es un desarrollo propio de Cristian Trevolazavala, construido con Claude Code, que conserva el diagnóstico original y lo reescribe con la lógica real de imputaciones que hoy usa ADMAgro.

---

## 0. Cómo usar este documento

Este archivo es el **brief de producto** del proyecto. No hace falta que lo leas de punta a punta antes de arrancar: la Sección 8 trae un prompt para pegar directamente en Claude Code y arrancar. El resto del documento es la referencia a la que Claude Code (y vos) van a volver en cada etapa para no perder criterio.

Guardalo como `PROYECTO_AGROGESTION.md` en la carpeta raíz del proyecto. Cuando le pidas a Claude Code que construya o modifique algo, decile "fijate en PROYECTO_AGROGESTION.md" para que respete el modelo de datos y la lógica de imputación sin que tengas que reexplicarla cada vez.

**Nombre del proyecto:** AgroGestión (se descartó "AgroClaude": las guías de marca de Anthropic no permiten usar "Claude" como parte del nombre de un producto propio).

---

## 1. Qué es esta app, en una frase

Una app simple para que un productor agropecuario (o su administrador) cargue **una vez al mes** lo mínimo indispensable de su campo — siembra, hacienda, insumos, ventas — y a cambio reciba automáticamente: su **posición patrimonial**, su **margen bruto por actividad**, sus **alertas fiscales** y un **informe listo para el contador**. Todo lo que hoy se arma "a mano" en Excel, mail y WhatsApp, en un solo lugar.

No es un ERP. No es ni pretende ser SAP para el campo. Es la mínima estructura de datos que, bien imputada, permite tomar decisiones (vender, comprar, sembrar) con números reales y no con intuición.

## 2. Para quién es (y qué significa eso para el diseño)

Usuario principal: **productor agropecuario de uso bajo/medio de tecnología**. En la práctica:

- Usa el celular más que la computadora. Todo tiene que andar bien en el teléfono.
- No tiene tiempo ni ganas de cargar datos todos los días. La carga tiene que ser **mensual, corta y guiada**, no un ABM administrativo permanente.
- No conoce (ni le interesa) la jerga contable. La app tiene que hablarle en el idioma del campo: lote, campaña, hacienda, cosecha — no "centro de costo" ni "asiento contable".
- Necesita que la app le avise, no que se lo tenga que acordar él (vencimientos AFIP, ARPOV, SENASA, sanidad de hacienda).
- Confía en su contador/administrador para lo fino; la app tiene que darle a ese contador un informe limpio, no reemplazarlo.

Regla de diseño que se repite en todo el documento: **cada pantalla nueva tiene que preguntarse "¿esto se puede cargar en menos de 2 minutos desde el celular, una vez al mes?"**. Si no, se simplifica o se saca del MVP.

Usuarios secundarios: administrador/gerente de campo (rol de Cristian), estudio contable (consume informes, no carga datos).

## 3. Antecedentes: qué falta resolver

La propuesta original de 2021 (Intermedia) ya había diagnosticado bien el problema del productor chico/mediano:

- Vencimientos fiscales que se pasan por alto y terminan en multas o CUIT suspendido.
- Demasiada información dispersa (Excel, remitos en papel, WhatsApp) sin criterio único de carga.
- Barrera de entrada alta: para "ordenarse" hace falta estructura administrativa que el productor chico no tiene.
- Falta de registros → no hay margen bruto confiable por actividad, ni costo por hectárea, ni cash flow proyectado.

Ese diagnóstico sigue vigente. Lo que este documento agrega, y que la propuesta de 2021 no tenía, es **la lógica real de imputación** que ADMAgro usa hoy en la operación — sin eso, cualquier app de "carga de datos" genera números que no cierran con la realidad del campo.

## 4. El corazón del sistema: la lógica de imputaciones

Esto es lo más importante del documento. Si Claude Code entiende esta sección, el resto es "solo" pantallas.

### 4.1 Jerarquía de imputación

Todo dato que entra al sistema — un insumo aplicado, una venta, un movimiento de hacienda, un gasto — **tiene que poder asignarse (imputarse) a esta cadena**:

```
Establecimiento (campo físico)
  └─ Lote (o Categoría de hacienda, si es ganadería)
       └─ Campaña (ej. 2025/26)
            └─ Actividad / Cultivo (agrícola: trigo, soja, maíz… | ganadera: cría, invernada…)
```

Sin esa asignación completa, el dato "queda flotando" y no sirve para calcular nada. La regla de oro: **no se guarda un movimiento sin imputación completa**. La app tiene que forzar esto con selects obligatorios y valores por defecto inteligentes (si el usuario ya cargó lote+campaña esta sesión, se lo precarga).

### 4.2 Por qué existe esta jerarquía

Porque el objetivo final no es "tener los datos", es poder calcular, por actividad y por campaña:

- **Margen bruto por actividad** (ingresos de la actividad − costos directos imputados a esa actividad)
- **Costo por hectárea** (agrícola) o **costo por cabeza** (ganadera)
- **Ciclo de conversión de caja** (cuánto tarda la plata en volver desde que se siembra/compra hasta que se cobra)
- **Posición patrimonial mensual** (stock valorizado + bienes − lo que se debe)

Estos cuatro números son el tablero que un administrador agropecuario necesita para decidir. Todo el resto de la app (alertas, recordatorios, informes) existe para alimentar estos cuatro números con el mínimo esfuerzo de carga.

### 4.3 Conciliación de insumos: remitos (RE) vs. órdenes de trabajo (OT)

Este es el proceso crítico que hoy se hace manualmente y que la app tiene que modelar bien. **Por su complejidad va como módulo propio y más adelante en el orden de construcción** (Etapa 4, Sección 5) — no conviene mezclarlo con las primeras etapas porque necesita una lógica de conciliación (no solo carga y consulta) que lleva más tiempo de desarrollo y de prueba con datos reales. Lo que sigue es la lógica que ese módulo tiene que resolver:

1. El insumo entra al sistema por **remito (RE)**: lo que efectivamente se recibió/compró.
2. El insumo se consume/aplica en el campo mediante una **orden de trabajo (OT)**: lo que efectivamente se usó, imputado a lote+campaña+actividad.
3. **Conciliación semanal** (no mensual): se compara RE vs. OT. No puede quedar ningún insumo con stock negativo — si eso pasa, hay un error de carga que se corrige antes de seguir.
4. **Criterio de toma de hectáreas**: mientras no llegó la OT de siembra, manda el dato del archivo/planificación de rotación de lotes. En cuanto llega la OT de siembra, esa pasa a ser la fuente de verdad. Si hay diferencia entre planificación y OT real, se resuelve con el responsable de campo y se corrige la base para que no se repita en la próxima labor.
5. Responsable operativo del control: definir un rol ("Responsable de conciliación") que semanalmente revisa que no queden insumos en negativo y corrige en el sistema.

Para el MVP, esto se puede simplificar a: **stock de insumos por remito, consumo por OT, alerta automática si el consumo acumulado supera lo remitido**. La automatización total de la conciliación puede ser una fase posterior.

### 4.4 Ganadería: la misma lógica, otro objeto

En hacienda, el "lote" se reemplaza por **categoría de vaca** (vacas vacías, preñadas, vaquillonas, novillos, terneros al pie, toros, etc. — ver listado completo en Sección 6). Cada movimiento de hacienda (compra, nacimiento, cambio de categoría, venta, consumo, muerte) se imputa a: campo + categoría + campaña. El "trabajo de manga" (vacunación, servicio, tacto, destete) sigue un calendario sanitario mensual por categoría — es la versión ganadera de la OT agrícola.

### 4.5 Qué significa esto para el desarrollo

Cuando le pidas a Claude Code construir cualquier pantalla de carga (siembra, insumo, venta, movimiento de hacienda), la validación central es: **¿tiene establecimiento, lote/categoría, campaña y actividad asignados?** Si falta alguno, no se guarda. Todos los reportes (margen bruto, costo por hectárea, patrimonial) se calculan agregando sobre esta imputación — nunca hardcodeados por pantalla.

## 5. Módulos = etapas de implementación

Cada módulo es una etapa cerrada de construcción: se termina, se usa un tiempo con datos reales, y recién ahí se arranca el siguiente. No se avanza a un módulo nuevo con el anterior a medio terminar. El orden está pensado por dos criterios: **qué genera valor antes** y **qué tan complejo es de construir** (por eso la conciliación RE/OT, que es la parte más laboriosa, va como módulo aparte y no al principio).

| Etapa | Módulo | Qué incluye | Complejidad / tiempo | Objetivo de la etapa |
|---|---|---|---|---|
| **1** | **Agrícola** | Plan de siembra (lote, has, cultivo, destino), cosecha (rinde obtenido, stock), existencias valorizadas | Baja | Reemplazar el Excel de siembra/cosecha por un registro único y confiable |
| **2** | **Ganadero** | Stock de hacienda por categoría, movimientos (compra/nacimiento/venta/muerte/cambio de categoría), calendario sanitario (trabajos de manga) | Baja-media | Tener el stock de hacienda y el plan sanitario en un solo lugar, con alertas |
| **3** | **Fiscal y Patrimonial** | Recordatorios de vencimientos (AFIP, ARPOV, SENASA), registro de arrendamientos, bienes patrimoniales valorizados en USD, posición patrimonial mensual (stock de Etapas 1-2 + bienes) | Media | Que no se pase más ningún vencimiento, y tener una foto patrimonial mensual real |
| **4** | **Insumos: conciliación RE/OT** *(módulo aparte, requiere más tiempo)* | Carga de remitos (RE) y órdenes de trabajo (OT), stock de insumos por lote/campaña/actividad, alerta de stock negativo, conciliación semanal, criterio de prioridad de hectáreas (planificación vs. OT de siembra real) | **Alta** — es lógica de conciliación, no solo carga y consulta | Controlar consumo real vs. comprado, y que el costo por hectárea sea confiable |
| **5** | **Comercial** | Listado de negocios (comprador, tipo de venta, ton, precio, destino, fecha), posición comercial (comprometido vs. disponible), proyección de ventas de hacienda | Media | Ver de un vistazo cuánto hay disponible para vender y a qué precio |
| **6** | **Cash Flow** | Costos fijos mensuales (actualizables por inflación INDEC), ventas proyectadas (granos y hacienda), flujo de caja proyectado; integraciones opcionales (clima, mercado de granos, AFIP) | Media-alta | Planificación financiera hacia adelante, no solo foto del presente |
| **Transversal** | **Informes** | Informe mensual patrimonial y de existencias para el estudio contable (exportable) — se arma con lo que ya cargaron las Etapas 1, 2 y 3 | Baja (una vez que las etapas de base están listas) | Darle al contador un informe limpio sin trabajo extra |

Notar que el margen bruto por actividad (el número que más le importa a Cristian como administrador) recién queda **confiable** al cerrar la Etapa 4: hasta entonces, el costo se puede estimar pero no está conciliado contra lo efectivamente consumido.

## 6. Modelo de datos simplificado

Entidades mínimas que Claude Code necesita para arrancar (nombres en español, tal como los va a ver el usuario final):

**Establecimiento** — id, nombre, CUIT/titular, ubicación (RENSPA si aplica)

**Lote** — id, establecimiento_id, nombre, hectáreas, coordenadas (opcional)

**Campaña** — id, nombre (ej. "2025/26"), fecha_inicio, fecha_fin

**Plan de Siembra** — lote_id, campaña_id, cultivo, hectáreas, destino, fecha

**Cosecha** — lote_id, campaña_id, cultivo, rinde_obtenido, stock_resultante, fecha

**Categoría de Hacienda** (catálogo fijo, no editable por el usuario): vacas vacías, vacas preñadas, vaquillonas preñadas, vaquillonas, vaquillona de oreja, vaquillita, novillos, novillitos, terneros al pie, terneras al pie, toritos, toros

**Movimiento de Hacienda** — establecimiento_id, categoría, campaña_id, tipo (compra / nacimiento / cambio de categoría / ingreso / venta / consumo / egreso / muerte), cantidad, fecha

**Trabajo de Manga** — establecimiento_id, categoría, tipo (vacunación / servicio / tacto / destete), fecha, detalle (ej. cabezas, preñadas/vacías, inseminación/toros)

**Insumo** — nombre, unidad, remitos (entradas por RE), consumos (salidas por OT), imputado a lote_id + campaña_id + actividad

**Negocio Comercial** — tipo_venta, comprador, producto (grano o hacienda), cantidad, precio, destino, fecha, estado (con precio / sin precio / comprometido / disponible)

**Bien Patrimonial** — descripción, categoría, valor USD, fecha de alta/baja

**Arrendamiento** — establecimiento_id, arrendador, forma de pago, fecha de pago, requisitos fiscales (sellos, firma certificada), vencimiento

**Vencimiento Fiscal** — organismo (AFIP / ARPOV / SENASA), tipo de presentación, fecha límite, estado, recordatorio (días de anticipación)

**Costo Fijo Mensual** — concepto, monto, actualización por inflación (índice INDEC)

Con estas doce entidades y la regla de imputación de la Sección 4 alcanza para construir completas las Etapas 1, 2 y 3 (Agrícola, Ganadero, Fiscal y Patrimonial). La entidad Insumo es la que usa la Etapa 4 (conciliación RE/OT).

## 7. Cómo se usa la app mes a mes (flujo objetivo)

1. **Carga inicial** (una sola vez): establecimiento, lotes, campaña activa, categorías de hacienda con stock inicial.
2. **Carga mensual** (el productor/administrador, ~10-15 minutos): novedades de siembra/cosecha, movimientos de hacienda del mes, insumos recibidos y aplicados, ventas cerradas.
3. **La app calcula sola**: existencias valorizadas, posición patrimonial, margen bruto acumulado por actividad, costo por hectárea/cabeza.
4. **Alertas automáticas**: 5-10 días antes de cada vencimiento fiscal o sanitario, notificación (push o email/WhatsApp).
5. **Informe mensual**: se genera solo y se puede compartir/exportar para el estudio contable.

## 8. Paso a paso: cómo avanzar en Claude Code

Esto es lo operativo: qué hacer, en qué orden, la primera vez y en cada etapa siguiente. Son pasos concretos, para seguir uno por uno.

### 8.1 Instalación y arranque (una sola vez)

1. **Instalar Node.js** (si no lo tenés ya): entrar a nodejs.org, descargar la versión recomendada e instalar como cualquier programa.
2. **Instalar Claude Code**: abrir una terminal y ejecutar `npm install -g @anthropic-ai/claude-code`.
3. **Verificar que quedó instalado**: `claude --version` tiene que devolver un número de versión.
4. **Iniciar sesión**: ejecutar `claude` y seguir las instrucciones en pantalla para loguearte con tu cuenta de Claude.

### 8.2 Crear el proyecto (una sola vez)

5. **Crear la carpeta del proyecto**: `mkdir agrogestion` y después `cd agrogestion` (esto entra a la carpeta).
6. **Poner el documento base adentro**: guardar el archivo que te mandé como `PROYECTO_AGROGESTION.md`, dentro de esa misma carpeta.
7. **Inicializar control de versiones** (recomendado, para poder volver atrás si algo se rompe): `git init`.

### 8.3 Etapa 1 — Agrícola: primer arranque

> **Estado: ✅ ya construida y probada** (ver Sección 8.3.1). Lo que sigue es el prompt de referencia, útil si la rehacés en tu propia máquina o para entender qué se le pidió a Claude Code.

8. Parado en la carpeta del proyecto, ejecutar `claude`.
9. Pegar este mensaje (es el prompt de arranque, ajustá el stack si ya tenés preferencia):

> Vamos a construir "AgroGestión", una app web mobile-first para productores agropecuarios de bajo uso de tecnología. Leé el archivo PROYECTO_AGROGESTION.md en la raíz del proyecto: ahí está el modelo de datos, la lógica de imputación (Establecimiento → Lote/Categoría → Campaña → Actividad) y las etapas de construcción (Sección 5), cada una un módulo cerrado.
>
> Empezá solo por la **Etapa 1 — Agrícola**, sin adelantar nada de las etapas siguientes: modelo de datos base (Establecimiento, Lote, Campaña, Plan de Siembra, Cosecha), un formulario de carga simple y corto para cada entidad, y un dashboard con un gráfico de torta de plan de siembra por lote. No incluyas todavía hacienda, insumos, fiscal ni comercial — eso son etapas aparte que van después, una por una.
>
> Stack sugerido: Next.js + TypeScript, base de datos SQLite, deploy en Vercel. Priorizá pantallas simples, en español, con lenguaje de campo (no jerga contable), pensadas para completarse en menos de 2 minutos desde el celular. Toda carga tiene que exigir imputación completa (establecimiento + lote + campaña + cultivo) antes de guardarse — sin excepciones, porque de ahí sale todo el resto de los cálculos (margen bruto, costo por hectárea, patrimonial).
>
> Armá primero el modelo de datos y las migraciones, después las pantallas de carga, y al final el dashboard. Antes de escribir código mostrame el modelo de datos propuesto para que lo valide.

*(Sobre el stack: SQLite no necesita servidor de base de datos aparte, y Vercel tiene plan gratuito para este volumen de uso. Para el ORM, la Etapa 1 terminó armada con Drizzle en vez de Prisma — ver por qué en 8.3.1. Si preferís otra cosa, no cambia nada del resto del documento.)*

#### 8.3.1 Qué se construyó realmente, y un ajuste al stack

La Etapa 1 ya está armada, migrada y probada de punta a punta (carga de campo, lote, campaña, plan de siembra, y el dashboard con el gráfico de torta). Un ajuste respecto de lo sugerido más arriba: se usó **Drizzle ORM + better-sqlite3** en lugar de Prisma. Motivo práctico: Prisma necesita descargar un binario propio (el "motor" en Rust) desde sus servidores la primera vez, y en el entorno donde se construyó esa descarga estaba bloqueada por política de red. Drizzle no tiene esa dependencia — es todo TypeScript, se instala como cualquier paquete de npm — así que es además una opción más liviana y con menos partes móviles para este proyecto. No cambia nada del modelo de datos ni de la lógica de imputación; si en tu máquina Prisma funciona sin problema y lo preferís, se puede migrar sin drama.

Estructura real del proyecto (dentro de `agrogestion/`):
- `db/schema.ts` — las 5 tablas de la Etapa 1 (establecimientos, lotes, campanas, planes_siembra, cosechas), con la jerarquía de imputación como claves foráneas.
- `db/index.ts` — la conexión a la base SQLite.
- `app/actions.ts` — todas las altas y consultas (Server Actions de Next.js), con la regla de imputación completa aplicada en el servidor, no solo en el formulario.
- `app/page.tsx` — el dashboard.
- `app/establecimientos/`, `app/lotes/`, `app/campanas/`, `app/siembra/`, `app/cosecha/` — una carpeta por pantalla, cada una con su formulario corto y su lista.
- `app/components/GraficoSiembra.tsx` — el gráfico de torta.

Para correrla en tu máquina: `cd agrogestion`, `npm install`, `npx drizzle-kit migrate` (crea la base si no existe) y `npm run dev`. Se abre en `http://localhost:3000`.

10. Claude Code te va a mostrar el **modelo de datos propuesto antes de tocar código**. Revisalo: si algo no coincide con cómo trabajás en el campo, decilo ahí mismo antes de dar el ok.
11. Una vez aprobado, dejalo trabajar: va a armar el modelo de datos, después las pantallas de carga, y al final el dashboard. Podés ir preguntando en el camino si algo no se entiende.
12. Cuando avise que terminó, **probarlo vos**: te va a decir cómo levantar el proyecto en tu máquina (normalmente `npm run dev`) y en qué dirección abrirlo en el navegador (`http://localhost:3000` o similar).

### 8.4 Probar con datos reales antes de avanzar

13. Cargar en la app datos reales de un lote y una campaña, como si fuera el uso mensual normal.
14. Revisar que el dashboard y lo que se guardó tenga sentido.
15. Si algo no cierra o se ve raro, contárselo a Claude Code tal cual lo ves ("cargué tal lote con tal cultivo y el gráfico no lo muestra") y pedir el ajuste puntual — no hace falta que sepas el porqué técnico.
16. **No pasar a la Etapa 2 hasta que esto ande bien probado con datos reales.** Es la regla más importante del documento: cada etapa se cierra antes de abrir la siguiente.

### 8.5 Repetir para cada etapa siguiente

17. Cuando la Etapa 1 esté sólida, arrancar (en la misma sesión de `claude` o en una nueva, da igual) con un mensaje corto: *"Fijate en PROYECTO_AGROGESTION.md. La Etapa 1 ya está lista y probada. Ahora construí la Etapa 2 — Ganadero, con el mismo criterio: modelo de datos, después pantallas, después dashboard. No toques lo de la Etapa 1 salvo que haga falta para conectar los datos."*
18. Repetir el ciclo completo de la Sección 8.3 y 8.4 (mostrar modelo → aprobar → construir → probar con datos reales → recién ahí avanzar) para cada etapa, en el orden de la Sección 5: Agrícola → Ganadero → Fiscal y Patrimonial → Insumos (RE/OT) → Comercial → Cash Flow.
19. La Etapa 4 (RE/OT) va a llevar más idas y vueltas que las demás — está bien, es la más compleja del proyecto. No conviene apurarla ni saltearla.

### 8.6 Guardar avances y publicarlo

20. Después de cada etapa cerrada y probada, guardar el progreso con git: `git add .` y después `git commit -m "Etapa 1: módulo agrícola"` (cambiando el mensaje según la etapa).
21. Cuando quieras que el productor lo use de verdad y no solo vos probando, pedirle directamente a Claude Code: *"hacé el deploy a Vercel"*. Con el stack sugerido es un paso simple y te va a dejar una dirección web (URL) para compartir.

### 8.7 Rutina resumida (para tener a mano)

Abrir `claude` en la carpeta → decir qué etapa sigue y pedirle que lea `PROYECTO_AGROGESTION.md` → revisar el modelo de datos que propone → dejarlo construir → probar con datos reales del campo → hacer commit → recién ahí pasar a la próxima etapa.

## 9. Glosario rápido

- **Imputar / imputación**: asignar un movimiento (costo, venta, insumo) a un lote/categoría + campaña + actividad específicos, para que se pueda calcular el resultado de esa actividad.
- **RE (remito)**: comprobante de lo que entró (insumo comprado/recibido).
- **OT (orden de trabajo)**: comprobante de lo que se aplicó/consumió en el campo.
- **Margen bruto por actividad**: ingresos menos costos directos de una actividad puntual (ej. soja de segunda en el lote 4).
- **Ciclo de conversión de caja**: tiempo que pasa entre que se invierte (siembra/compra de hacienda) y se cobra la venta.
- **Posición patrimonial**: foto de lo que se tiene (stock + bienes) valorizado a una fecha.

---

*Este documento reemplaza en vigencia a la propuesta comercial de Intermedia (2021), que se planteó originalmente en sociedad y hoy ya no lo está: se mantiene el diagnóstico del problema y la idea de los módulos, pero el orden de construcción, la lógica de imputación y el modelo de datos son los que hoy usa ADMAgro en su operación real, y el desarrollo queda a cargo de Cristian Trevolazavala con Claude Code.*
