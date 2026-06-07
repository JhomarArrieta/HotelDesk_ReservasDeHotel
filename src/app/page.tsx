import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center gap-6 p-8">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-bold text-white tracking-tight">
          Hotel<span className="text-amber-400">Desk</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-md">
          Sistema de administración interna para gestión de reservas y
          habitaciones
        </p>
      </div>

      <Link
        href="/login"
        className="mt-4 px-8 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-amber-400/25 hover:scale-105"
      >
        Iniciar sesión
      </Link>
    </main>
  );
}
