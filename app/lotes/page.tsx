import { listarEstablecimientos, listarLotes } from "@/app/actions";
import { LoteForm } from "./LoteForm";

export default async function LotesPage() {
  const [lotes, establecimientos] = await Promise.all([
    listarLotes(),
    listarEstablecimientos(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Lotes</h1>
        <p className="text-sm text-zinc-500">Las divisiones de campo donde sembrás.</p>
      </div>

      <LoteForm establecimientos={establecimientos} />

      <div className="space-y-2">
        {lotes.length === 0 && (
          <p className="text-sm text-zinc-500">Todavía no cargaste ningún lote.</p>
        )}
        {lotes.map((l) => (
          <div key={l.id} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="font-medium">{l.nombre}</p>
            <p className="text-sm text-zinc-500">
              {l.establecimientoNombre} · {l.hectareas} ha
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
