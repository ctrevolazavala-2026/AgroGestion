import { listarCampanas, listarCosechas, listarLotes } from "@/app/actions";
import { CosechaForm } from "./CosechaForm";

export default async function CosechaPage() {
  const [cosechas, lotes, campanas] = await Promise.all([
    listarCosechas(),
    listarLotes(),
    listarCampanas(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Cosecha</h1>
        <p className="text-sm text-zinc-500">Rinde obtenido y stock resultante.</p>
      </div>

      <CosechaForm lotes={lotes} campanas={campanas} />

      <div className="space-y-2">
        {cosechas.length === 0 && (
          <p className="text-sm text-zinc-500">Todavía no cargaste ninguna cosecha.</p>
        )}
        {cosechas.map((c) => (
          <div key={c.id} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="font-medium">
              {c.cultivo} · {c.rindeObtenido} qq/ha
            </p>
            <p className="text-sm text-zinc-500">
              {c.loteNombre} ({c.establecimientoNombre}) · {c.campanaNombre}
            </p>
            <p className="text-sm text-zinc-500">
              {c.fecha}
              {c.stockResultante ? ` · ${c.stockResultante} tn` : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
