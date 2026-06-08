<div align="center">

<img src="https://img.shields.io/badge/HotelDesk-Sistema%20de%20Reservas-amber?style=for-the-badge&logo=hotel&logoColor=white" alt="HotelDesk" />

# 🏨 HotelDesk — Sistema de Administración Hotelera

**Plataforma interna para la gestión de reservas, habitaciones y personal de hotel.**

[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://hotel-desk-reservas-de-hotel.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![NextAuth](https://img.shields.io/badge/NextAuth-v5-purple?style=for-the-badge&logo=auth0)](https://authjs.dev/)

🔗 **[Aplicación desplegada](https://hotel-desk-reservas-de-hotel.vercel.app/)**

</div>

---

## 📋 Tabla de contenidos

- [Descripción](#-descripción)
- [Tecnologías](#-tecnologías)
- [Funcionalidades](#-funcionalidades)
- [Roles y permisos](#-roles-y-permisos)
- [Credenciales de prueba](#-credenciales-de-prueba)
- [Cómo ejecutar el proyecto](#-cómo-ejecutar-el-proyecto)
- [Variables de entorno](#-variables-de-entorno)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Integrantes del equipo](#-integrantes-del-equipo)

---

## 📖 Descripción

HotelDesk es una aplicación web de administración interna para hoteles, desarrollada como proyecto final del curso **Ingeniería Web** en la **Universidad de Antioquia**. Permite al personal del hotel gestionar habitaciones, registrar movimientos de reservas (check-in / check-out) y administrar los roles del equipo de trabajo.

El sistema está construido con un enfoque **fullstack** utilizando Next.js 16 con App Router, autenticación con NextAuth v5, base de datos PostgreSQL en Supabase gestionada con Prisma 7, y una interfaz moderna con TailwindCSS 4.

---

## 🛠 Tecnologías

| Categoría | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS 4 |
| ORM | Prisma 7 |
| Base de datos | PostgreSQL (Supabase) |
| Autenticación | NextAuth v5 (Auth.js) |
| Adapter DB | @prisma/adapter-pg |
| Gráficas | Recharts |
| Íconos | Lucide React |
| Deploy | Vercel |

---

## ✨ Funcionalidades

### 🔐 Autenticación
- Página de landing con botón de inicio de sesión
- Login con correo y contraseña (JWT)
- Protección de rutas por rol mediante proxy middleware
- Cierre de sesión desde el sidebar

### 🏠 Gestión de Habitaciones (Maestros)
- Tabla con todas las habitaciones del sistema
- Visualización de ID, nombre, tipo, capacidad, precio por noche, saldo y creador
- Modal para agregar nueva habitación (solo ADMIN)

### 📊 Gestión de Transacciones
- Selector de habitación con saldo actualizado en tiempo real
- Tabla de movimientos con ID, fecha, tipo, noches y responsable
- Modal para registrar check-in (con número de noches) o check-out
- Gráfica de evolución de ocupación acumulada por habitación

### 👥 Gestión de Usuarios (solo ADMIN)
- Tabla con todos los usuarios del sistema
- Visualización de ID, nombre, correo, rol y fecha de creación
- Modal para editar el rol de cualquier usuario

---

## 🔑 Roles y permisos

| Funcionalidad | ADMIN (Gerente) | USER (Recepcionista) |
|---|---|---|
| Ver transacciones | ✅ | ✅ |
| Registrar check-in / check-out | ✅ | ✅ |
| Ver habitaciones | ✅ | ✅ |
| **Crear habitaciones** | ✅ | ❌ |
| **Ver usuarios** | ✅ | ❌ |
| **Editar roles** | ✅ | ❌ |

---

## 🧪 Credenciales de prueba

### Administrador (ADMIN)
```
Correo:     admin@hoteldesk.com
Contraseña: password123
```

### Recepcionista (USER)
```
Correo:     user@hoteldesk.com
Contraseña: password123
```

---

## 🚀 Cómo ejecutar el proyecto

### Prerrequisitos
- Node.js 20+
- npm
- Cuenta en [Supabase](https://supabase.com)

### 1. Clonar el repositorio

```bash
git clone https://github.com/JhomarArrieta/HotelDesk_ReservasDeHotel.git
cd HotelDesk_ReservasDeHotel
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables (ver sección [Variables de entorno](#-variables-de-entorno)).

### 4. Ejecutar la migración de base de datos

```bash
npx prisma migrate dev --name migracion-inicial
```

### 5. Poblar la base de datos con usuarios iniciales

```bash
npx prisma db seed
```

### 6. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🔒 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# URL del pooler de Supabase (puerto 6543) — para la app en producción
DATABASE_URL=""

# URL de conexión directa de Supabase (puerto 5432) — para migraciones
DIRECT_URL=""

# Clave secreta para NextAuth (genera una con: openssl rand -base64 32)
NEXTAUTH_SECRET=""

# URL base de la aplicación
NEXTAUTH_URL="http://localhost:3000"
```


---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Layout con sidebar
│   │   ├── transacciones/page.tsx  # Módulo de reservas
│   │   ├── maestros/page.tsx       # Módulo de habitaciones
│   │   └── usuarios/page.tsx       # Módulo de usuarios
│   ├── api/
│   │   ├── auth/[...nextauth]/     # Config NextAuth
│   │   ├── rooms/                  # GET, POST habitaciones
│   │   ├── bookings/               # GET, POST reservas
│   │   └── users/                  # GET usuarios, PATCH rol
│   ├── login/page.tsx              # Página de login
│   └── page.tsx                    # Landing page
├── components/
│   ├── ui/                         # Button, Modal, Input, Select
│   ├── sidebar/Sidebar.tsx         # Navegación lateral
│   ├── maestros/                   # AddRoomModal
│   ├── transacciones/              # AddBookingModal, OccupancyChart
│   └── usuarios/                   # EditUserModal
├── lib/
│   ├── prisma.ts                   # Singleton PrismaClient
│   └── auth.ts                     # Configuración NextAuth
├── types/
│   └── index.ts                    # Tipos globales TypeScript
└── proxy.ts                        # Protección de rutas por rol
prisma/
├── schema.prisma                   # Modelos de base de datos
├── prisma.config.ts                # Configuración Prisma 7
└── seed.ts                         # Datos iniciales
```

---

## 👨‍💻 Integrantes del equipo

| Nombre | GitHub |
|---|---|
| Jhomar Arrieta | [@JhomarArrieta](https://github.com/JhomarArrieta) |
| Osvairo Moreno | [@Juni110](https://github.com/Juni1110) |

---

<div align="center">

Desarrollado para el curso **Ingeniería Web** — Universidad de Antioquia 2026

</div>
