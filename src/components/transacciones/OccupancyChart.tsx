"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Booking {
  type: "ENTRADA" | "SALIDA";
  nights: number;
  date: string;
}

interface OccupancyChartProps {
  bookings: Booking[];
  roomName: string;
}

export default function OccupancyChart({
  bookings,
  roomName,
}: OccupancyChartProps) {
  // Calcula la evolución del saldo día a día
  const chartData = bookings.map((booking, index) => {
    const saldoAcumulado = bookings.slice(0, index + 1).reduce((acc, b) => {
      return b.type === "ENTRADA" ? acc - b.nights : acc + b.nights;
    }, 30); // parte desde el saldo inicial estimado

    return {
      fecha: new Date(booking.date).toLocaleDateString("es-CO", {
        month: "short",
        day: "numeric",
      }),
      saldo: saldoAcumulado,
      tipo: booking.type === "ENTRADA" ? "Check-in" : "Check-out",
    };
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-white font-semibold mb-6">
        Evolución de saldo — {roomName}
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="fecha"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={{ stroke: "#1e293b" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={{ stroke: "#1e293b" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "12px",
              color: "#f8fafc",
            }}
            formatter={(value) => [`${value} noches`, "Saldo"]}
          />
          <Area
            type="monotone"
            dataKey="saldo"
            stroke="#fbbf24"
            strokeWidth={2}
            fill="url(#colorSaldo)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
