import { listarCampanas } from "@/app/actions";
import { CampanaForm } from "./CampanaForm";

export default async function CampanasPage() {
  const campanas = await listarCampanas();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Campañas</h1>
        <p className="text-sm text-zinc-500">Las temporadas agrícolas (ej. 2025/26).</p>
      </div>

      <CampanaForm />

      <div className="space-y-2">
        {campanas.length === 0 && (
          <p className="text-sm text-zinc-500">Todavía no cargaste ninguna campaña.</p>
        )}
        {campanas.map((c) => (
          <div key={c.id} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="font-medium">{c.nombre}</p>
            <p className="text-sm text-zinc-500">
              {c.fechaInicio} → {c.fechaFin}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
