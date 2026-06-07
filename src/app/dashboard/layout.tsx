import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "../../components/sidebar/Sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Obtiene la sesión del servidor — si no hay sesión, redirige al login
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar user={session.user} />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
