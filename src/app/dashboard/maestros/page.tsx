"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Plus, BedDouble } from "lucide-react";
import AddRoomModal from "../../../components/maestros/AddRoomModal";

interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  balance: number;
  createdAt: string;
  createdBy: { name: string | null; email: string };
}

export default function MaestrosPage() {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";

  // Carga las habitaciones al montar el componente
  async function fetchRooms() {
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error("[FETCH_ROOMS_ERROR]", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadRooms() {
      await fetchRooms();
    }
    loadRooms();
  }, []);

  const renderTableContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (rooms.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <BedDouble className="text-slate-600" size={40} />
          <p className="text-slate-500">No hay habitaciones registradas</p>
        </div>
      );
    }

    return (
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              ID
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Habitación
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tipo
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Capacidad
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Precio / noche
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Saldo
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Creado por
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {rooms.map((room) => (
            <tr
              key={room.id}
              className="hover:bg-slate-800/50 transition-colors"
            >
              <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                {room.id.slice(0, 8)}...
              </td>
              <td className="px-6 py-4 text-white font-medium">{room.name}</td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg">
                  {room.type}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-300">{room.capacity} pax</td>
              <td className="px-6 py-4 text-slate-300">
                ${room.pricePerNight.toLocaleString("es-CO")}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                    room.balance > 0
                      ? "bg-green-400/15 text-green-400"
                      : "bg-red-400/15 text-red-400"
                  }`}
                >
                  {room.balance} noches
                </span>
              </td>
              <td className="px-6 py-4 text-slate-400 text-sm">
                {room.createdBy.name ?? room.createdBy.email}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Habitaciones</h1>
          <p className="text-slate-400 text-sm mt-1">
            Gestión del inventario de habitaciones
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold rounded-xl transition-all duration-150"
          >
            <Plus size={18} />
            Agregar habitación
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Aquí invocamos de manera limpia la función */}
        {renderTableContent()}
      </div>

      {/* Modal para agregar habitación */}
      {showModal && (
        <AddRoomModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchRooms(); // refresca la tabla automáticamente
          }}
        />
      )}
    </div>
  );
}
