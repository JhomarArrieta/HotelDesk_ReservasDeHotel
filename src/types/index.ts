import type { Role } from "@prisma/client";

// Extiende los tipos de NextAuth para incluir role
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "ADMIN" | "USER";
    };
  }
}
