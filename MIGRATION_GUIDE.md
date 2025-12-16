# 🚀 Guía de Migración - Normalización de Pagos

## 📋 Resumen

Esta guía documenta el proceso de migración para la **normalización de pagos** del sistema POS Francachela, que forma parte del refactoring crítico del backend (Fases 1-10).

### 🎯 Objetivo

Migrar de un sistema de pagos basado en JSONB a una estructura relacional normalizada que mejora:
- ✅ **Rendimiento**: Consultas SQL optimizadas vs parsing JSONB
- ✅ **Escalabilidad**: Soporte para 100k+ ventas sin degradación
- ✅ **Integridad**: Validación financiera automática
- ✅ **Auditabilidad**: Trazabilidad completa de cada pago

## 🏗️ Arquitectura Antes vs Después

### ❌ ANTES (Problemático)
```sql
-- Tabla ventas con JSONB
CREATE TABLE ventas (
  id SERIAL PRIMARY KEY,
  metodoPago VARCHAR(20),           -- Un solo método
  metodosPageoUsados JSONB,         -- Múltiples métodos (no normalizado)
  total DECIMAL(10,2)
);

-- Consulta ineficiente
SELECT 
  jsonb_array_elements(metodosPageoUsados)->>'metodoPago' as metodo,
  SUM((jsonb_array_elements(metodosPageoUsados)->>'monto')::decimal) as total
FROM ventas 
GROUP BY metodo;  -- O(n) parsing
```

### ✅ DESPUÉS (Optimizado)
```sql
-- Tabla ventas normalizada
CREATE TABLE ventas (
  id SERIAL PRIMARY KEY,
  metodoPago VARCHAR(20),           -- Mantener para compatibilidad
  recargoExtra DECIMAL(10,2),       -- Nuevo campo
  total DECIMAL(10,2)               -- total = subTotal - descuento + recargoExtra
);

-- Nueva tabla normalizada
CREATE TABLE venta_pagos (
  id SERIAL PRIMARY KEY,
  ventaId INTEGER REFERENCES ventas(id),
  metodoPago VARCHAR(20),
  monto DECIMAL(10,2),
  referencia VARCHAR(100),
  estado VARCHAR(20) DEFAULT 'COMPLETADO',
  registradoPor VARCHAR(100),
  fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  secuencia INTEGER DEFAULT 1
);

-- Consulta optimizada
SELECT 
  metodoPago,
  COUNT(*) as cantidad,
  SUM(monto) as total
FROM venta_pagos 
WHERE estado = 'COMPLETADO'
GROUP BY metodoPago;  -- O(1) con índices
```

## 📦 Archivos de Migración

### 1. `1734278400000-CreateVentaPagoTable.ts`
- ✅ Crea tabla `venta_pagos` con estructura normalizada
- ✅ Establece foreign key hacia `ventas`
- ✅ Crea índices optimizados para consultas de estadísticas

### 2. `1734278500000-AddVentaNewFields.ts`
- ✅ Agrega campo `recargoExtra` a tabla `ventas`
- ✅ Agrega campo `estadoVenta` (si no existe)
- ✅ Actualiza fórmula de cálculo de total

### 3. `1734278600000-MigrateExistingPayments.ts`
- ✅ Migra pagos existentes desde `metodoPago` legacy
- ✅ Migra pagos múltiples desde `metodosPageoUsados` JSONB
- ✅ Genera estadísticas de migración

## 🚀 Proceso de Ejecución

### Opción 1: Script Automatizado (Recomendado)
```bash
# Ejecutar script completo con validaciones
./scripts/run-migrations.sh
```

### Opción 2: Migraciones Manuales
```bash
# 1. Verificar configuración
npm run typeorm:migration:show

# 2. Ejecutar migraciones en orden
npm run typeorm:migration:run -- --migration="CreateVentaPagoTable1734278400000"
npm run typeorm:migration:run -- --migration="AddVentaNewFields1734278500000"
npm run typeorm:migration:run -- --migration="MigrateExistingPayments1734278600000"

# 3. Verificar estado
npm run typeorm:migration:show
```

## 📊 Validación Post-Migración

### Consultas de Verificación

```sql
-- 1. Verificar que todas las ventas tienen pagos normalizados
SELECT 
  COUNT(*) as total_ventas,
  COUNT(DISTINCT vp.ventaId) as ventas_con_pagos,
  ROUND((COUNT(DISTINCT vp.ventaId)::decimal / COUNT(*)) * 100, 2) as cobertura_pct
FROM ventas v
LEFT JOIN venta_pagos vp ON v.id = vp.ventaId
WHERE v.estado = 'COMPLETADO';

-- 2. Verificar integridad financiera
SELECT 
  v.id,
  v.total as total_venta,
  COALESCE(SUM(vp.monto), 0) as suma_pagos,
  ABS(v.total - COALESCE(SUM(vp.monto), 0)) as diferencia
FROM ventas v
LEFT JOIN venta_pagos vp ON v.id = vp.ventaId AND vp.estado = 'COMPLETADO'
WHERE v.estado = 'COMPLETADO'
GROUP BY v.id, v.total
HAVING ABS(v.total - COALESCE(SUM(vp.monto), 0)) > 0.01
ORDER BY diferencia DESC;

-- 3. Estadísticas de métodos de pago
SELECT 
  metodoPago,
  COUNT(*) as cantidad_transacciones,
  COUNT(DISTINCT ventaId) as ventas_unicas,
  SUM(monto) as monto_total,
  AVG(monto) as monto_promedio
FROM venta_pagos 
WHERE estado = 'COMPLETADO'
GROUP BY metodoPago
ORDER BY monto_total DESC;
```

### Métricas de Rendimiento

```sql
-- Comparar rendimiento antes vs después
EXPLAIN ANALYZE
SELECT 
  metodoPago,
  COUNT(DISTINCT ventaId) as ventas,
  SUM(monto) as total
FROM venta_pagos 
WHERE fechaRegistro >= '2024-01-01'
  AND estado = 'COMPLETADO'
GROUP BY metodoPago;
```

## 🔄 Rollback (Si es necesario)

### Rollback Automático
```bash
# Revertir todas las migraciones
npm run typeorm:migration:revert -- --migration="MigrateExistingPayments1734278600000"
npm run typeorm:migration:revert -- --migration="AddVentaNewFields1734278500000"
npm run typeorm:migration:revert -- --migration="CreateVentaPagoTable1734278400000"
```

### Rollback Manual
```sql
-- 1. Eliminar datos migrados
DELETE FROM venta_pagos WHERE registradoPor = 'SISTEMA_MIGRACION';

-- 2. Eliminar tabla (si es necesario)
DROP TABLE IF EXISTS venta_pagos CASCADE;

-- 3. Eliminar campos agregados
ALTER TABLE ventas DROP COLUMN IF EXISTS recargoExtra;
```

## ⚠️ Consideraciones Importantes

### Antes de la Migración
1. **Backup Obligatorio**: Crear backup completo de la base de datos
2. **Ventana de Mantenimiento**: Planificar downtime durante migración
3. **Validar Datos**: Verificar integridad de datos existentes
4. **Recursos**: Asegurar espacio suficiente en disco

### Durante la Migración
1. **Monitoreo**: Supervisar logs de migración
2. **Tiempo**: La migración puede tomar varios minutos con muchos datos
3. **Conexiones**: Evitar operaciones concurrentes en la base de datos

### Después de la Migración
1. **Validación**: Ejecutar consultas de verificación
2. **Pruebas**: Probar endpoints de estadísticas
3. **Monitoreo**: Supervisar rendimiento de consultas
4. **Cleanup**: Limpiar archivos de backup antiguos

## 📈 Beneficios Esperados

### Rendimiento
- **Consultas de estadísticas**: 50-400x más rápidas
- **Dashboard**: Carga instantánea vs 10+ segundos
- **Reportes**: Generación sub-segundo vs minutos

### Escalabilidad
- **100k+ ventas**: Sin degradación de rendimiento
- **Consultas concurrentes**: Mejor manejo de carga
- **Índices optimizados**: Consultas eficientes

### Mantenibilidad
- **Código limpio**: Eliminación de parsing JSONB
- **Debugging**: Consultas SQL estándar
- **Extensibilidad**: Fácil agregar nuevos campos

## 🆘 Solución de Problemas

### Error: "Tabla ventas no encontrada"
```bash
# Verificar conexión a base de datos
npm run typeorm:query -- "SELECT version();"

# Verificar configuración
cat .env | grep DB_
```

### Error: "Foreign key constraint"
```bash
# Verificar integridad referencial
SELECT COUNT(*) FROM ventas WHERE id NOT IN (SELECT DISTINCT ventaId FROM venta_pagos WHERE ventaId IS NOT NULL);
```

### Error: "Diferencias en montos"
```sql
-- Identificar ventas con diferencias
SELECT v.id, v.total, SUM(vp.monto) as suma_pagos
FROM ventas v
JOIN venta_pagos vp ON v.id = vp.ventaId
GROUP BY v.id, v.total
HAVING ABS(v.total - SUM(vp.monto)) > 0.01;
```

## 📞 Soporte

Para problemas durante la migración:
1. Revisar logs de migración
2. Ejecutar consultas de validación
3. Verificar configuración de base de datos
4. Contactar al equipo de desarrollo

---

**Desarrollado como parte del refactoring crítico del backend - Fases 1-10**
**Sistema POS Francachela - Normalización de Pagos**

