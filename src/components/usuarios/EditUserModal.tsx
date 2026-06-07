"use client";

import { useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Select from "../ui/Select";

interface User {
  readonly id: string;
  readonly name: string | null;
  readonly email: string;
  readonly role: "ADMIN" | "USER";
}

interface EditUserModalProps {
  readonly user: User;
  readonly onClose: () => void;
  readonly onSuccess: () => void;
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

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
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
    <Modal title="Editar rol" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Info del usuario */}
        <div className="bg-slate-800 rounded-xl px-4 py-3">
          <p className="text-slate-400 text-xs mb-1">Usuario</p>
          <p className="text-white font-medium">{user.email}</p>
        </div>

        <Select
          label="Rol"
          value={role}
          onChange={(e) => setRole(e.target.value as "ADMIN" | "USER")}
          options={[
            { value: "USER", label: "USER — Recepcionista" },
            { value: "ADMIN", label: "ADMIN — Gerente" },
          ]}
        />

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
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={success || role === user.role}
          >
            Guardar cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
}
