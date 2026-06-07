"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Room {
  id: string;
  name: string;
  balance: number;
}

interface AddBookingModalProps {
  room: Room;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddBookingModal({
  room,
  onClose,
  onSuccess,
}: AddBookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [type, setType] = useState("ENTRADA");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const body = {
      roomId: room.id,
      type: formData.get("type"),
      nights: type === "ENTRADA" ? Number(formData.get("nights")) : 0,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Error al crear el movimiento");
        return;
      }

      setSuccess(true);
      setTimeout(() => onSuccess(), 800);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-white font-semibold">Nuevo movimiento</h2>
            <p className="text-slate-400 text-xs mt-0.5">{room.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Saldo actual */}
          <div className="bg-slate-800 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-slate-400 text-sm">Noches reservadas</span>
            <span className="text-white font-semibold">
              {room.balance} noches
            </span>
          </div>

          {/* Tipo de movimiento */}
          <div className="space-y-1">
            <label className="text-sm text-slate-300 font-medium">
              Tipo de movimiento
            </label>
            <select
              name="type"
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            >
              <option value="ENTRADA">Check-in (cliente llega)</option>
              <option value="SALIDA">Check-out (cliente se va)</option>
            </select>
          </div>

          {/* Noches — solo visible para check-in */}
          {type === "ENTRADA" && (
            <div className="space-y-1">
              <label className="text-sm text-slate-300 font-medium">
                Número de noches
              </label>
              <input
                name="nights"
                type="number"
                min="1"
                required
                defaultValue={1}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
              />
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-400 text-sm bg-green-400/10 px-4 py-2 rounded-lg">
              ✓ Movimiento registrado exitosamente
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 rounded-xl transition-all text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-xl transition-all text-sm"
            >
              {loading ? "Registrando..." : "Crear movimiento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
