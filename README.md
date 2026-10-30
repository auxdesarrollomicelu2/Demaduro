# 🍽️ Demaduro - Sistema de Pedidos a Domicilio

Sistema de pedidos en línea para Demaduro: menú, carrito, checkout y confirmación del pedido por correo a cada sede.

---

## 📁 Estructura del Proyecto

```
Demaduro/
├── api/                   ← BACKEND (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── server.ts      ← Servidor principal
│   │   ├── config/        ← Base de datos, correo (Azure), Cloudflare R2
│   │   ├── models/        ← Modelos Sequelize
│   │   ├── services/      ← Lógica de negocio
│   │   ├── controllers/   ← Controladores HTTP
│   │   ├── routes/        ← Rutas de la API (documentadas en Swagger)
│   │   ├── middleware/    ← Autenticación y carga de archivos
│   │   └── types/         ← Interfaces TypeScript
│   ├── database/
│   │   └── schema.sql     ← Estructura de la base de datos (esquema "dema")
│   └── package.json
│
├── src/                   ← FRONTEND (React + TypeScript + Vite)
│   ├── components/        ← cart, checkout, home, layout, menu, sede, ui
│   ├── context/           ← Estado del carrito
│   ├── hooks/
│   ├── lib/               ← API, carrito, checkout, menú, WhatsApp, mapas
│   ├── pages/
│   ├── assets/
│   └── main.tsx
│
├── public/                ← Archivos públicos (ej. QR de pago en public/qr/)
├── index.html
├── package.json           ← Dependencias del frontend
├── vite.config.ts
└── tailwind.config.js
```

---

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install          # Frontend
cd api && npm install  # Backend
```

### 2. Base de datos

Ejecutar `api/database/schema.sql` en PostgreSQL. Crea el esquema `dema` con sus tablas, relaciones e índices.

### 3. Variables de entorno

Solo existe **un archivo `.env`**, en `api/.env`. **Nunca se sube al repositorio.**

```env
# Servidor
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173

# Base de datos
DB_URL=
DB_SCHEMA=dema

# Autenticación
JWT_SECRET=

# Correo (Azure Communication Services)
AZURE_COMMUNICATION_CONNECTION_STRING=
SENDER_EMAIL=

# Comprobantes de pago (Cloudflare R2)
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_ACCESS_KEY_ID=
CLOUDFLARE_SECRET_ACCESS_KEY=
CLOUDFLARE_BUCKET_NAME=
```

El frontend usa `VITE_API_URL` (URL del backend). En desarrollo no hace falta: por defecto usa `http://localhost:3001`.

---

## 🎯 Ejecutar el Proyecto

**Backend (puerto 3001):**
```bash
cd api
npm run dev
```

**Frontend (puerto 5173):**
```bash
npm run dev
```

---

## 🛠️ Stack Tecnológico

**Frontend:** React 19 + TypeScript, Vite, Tailwind CSS, React Router

**Backend:** Node.js + Express + TypeScript, PostgreSQL (Sequelize), Azure Communication Email, Cloudflare R2

---

## 📦 Scripts

**Frontend:**
- `npm run dev` - Desarrollo
- `npm run build` - Build de producción
- `npm run lint` - Linter

**Backend:**
- `npm run dev` - Desarrollo con recarga automática
- `npm run build` - Compilar TypeScript
- `npm start` - Producción

---

## 🌐 URLs (desarrollo)

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Documentación API (Swagger): http://localhost:3001/api-docs
- Health Check: http://localhost:3001/health
