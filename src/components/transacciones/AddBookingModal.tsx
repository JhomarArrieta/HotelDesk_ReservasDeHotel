"use client";

import { useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Select from "../ui/Select";
import Input from "../ui/Input";

interface Room {
  readonly id: string;
  readonly name: string;
  readonly balance: number;
}

interface AddBookingModalProps {
  readonly room: Room;
  readonly onClose: () => void;
  readonly onSuccess: () => void;
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

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
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
    <Modal title="Nuevo movimiento" subtitle={room.name} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Saldo actual */}
        <div className="bg-slate-800 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-slate-400 text-sm">Noches reservadas</span>
          <span className="text-white font-semibold">
            {room.balance} noches
          </span>
        </div>

        <Select
          label="Tipo de movimiento"
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={[
            { value: "ENTRADA", label: "Check-in (cliente llega)" },
            { value: "SALIDA", label: "Check-out (cliente se va)" },
          ]}
        />

        {type === "ENTRADA" && (
          <Input
            label="Número de noches"
            name="nights"
            type="number"
            min="1"
            required
            defaultValue={1}
          />
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
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading} disabled={success}>
            Crear movimiento
          </Button>
        </div>
      </form>
    </Modal>
  );
}
