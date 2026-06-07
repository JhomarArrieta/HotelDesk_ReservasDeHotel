"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, BookOpen, Users, LogOut, Hotel } from "lucide-react";
import type { Role } from "@prisma/client";
import Image from "next/image";

interface SidebarProps {
  readonly user: {
    readonly name?: string | null;
    readonly email?: string | null;
    readonly image?: string | null;
    readonly role: Role;
  };
}

// Links visibles para todos los roles
const commonLinks = [
  {
    href: "/dashboard/transacciones",
    label: "Transacciones",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/maestros",
    label: "Habitaciones",
    icon: BookOpen,
  },
];

// Links solo para ADMIN
const adminLinks = [
  {
    href: "/dashboard/usuarios",
    label: "Usuarios",
    icon: Users,
  },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = user.role === "ADMIN";

  const links = isAdmin ? [...commonLinks, ...adminLinks] : commonLinks;

  // Genera las iniciales del nombre para el avatar
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Hotel className="text-amber-400" size={22} />
          <span className="text-white font-bold text-lg">
            Hotel<span className="text-amber-400">Desk</span>
          </span>
        </div>
      </div>

      {/* Info del usuario */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "Usuario"}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-amber-400/20 ring-2 ring-amber-400/30 flex items-center justify-center">
              <span className="text-amber-400 font-semibold text-sm">
                {initials}
              </span>
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-white text-sm font-medium truncate">
              {user.name ?? "Usuario"}
            </p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                isAdmin
                  ? "bg-amber-400/20 text-amber-400"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Links de navegación */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-amber-400/15 text-amber-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Botón de cerrar sesión */}
      <div className="px-4 py-4 border-t border-slate-800">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
