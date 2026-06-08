import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/bookings?roomId=xxx
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");

    if (!roomId) {
      return NextResponse.json(
        { error: "roomId es requerido" },
        { status: 400 },
      );
    }

    const bookings = await prisma.booking.findMany({
      where: { roomId },
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("[GET_BOOKINGS_ERROR]", error);
    return NextResponse.json(
      { error: "Error al obtener reservas" },
      { status: 500 },
    );
  }
}

// POST /api/bookings
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { roomId, type, nights } = await req.json();

    if (!roomId || !type) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 },
      );
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json(
        { error: "Habitación no encontrada" },
        { status: 404 },
      );
    }

    // Crea el booking
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const booking = await prisma.$transaction(async (tx: any) => {
      const newBooking = await tx.booking.create({
        data: {
          roomId,
          userId: session.user.id,
          type,
          nights: type === "ENTRADA" ? Number(nights) : 0,
        },
        include: {
          user: { select: { name: true, email: true } },
        },
      });

      if (type === "ENTRADA") {
        await tx.room.update({
          where: { id: roomId },
          data: { balance: { increment: Number(nights) } },
        });
      }

      return newBooking;
    });
  } catch (error) {
    console.error("[POST_BOOKING_ERROR]", error);
    return NextResponse.json(
      { error: "Error al crear reserva" },
      { status: 500 },
    );
  }
}
