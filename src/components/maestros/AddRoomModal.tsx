"use client";

import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Modal from "../ui/Modal";

interface AddRoomModalProps {
  readonly onClose: () => void;
  readonly onSuccess: () => void;
}

const ROOM_TYPES = [
  "Estándar",
  "Suite",
  "Doble",
  "Junior Suite",
  "Presidencial",
];

export default function AddRoomModal({
  onClose,
  onSuccess,
}: AddRoomModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

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
    <Modal title="Nueva habitación" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre"
          name="name"
          type="text"
          required
          placeholder="Ej: Habitación 101"
        />

        <Select
          label="Tipo"
          name="type"
          options={ROOM_TYPES.map((t) => ({ value: t, label: t }))}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Capacidad (pax)"
            name="capacity"
            type="number"
            min="1"
            required
            defaultValue={2}
          />
          <Input
            label="Precio / noche"
            name="pricePerNight"
            type="number"
            min="0"
            required
            placeholder="150000"
          />
        </div>

        <Input
          label="Saldo inicial (noches reservadas)"
          name="balance"
          type="number"
          min="0"
          required
          defaultValue={0}
        />

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

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading} disabled={success}>
            Crear habitación
          </Button>
        </div>
      </form>
    </Modal>
  );
}
