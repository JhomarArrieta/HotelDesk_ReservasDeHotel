import { PrismaClient } from "@prisma/client/edge";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "admin@hoteldesk.com" },
    update: {},
    create: {
      email: "admin@hoteldesk.com",
      name: "Administrador",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@hoteldesk.com" },
    update: {},
    create: {
      email: "user@hoteldesk.com",
      name: "Recepcionista",
      password: hashedPassword,
      role: "USER",
    },
  });

  console.log("✅ Seed completado");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());