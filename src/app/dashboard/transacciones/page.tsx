"use client";

import { useEffect, useState } from "react";
import { Plus, TrendingUp } from "lucide-react";
import AddBookingModal from "../../../components/transacciones/AddBookingModal";
import OccupancyChart from "../../../components/transacciones/OccupancyChart";

interface Room {
  id: string;
  name: string;
  type: string;
  balance: number;
}

interface Booking {
  id: string;
  type: "ENTRADA" | "SALIDA";
  nights: number;
  date: string;
  user: { name: string | null; email: string };
}

export default function TransaccionesPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Carga habitaciones al montar
  useEffect(() => {
    fetch("/api/rooms")
      .then((r) => r.json())
      .then((data) => {
        setRooms(data);
        if (data.length > 0) setSelectedRoom(data[0]);
      })
      .finally(() => setLoadingRooms(false));
  }, []);

  // Carga bookings cuando cambia la habitación seleccionada
  useEffect(() => {
    if (!selectedRoom) return;

    async function fetchBookings() {
      setLoadingBookings(true);
      try {
        const res = await fetch(`/api/bookings?roomId=${selectedRoom!.id}`);
        const data = await res.json();
        setBookings(data);
      } finally {
        setLoadingBookings(false);
      }
    }

    fetchBookings();
  }, [selectedRoom]);

  async function refreshData() {
    if (!selectedRoom) return;

    // Refresca tanto los bookings como el saldo actualizado de la habitación
    const [bookingsRes, roomsRes] = await Promise.all([
      fetch(`/api/bookings?roomId=${selectedRoom.id}`).then((r) => r.json()),
      fetch("/api/rooms").then((r) => r.json()),
    ]);

    setBookings(bookingsRes);
    setRooms(roomsRes);

    // Actualiza el saldo mostrado en el dropdown
    const updatedRoom = roomsRes.find((r: Room) => r.id === selectedRoom.id);
    if (updatedRoom) setSelectedRoom(updatedRoom);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transacciones</h1>
          <p className="text-slate-400 text-sm mt-1">
            Movimientos de reservas por habitación
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={!selectedRoom}
          className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-xl transition-all duration-150"
        >
          <Plus size={18} />
          Agregar movimiento
        </button>
      </div>

      {/* Dropdown selector de habitación */}
      <div className="flex items-center gap-4">
        <label className="text-slate-400 text-sm font-medium whitespace-nowrap">
          Habitación:
        </label>
        {loadingRooms ? (
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <select
            value={selectedRoom?.id ?? ""}
            onChange={(e) => {
              const room = rooms.find((r) => r.id === e.target.value);
              if (room) setSelectedRoom(room);
            }}
            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} — Saldo: {room.balance} noches
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Tabla de movimientos */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-white font-semibold">
            Movimientos{selectedRoom ? ` — ${selectedRoom.name}` : ""}
          </h2>
        </div>

        {loadingBookings ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <TrendingUp className="text-slate-600" size={40} />
            <p className="text-slate-500">No hay movimientos registrados</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Noches
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Registrado por
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                    {booking.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm">
                    {new Date(booking.date).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                        booking.type === "ENTRADA"
                          ? "bg-red-400/15 text-red-400"
                          : "bg-green-400/15 text-green-400"
                      }`}
                    >
                      {booking.type === "ENTRADA" ? "Check-in" : "Check-out"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    {booking.nights} {booking.nights === 1 ? "noche" : "noches"}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {booking.user.name ?? booking.user.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Gráfica de ocupación */}
      {selectedRoom && bookings.length > 0 && (
        <OccupancyChart bookings={bookings} roomName={selectedRoom.name} />
      )}

      {/* Modal */}
      {showModal && selectedRoom && (
        <AddBookingModal
          room={selectedRoom}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            refreshData();
          }}
        />
      )}
    </div>
  );
}
