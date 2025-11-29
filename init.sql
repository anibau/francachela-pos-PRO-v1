-- Francachela POS - Inicialización de Base de Datos
-- Este script se ejecuta automáticamente al crear el contenedor de PostgreSQL

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Crear esquemas adicionales si es necesario
-- CREATE SCHEMA IF NOT EXISTS analytics;
-- CREATE SCHEMA IF NOT EXISTS reports;

-- Configurar timezone
SET timezone = 'America/Lima';

-- Configuraciones de rendimiento
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET pg_stat_statements.track = 'all';

-- Crear índices adicionales para optimización (se ejecutarán después de las migraciones)
-- Estos se pueden descomentar después de ejecutar las migraciones

/*
-- Índices para optimización de consultas frecuentes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ventas_fecha ON ventas(fecha);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ventas_cliente_id ON ventas(cliente_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ventas_estado ON ventas(estado);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ventas_metodo_pago ON ventas(metodo_pago);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_productos_codigo_barra ON productos(codigo_barra);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_productos_mostrar ON productos(mostrar);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clientes_dni ON clientes(dni);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clientes_telefono ON clientes(telefono);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clientes_fecha_nacimiento ON clientes(fecha_nacimiento);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gastos_fecha ON gastos(fecha);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gastos_categoria ON gastos(categoria);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_movimientos_inventario_fecha ON movimientos_inventario(hora);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_movimientos_inventario_codigo ON movimientos_inventario(codigo_barra);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_movimientos_inventario_tipo ON movimientos_inventario(tipo);
*/

-- Mensaje de confirmación
SELECT 'Base de datos Francachela POS inicializada correctamente' AS mensaje;

