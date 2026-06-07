"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "USER";
}

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditUserModal({
  user,
  onClose,
  onSuccess,
}: EditUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState<"ADMIN" | "USER">(user.role);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Error al actualizar usuario");
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
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-white font-semibold">Editar rol</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Info del usuario */}
          <div className="bg-slate-800 rounded-xl px-4 py-3">
            <p className="text-slate-400 text-xs mb-1">Usuario</p>
            <p className="text-white font-medium">{user.email}</p>
          </div>

          {/* Selector de rol */}
          <div className="space-y-1">
            <label className="text-sm text-slate-300 font-medium">Rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "ADMIN" | "USER")}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            >
              <option value="USER">USER — Recepcionista</option>
              <option value="ADMIN">ADMIN — Gerente</option>
            </select>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-400 text-sm bg-green-400/10 px-4 py-2 rounded-lg">
              ✓ Rol actualizado exitosamente
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
              disabled={loading || success || role === user.role}
              className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-xl transition-all text-sm"
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
