-- ==============================================
-- DEMADURO DATABASE SCHEMA (PostgreSQL)
-- Refleja la estructura actual del esquema "dema"
-- ==============================================

CREATE SCHEMA IF NOT EXISTS dema;

-- 1. Sedes
CREATE TABLE IF NOT EXISTS dema.sedes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ciudad VARCHAR(25),
    direccion TEXT NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    email_pedidos VARCHAR(100) NOT NULL,
    coordenadas VARCHAR(200), -- formato "lat,lng"
    abreviatura VARCHAR(5) NOT NULL UNIQUE, -- prefijo del código de pedido (ej. ENV-0001)
    consecutivo_pedido INTEGER NOT NULL DEFAULT 0,
    llave_breb VARCHAR(100),
    qr_pago_url VARCHAR(500),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Productos
CREATE TABLE IF NOT EXISTS dema.products (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    categoria VARCHAR(100),
    subcategoria VARCHAR(50), -- variante (ej. "Con tocineta") o grupo de "Arma tu Madurito"
    descripcion TEXT,
    imagen_url VARCHAR(500),
    disponible BOOLEAN DEFAULT TRUE,
    destacado BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Pedidos
CREATE TABLE IF NOT EXISTS dema.orders (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE, -- ej. LAU-0001
    sede_id INTEGER NOT NULL REFERENCES dema.sedes(id),
    tipo_entrega VARCHAR(20) NOT NULL DEFAULT 'domicilio', -- domicilio, recoger
    cliente_nombre VARCHAR(200) NOT NULL,
    cliente_telefono VARCHAR(20) NOT NULL,
    cliente_email VARCHAR(100),
    barrio VARCHAR(100),
    tipo_vivienda VARCHAR(30),
    direccion_entrega TEXT,
    ubicacion_entrega VARCHAR(50),
    distancia_km NUMERIC(4, 1),
    subtotal DECIMAL(10, 2) NOT NULL,
    costo_domicilio DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    soporte_pago VARCHAR(500), -- ruta del comprobante en Cloudflare R2
    metodo_pago VARCHAR(50), -- efectivo, transferencia
    estado VARCHAR(50) DEFAULT 'pendiente', -- pendiente, confirmado, preparando, entregado, cancelado
    notas TEXT,
    token_confirmacion VARCHAR(64) NOT NULL UNIQUE, -- botón "Confirmar pedido" del correo
    confirmado_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Productos de cada pedido (una fila por producto y por complemento)
CREATE TABLE IF NOT EXISTS dema.order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES dema.orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES dema.products(id),
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Usuarios
CREATE TABLE IF NOT EXISTS dema.users (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('admin', 'vendedorTienda')),
    sede_id INTEGER REFERENCES dema.sedes(id) ON DELETE SET NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota'),
    updated_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota')
);

-- 6. Tarifas de domicilio por distancia
CREATE TABLE IF NOT EXISTS dema.tarifas_domicilio (
    distancia_km NUMERIC(4, 1) PRIMARY KEY,
    valor INTEGER NOT NULL
);

-- ==============================================
-- ÍNDICES
-- ==============================================

CREATE INDEX IF NOT EXISTS idx_orders_sede_created ON dema.orders (sede_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_estado ON dema.orders (estado);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON dema.orders (created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON dema.order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_products_disponible ON dema.products (disponible);
CREATE INDEX IF NOT EXISTS idx_products_categoria ON dema.products (categoria);
