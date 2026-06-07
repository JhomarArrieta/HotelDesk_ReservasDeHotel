"use client";

import { useEffect, useState, useCallback } from "react"; // Importamos useCallback
import { Users } from "lucide-react";
import EditUserModal from "../../../components/usuarios/EditUserModal";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Memorizamos la función fetch para evitar recreaciones redundantes
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("[FETCH_USERS_ERROR]", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const executeFetch = setTimeout(() => {
      fetchUsers();
    }, 0);

    return () => clearTimeout(executeFetch);
  }, [fetchUsers]);

  const renderTableContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (users.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Users className="text-slate-600" size={40} />
          <p className="text-slate-500">No hay usuarios registrados</p>
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
              Nombre
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Correo
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Rol
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Fecha de creación
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-slate-800/50 transition-colors"
            >
              <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                {user.id.slice(0, 8)}...
              </td>
              <td className="px-6 py-4 text-white font-medium">
                {user.name ?? "—"}
              </td>
              <td className="px-6 py-4 text-slate-300 text-sm">{user.email}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                    user.role === "ADMIN"
                      ? "bg-amber-400/15 text-amber-400"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-400 text-sm">
                {new Date(user.createdAt).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="px-3 py-1.5 text-xs font-medium border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 rounded-lg transition-all"
                >
                  Editar rol
                </button>
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
      <div>
        <h1 className="text-2xl font-bold text-white">Usuarios</h1>
        <p className="text-slate-400 text-sm mt-1">
          Gestión de roles del personal
        </p>
      </div>

      {/* Tabla */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {renderTableContent()}
      </div>

      {/* Modal editar rol */}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={() => {
            setSelectedUser(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}
