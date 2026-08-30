"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Paleta categórica validada (orden fijo, ver skill de dataviz).
const COLORES = [
  "#2a78d6", // blue
  "#eb6834", // orange
  "#1baf7a", // aqua
  "#eda100", // yellow
  "#e87ba4", // magenta
  "#008300", // green
  "#4a3aa7", // violet
  "#e34948", // red
];
const COLOR_OTROS = "#898781"; // muted, para la categoría agregada "Otros"
const MAX_SLICES = COLORES.length;

type Dato = { nombre: string; hectareas: number };

export function GraficoSiembra({ datos }: { datos: Dato[] }) {
  if (datos.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Todavía no hay plan de siembra cargado para graficar.
      </p>
    );
  }

  const ordenados = [...datos].sort((a, b) => b.hectareas - a.hectareas);
  const visibles = ordenados.slice(0, MAX_SLICES);
  const resto = ordenados.slice(MAX_SLICES);
  const otros = resto.reduce((suma, d) => suma + d.hectareas, 0);

  const data = [
    ...visibles.map((d, i) => ({ ...d, color: COLORES[i] })),
    ...(otros > 0 ? [{ nombre: "Otros", hectareas: otros, color: COLOR_OTROS }] : []),
  ];

  const mostrarEtiquetas = data.length <= 4;

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="hectareas"
            nameKey="nombre"
            innerRadius="45%"
            outerRadius="75%"
            paddingAngle={2}
            label={mostrarEtiquetas ? ({ name }) => name : false}
          >
            {data.map((d) => (
              <Cell key={d.nombre} fill={d.color} stroke="#fcfcfb" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} ha`, name]}
            contentStyle={{ borderRadius: 8, borderColor: "#e1e0d9", fontSize: 13 }}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
