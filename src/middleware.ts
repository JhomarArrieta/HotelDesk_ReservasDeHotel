import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "ADMIN";

  // Rutas públicas: landing y login
  const isPublicRoute = pathname === "/" || pathname === "/login";

  // Si no está autenticado y quiere entrar al dashboard, redirige al login
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Si está autenticado y quiere ir al login, redirige al dashboard
  if (isLoggedIn && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard/transacciones", req.url));
  }

  // Protege la ruta de usuarios solo para ADMIN
  if (pathname.startsWith("/dashboard/usuarios") && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard/transacciones", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};