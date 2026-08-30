import { listarCampanas, listarLotes, listarPlanesSiembra } from "@/app/actions";
import { SiembraForm } from "./SiembraForm";

export default async function SiembraPage() {
  const [planes, lotes, campanas] = await Promise.all([
    listarPlanesSiembra(),
    listarLotes(),
    listarCampanas(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Plan de siembra</h1>
        <p className="text-sm text-zinc-500">Qué se sembró, dónde y cuánto.</p>
      </div>

      <SiembraForm lotes={lotes} campanas={campanas} />

      <div className="space-y-2">
        {planes.length === 0 && (
          <p className="text-sm text-zinc-500">Todavía no cargaste ninguna siembra.</p>
        )}
        {planes.map((p) => (
          <div key={p.id} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="font-medium">
              {p.cultivo} · {p.hectareas} ha
            </p>
            <p className="text-sm text-zinc-500">
              {p.loteNombre} ({p.establecimientoNombre}) · {p.campanaNombre}
            </p>
            <p className="text-sm text-zinc-500">
              {p.fecha}
              {p.destino ? ` · ${p.destino}` : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
