import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/rooms — obtiene todas las habitaciones con su creador
export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(rooms);
  } catch (error) {
    console.error("[GET_ROOMS_ERROR]", error);
    return NextResponse.json(
      { error: "Error al obtener habitaciones" },
      { status: 500 },
    );
  }
}

// POST /api/rooms — crea una habitación nueva (solo ADMIN)
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const { name, type, capacity, pricePerNight, balance } = await req.json();

    if (!name || !type || !pricePerNight) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 },
      );
    }

    const room = await prisma.room.create({
      data: {
        name,
        type,
        capacity: capacity ?? 1,
        pricePerNight,
        balance: balance ?? 0,
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error("[POST_ROOMS_ERROR]", error);
    return NextResponse.json(
      { error: "Error al crear habitación" },
      { status: 500 },
    );
  }
}
