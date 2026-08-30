"use client";

import { useActionState } from "react";
import { crearCampana } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButton";

export function CampanaForm() {
  const [state, formAction] = useActionState(crearCampana, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700">Campaña</label>
        <input
          name="nombre"
          required
          placeholder="Ej. 2025/26"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Inicio</label>
          <input
            name="fechaInicio"
            type="date"
            required
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Fin</label>
          <input
            name="fechaFin"
            type="date"
            required
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
          />
        </div>
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>Guardar campaña</SubmitButton>
    </form>
  );
}
