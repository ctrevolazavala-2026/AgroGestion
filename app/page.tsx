import { listarCampanas, listarEstablecimientos, obtenerSiembraPorLote } from "@/app/actions";
import { GraficoSiembra } from "@/app/components/GraficoSiembra";

export default async function Dashboard() {
  const [datos, establecimientos, campanas] = await Promise.all([
    obtenerSiembraPorLote(),
    listarEstablecimientos(),
    listarCampanas(),
  ]);

  const totalHectareas = datos.reduce((suma, d) => suma + d.hectareas, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-zinc-500">Plan de siembra por lote.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl border border-zinc-200 bg-white p-3">
          <p className="text-2xl font-semibold text-green-800">{establecimientos.length}</p>
          <p className="text-xs text-zinc-500">Establecimientos</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-3">
          <p className="text-2xl font-semibold text-green-800">{campanas.length}</p>
          <p className="text-xs text-zinc-500">Campañas</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-3">
          <p className="text-2xl font-semibold text-green-800">{totalHectareas}</p>
          <p className="text-xs text-zinc-500">Hectáreas sembradas</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <GraficoSiembra datos={datos} />
      </div>
    </div>
  );
}
