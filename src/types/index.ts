import type { Role } from "../generated/prisma";

// Extiende los tipos de NextAuth en un solo bloque integrado
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: Role;
    };
  }

  interface User {
    id: string;
    role: Role;
  }

  interface JWT {
    id: string;
    role: Role;
  }
}