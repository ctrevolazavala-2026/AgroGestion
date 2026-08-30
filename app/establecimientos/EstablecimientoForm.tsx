"use client";

import { useActionState } from "react";
import { crearEstablecimiento } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButton";

export function EstablecimientoForm() {
  const [state, formAction] = useActionState(crearEstablecimiento, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Nombre del campo
        </label>
        <input
          name="nombre"
          required
          placeholder="Ej. La Esperanza"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">
          CUIT / Titular (opcional)
        </label>
        <input
          name="cuitTitular"
          placeholder="Ej. 20-12345678-9"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Ubicación / RENSPA (opcional)
        </label>
        <input
          name="ubicacion"
          placeholder="Ej. 05.017.0.00123/01"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
        />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>Guardar establecimiento</SubmitButton>
    </form>
  );
}
