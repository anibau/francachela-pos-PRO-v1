# Sincronización de Secuencias de Base de Datos

## Problema

Cuando se cargan datos manualmente en PostgreSQL usando herramientas como pgAdmin, las secuencias (sequences) de auto-incremento no se actualizan automáticamente. Esto causa el error:

```
Violación de restricción de clave única/primaria: la llave ya existe
```

Al intentar crear nuevos registros (productos, clientes, etc.), porque el sistema intenta usar IDs que ya existen en la base de datos.

## Solución

### Opción 1: Ejecutar Sincronización desde la API (Recomendado)

Si tienes acceso al endpoint de administración con credenciales de ADMIN:

**Sincronizar todas las secuencias:**
```bash
POST http://localhost:3000/admin/sync-sequences

Headers:
  Authorization: Bearer <tu_token_jwt_admin>
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Todas las secuencias se sincronizaron exitosamente",
  "timestamp": "2025-12-16T10:30:00.000Z"
}
```

### Opción 2: Verificar Estado de Secuencias

Para diagnosticar qué secuencias están desincronizadas:

```bash
GET http://localhost:3000/admin/sequence-status

Headers:
  Authorization: Bearer <tu_token_jwt_admin>
```

**Respuesta:**
```json
{
  "success": true,
  "timestamp": "2025-12-16T10:30:00.000Z",
  "sequences": [
    {
      "table": "productos",
      "maxId": 150,
      "sequenceValue": 100,
      "status": "OUT_OF_SYNC"
    },
    {
      "table": "clientes",
      "maxId": 75,
      "sequenceValue": 76,
      "status": "OK"
    }
  ]
}
```

### Opción 3: Sincronizar Una Tabla Específica

```bash
POST http://localhost:3000/admin/sync-sequence/productos

Headers:
  Authorization: Bearer <tu_token_jwt_admin>
```

### Opción 4: SQL Directo en pgAdmin (Último Recurso)

Si no tienes acceso a la API, ejecuta estos comandos SQL en pgAdmin:

```sql
-- Sincronizar productos
SELECT MAX(id) FROM productos;
ALTER SEQUENCE productos_id_seq RESTART WITH 151;  -- Reemplaza 151 con MAX(id) + 1

-- Sincronizar clientes
SELECT MAX(id) FROM clientes;
ALTER SEQUENCE clientes_id_seq RESTART WITH 76;  -- Reemplaza 76 con MAX(id) + 1

-- Sincronizar todas las tablas principales
ALTER SEQUENCE productos_id_seq RESTART WITH (SELECT MAX(id) + 1 FROM productos);
ALTER SEQUENCE clientes_id_seq RESTART WITH (SELECT MAX(id) + 1 FROM clientes);
ALTER SEQUENCE usuarios_id_seq RESTART WITH (SELECT MAX(id) + 1 FROM usuarios);
ALTER SEQUENCE ventas_id_seq RESTART WITH (SELECT MAX(id) + 1 FROM ventas);
ALTER SEQUENCE gastos_id_seq RESTART WITH (SELECT MAX(id) + 1 FROM gastos);
ALTER SEQUENCE combos_id_seq RESTART WITH (SELECT MAX(id) + 1 FROM combos);
ALTER SEQUENCE cajas_id_seq RESTART WITH (SELECT MAX(id) + 1 FROM cajas);
ALTER SEQUENCE delivery_id_seq RESTART WITH (SELECT MAX(id) + 1 FROM delivery);
ALTER SEQUENCE promociones_id_seq RESTART WITH (SELECT MAX(id) + 1 FROM promociones);
ALTER SEQUENCE movimientos_inventario_id_seq RESTART WITH (SELECT MAX(id) + 1 FROM movimientos_inventario);
ALTER SEQUENCE venta_pagos_id_seq RESTART WITH (SELECT MAX(id) + 1 FROM venta_pagos);
```

## Flujo de Trabajo Recomendado

1. **Después de cargar datos manualmente:**
   ```bash
   # Verificar estado
   curl -X GET http://localhost:3000/admin/sequence-status \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

2. **Si hay secuencias desincronizadas:**
   ```bash
   # Ejecutar sincronización
   curl -X POST http://localhost:3000/admin/sync-sequences \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

3. **Verificar nuevamente:**
   ```bash
   curl -X GET http://localhost:3000/admin/sequence-status \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

4. **Intentar crear un nuevo registro** (producto, cliente, etc.)

## Mensajes de Error y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `Error al generar ID. Por favor ejecute la sincronización de secuencias` | Secuencia desincronizada | Ejecutar `POST /admin/sync-sequences` |
| `violación de restricción de clave única` | Secuencia fuera de rango | Verificar con `GET /admin/sequence-status` y sincronizar |
| `El DNI ya está registrado` | Cliente duplicado en datos cargados | Verificar datos en BD antes de cargar |
| `El código de barras ya existe` | Producto duplicado en datos cargados | Verificar datos en BD antes de cargar |

## Precauciones

- ⚠️ **No usar** `ALTER SEQUENCE ... RESTART WITH 1` ya que sobrescribirá IDs existentes
- ⚠️ **Siempre** usar `MAX(id) + 1` como nuevo valor inicial
- ⚠️ **Realizar copia de seguridad** antes de ejecutar comandos SQL directos
- ✅ **Usar** el endpoint de la API (`/admin/sync-sequences`) es más seguro

## Automatización

Para automatizar la sincronización después de cargas iniciales, considera:

1. Crear un script de inicialización que ejecute la sincronización
2. Usar migraciones de TypeORM con eventos de sincronización
3. Ejecutar un job programado que valide secuencias periódicamente
