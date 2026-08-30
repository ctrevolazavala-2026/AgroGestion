"use client";

import { useActionState } from "react";
import { crearPlanSiembra } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButton";
import { CULTIVOS, DESTINOS_SIEMBRA } from "@/app/lib/constants";

type Lote = { id: number; nombre: string; establecimientoNombre: string };
type Campana = { id: number; nombre: string };

export function SiembraForm({
  lotes,
  campanas,
}: {
  lotes: Lote[];
  campanas: Campana[];
}) {
  const [state, formAction] = useActionState(crearPlanSiembra, undefined);

  if (lotes.length === 0 || campanas.length === 0) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Necesitás al menos un lote y una campaña cargados antes de planificar la siembra.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700">Lote</label>
        <select
          name="loteId"
          required
          defaultValue=""
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
        >
          <option value="" disabled>
            Elegí un lote
          </option>
          {lotes.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nombre} — {l.establecimientoNombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Campaña</label>
        <select
          name="campanaId"
          required
          defaultValue=""
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
        >
          <option value="" disabled>
            Elegí una campaña
          </option>
          {campanas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Cultivo</label>
        <select
          name="cultivo"
          required
          defaultValue=""
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
        >
          <option value="" disabled>
            Elegí un cultivo
          </option>
          {CULTIVOS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Hectáreas sembradas</label>
        <input
          name="hectareas"
          type="number"
          step="0.01"
          min="0.01"
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Destino (opcional)</label>
        <select
          name="destino"
          defaultValue=""
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
        >
          <option value="">Sin especificar</option>
          {DESTINOS_SIEMBRA.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Fecha de siembra</label>
        <input
          name="fecha"
          type="date"
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
        />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>Guardar siembra</SubmitButton>
    </form>
  );
}
