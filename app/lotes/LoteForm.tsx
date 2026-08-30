"use client";

import { useActionState } from "react";
import { crearLote } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButton";

type Establecimiento = { id: number; nombre: string };

export function LoteForm({ establecimientos }: { establecimientos: Establecimiento[] }) {
  const [state, formAction] = useActionState(crearLote, undefined);

  if (establecimientos.length === 0) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Primero cargá un establecimiento en la pantalla anterior.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700">Establecimiento</label>
        <select
          name="establecimientoId"
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
          defaultValue=""
        >
          <option value="" disabled>
            Elegí un campo
          </option>
          {establecimientos.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Nombre del lote</label>
        <input
          name="nombre"
          required
          placeholder="Ej. Lote 4"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Hectáreas</label>
        <input
          name="hectareas"
          type="number"
          step="0.01"
          min="0.01"
          required
          placeholder="Ej. 85"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Coordenadas (opcional)
        </label>
        <input
          name="coordenadas"
          placeholder="Ej. -33.12, -61.45"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
        />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>Guardar lote</SubmitButton>
    </form>
  );
}
