import { listarEstablecimientos } from "@/app/actions";
import { EstablecimientoForm } from "./EstablecimientoForm";

export default async function EstablecimientosPage() {
  const establecimientos = await listarEstablecimientos();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Establecimientos</h1>
        <p className="text-sm text-zinc-500">Los campos donde producís.</p>
      </div>

      <EstablecimientoForm />

      <div className="space-y-2">
        {establecimientos.length === 0 && (
          <p className="text-sm text-zinc-500">Todavía no cargaste ningún campo.</p>
        )}
        {establecimientos.map((e) => (
          <div key={e.id} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="font-medium">{e.nombre}</p>
            {e.cuitTitular && <p className="text-sm text-zinc-500">CUIT: {e.cuitTitular}</p>}
            {e.ubicacion && <p className="text-sm text-zinc-500">{e.ubicacion}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
