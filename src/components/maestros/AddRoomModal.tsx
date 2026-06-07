"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AddRoomModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ROOM_TYPES = ["Estándar", "Suite", "Doble", "Junior Suite", "Presidencial"];

export default function AddRoomModal({ onClose, onSuccess }: AddRoomModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const body = {
      name: formData.get("name"),
      type: formData.get("type"),
      capacity: Number(formData.get("capacity")),
      pricePerNight: Number(formData.get("pricePerNight")),
      balance: Number(formData.get("balance")),
    };

    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Error al crear la habitación");
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
    // Overlay
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">

        {/* Header del modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-white font-semibold">Nueva habitación</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-slate-300 font-medium">
              Nombre
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="Ej: Habitación 101"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-300 font-medium">
              Tipo
            </label>
            <select
              name="type"
              required
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            >
              {ROOM_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-slate-300 font-medium">
                Capacidad (pax)
              </label>
              <input
                name="capacity"
                type="number"
                min="1"
                required
                defaultValue={2}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-slate-300 font-medium">
                Precio / noche
              </label>
              <input
                name="pricePerNight"
                type="number"
                min="0"
                required
                placeholder="150000"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-300 font-medium">
              Saldo inicial (noches disponibles)
            </label>
            <input
              name="balance"
              type="number"
              min="0"
              required
              defaultValue={0}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-400 text-sm bg-green-400/10 px-4 py-2 rounded-lg">
              ✓ Habitación creada exitosamente
            </p>
          )}

          {/* Botones */}
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
              {loading ? "Creando..." : "Crear habitación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}