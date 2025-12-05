# 🚀 GUÍA COMPLETA: Testing de Ventas y WhatsApp en Francachela POS

## 📋 Índice
1. [Análisis del Proyecto](#análisis-del-proyecto)
2. [Diagnóstico del Error 500](#diagnóstico-del-error-500)
3. [Estructura del Módulo de Ventas](#estructura-del-módulo-de-ventas)
4. [Guía de Testing Local](#guía-de-testing-local)
5. [Integración WhatsApp](#integración-whatsapp)
6. [Troubleshooting](#troubleshooting)

---

## 📊 Análisis del Proyecto

### Arquitectura General
```
Francachela POS Backend
├── NestJS 11.0.1 (Framework)
├── TypeORM 0.3.27 (ORM)
├── PostgreSQL (Base de datos)
├── Baileys 6.6.10 (WhatsApp)
└── Swagger (Documentación API)
```

### Stack Tecnológico
| Tecnología | Versión | Propósito |
|------------|---------|----------|
| @nestjs/core | 11.0.1 | Framework principal |
| @nestjs/typeorm | 11.0.0 | ORM |
| typeorm | 0.3.27 | Gestión de BD |
| @whiskeysockets/baileys | 6.6.10 | Integración WhatsApp |
| pg | 8.16.3 | Driver PostgreSQL |
| class-validator | 0.14.3 | Validación de DTOs |

---

## 🔴 Diagnóstico del Error 500

### Causas Posibles del Error

| Causa | Síntomas | Solución |
|-------|----------|----------|
| **Cliente no existe** | 404 en BD | Verificar que el `clienteId` existe |
| **Producto sin stock** | `BadRequestException` | Validar `producto.usaInventario` |
| **Producto no existe** | `NotFoundException` | Verificar `productoId` válido |
| **Total negativo** | `BadRequestException` | Revisar descuentos aplicados |
| **Error en DB** | Error de conexión | Verificar PostgreSQL está corriendo |
| **Falta de relaciones en Entity** | Lazy loading error | Verificar `eager: true` en relaciones |

### Logs a Revisar
```bash
# En terminal de NestJS
[Nest] PID - HH:MM:SS - ERROR [VentasService] Error al crear venta: ...
```

---

## 🏗️ Estructura del Módulo de Ventas

### Flujo de Creación de Venta

```
POST /ventas
    ↓
[VentasController.create]
    ↓
[VentasService.create]
    ├─→ Validar Cliente (si existe clienteId)
    ├─→ Validar Productos
    │   ├─→ Verificar Stock
    │   └─→ Calcular Totales
    ├─→ Calcular Descuentos y Puntos
    ├─→ Generar Ticket ID
    ├─→ Guardar Venta en BD
    ├─→ Descontar Stock de Productos
    ├─→ Actualizar Puntos del Cliente
    └─→ Retornar Venta Guardada
```

### Entidades Relacionadas
```
Venta (Principal)
├── Cliente (Relación ManyToOne - nullable)
├── listaProductos (JSON Array)
│   ├── productoId
│   ├── codigoBarra
│   ├── descripcion
│   ├── cantidad
│   ├── precioUnitario
│   └── subtotal
└── Auditoría
    ├── cajero (usuario que creó)
    ├── fechaCreacion
    └── fechaActualizacion
```

### DTOs y Validaciones

**CreateVentaDto:**
```typescript
{
  clienteId?: number;              // Opcional
  listaProductos: ItemVentaDto[];  // Requerido (mín. 1)
  descuento?: number;               // Opcional (default: 0)
  metodoPago: MetodoPago;          // Requerido (EFECTIVO, YAPE, PLIN, TARJETA)
  comentario?: string;              // Opcional
  tipoCompra?: TipoCompra;         // Opcional (LOCAL, DELIVERY)
  montoRecibido?: number;          // Opcional
  puntosUsados?: number;           // Opcional (default: 0)
}

ItemVentaDto:
{
  productoId: number;              // Requerido
  cantidad: number;                // Requerido (mín. 1)
  precioUnitario?: number;         // Opcional (usa precio del producto si no)
}
```

---

## 🧪 GUÍA DE TESTING LOCAL

### Paso 1: Preparar el Entorno

#### 1.1 Verificar que PostgreSQL está ejecutándose
```powershell
# Windows - Verificar servicio PostgreSQL
Get-Service postgresql* | Format-Table Name, Status

# Si no está corriendo
Start-Service postgresql-x64-<version>
```

#### 1.2 Verificar conexión a BD
```bash
psql -U postgres -d francachela_pos -c "SELECT VERSION();"
```

#### 1.3 Ejecutar migraciones (si es necesario)
```bash
npm run migration:run
```

### Paso 2: Iniciar la Aplicación

```bash
# En terminal PowerShell
cd "C:\PROYECTS\MBT\francachela-pos-PRO-v1"

# Modo desarrollo con watch
npm run start:dev

# Deberías ver:
# ✓ [Nest] PID - HH:MM:SS LOG [NestApplication] Nest application successfully started
# 🚀 Aplicación ejecutándose en: http://localhost:3000
```

### Paso 3: Crear Datos de Prueba

#### 3.1 Crear Usuario (Cajero)
```bash
POST http://localhost:3000/users
Content-Type: application/json

{
  "username": "cajero_test",
  "password": "Test123456!",
  "email": "cajero@francachela.com",
  "nombre": "Juan Cajero",
  "rol": "CAJERO"
}
```

**Respuesta esperada:**
```json
{
  "id": 1,
  "username": "cajero_test",
  "email": "cajero@francachela.com",
  "nombre": "Juan Cajero",
  "rol": "CAJERO"
}
```

#### 3.2 Login para obtener JWT Token
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "username": "cajero_test",
  "password": "Test123456!"
}
```

**Respuesta esperada:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "cajero_test",
    "rol": "CAJERO"
  }
}
```

**⚠️ IMPORTANTE:** Guarda este token `access_token` para los próximos requests.

#### 3.3 Crear Productos
```bash
POST http://localhost:3000/productos
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
  "productoDescripcion": "Cerveza Arequipeña 350ml",
  "codigoBarra": "7891234567890",
  "precio": 6.00,
  "costo": 3.00,
  "cantidadActual": 100,
  "cantidadMinima": 10,
  "usaInventario": true,
  "precioMayorista": 5.50,
  "categoria": "Bebidas",
  "valorPuntos": 1,
  "activo": true
}
```

**Guarda el ID del producto (ejemplo: 1)**

#### 3.4 Crear Cliente (Opcional pero Recomendado)
```bash
POST http://localhost:3000/clientes
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
  "nombres": "Juan",
  "apellidos": "Pérez García",
  "dni": "12345678",
  "telefono": "987654321",
  "email": "juan.perez@example.com",
  "direccion": "Jr. Principal 123, Lima",
  "codigoCorto": "JP001",
  "cumpleaños": "1990-05-15",
  "activo": true
}
```

**Guarda el ID del cliente (ejemplo: 1)**

### Paso 4: Crear Primera Venta

#### 4.1 Request para Crear Venta

```bash
POST http://localhost:3000/ventas
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
  "clienteId": 1,
  "listaProductos": [
    {
      "productoId": 1,
      "cantidad": 3,
      "precioUnitario": 6.00
    }
  ],
  "descuento": 0,
  "metodoPago": "EFECTIVO",
  "tipoCompra": "LOCAL",
  "montoRecibido": 20.00,
  "comentario": "Cliente preferente",
  "puntosUsados": 0
}
```

#### 4.2 Respuesta Esperada (Código 201)

```json
{
  "id": 1,
  "fecha": "2024-12-05T14:30:00.000Z",
  "ticketId": "20241205-0001",
  "cliente": {
    "id": 1,
    "nombres": "Juan",
    "apellidos": "Pérez García",
    "puntosAcumulados": 18,
    "telefono": "987654321"
  },
  "listaProductos": [
    {
      "productoId": 1,
      "codigoBarra": "7891234567890",
      "descripcion": "Cerveza Arequipeña 350ml",
      "cantidad": 3,
      "precioUnitario": 6.00,
      "subtotal": 18.00,
      "valorPuntos": 1
    }
  ],
  "subTotal": 18.00,
  "descuento": 0,
  "total": 18.00,
  "metodoPago": "EFECTIVO",
  "cajero": "cajero_test",
  "estado": "COMPLETADO",
  "puntosOtorgados": 18,
  "puntosUsados": 0,
  "tipoCompra": "LOCAL",
  "montoRecibido": 20.00,
  "vuelto": 2.00,
  "fechaCreacion": "2024-12-05T14:30:00.000Z"
}
```

### Paso 5: Verificar la Venta

```bash
GET http://localhost:3000/ventas/1
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Paso 6: Listar Todas las Ventas

```bash
GET http://localhost:3000/ventas?page=1&limit=10
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Paso 7: Obtener Ventas del Día

```bash
GET http://localhost:3000/ventas/hoy
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 📱 INTEGRACIÓN WhatsApp

### Paso 1: Verificar Estado de Conexión

```bash
GET http://localhost:3000/whatsapp/status
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Respuesta esperada:**
```json
{
  "connected": false,
  "phone": null
}
```

Si `connected` es `false`, necesitas conectar WhatsApp primero.

### Paso 2: Obtener Código QR

```bash
GET http://localhost:3000/whatsapp/qr
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**⚠️ Verifica la consola del servidor NestJS para ver el código QR**

El código QR aparecerá en terminal así:
```
[Nest] PID - HH:MM:SS LOG [WhatsappService] Escanea el código QR para conectar WhatsApp
```

### Paso 3: Escanear QR con WhatsApp

1. Abre WhatsApp en tu teléfono
2. Ve a Configuración > Dispositivos vinculados > Vincular dispositivo
3. Escanea el código QR que aparece en la consola
4. Confirma la conexión

### Paso 4: Verificar Conexión Establecida

Espera 30 segundos y luego:

```bash
GET http://localhost:3000/whatsapp/status
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Respuesta esperada cuando está conectado:**
```json
{
  "connected": true,
  "phone": "51987654321"
}
```

### Paso 5: Enviar Mensaje de Prueba

```bash
POST http://localhost:3000/whatsapp/send
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
  "phone": "51987654321",
  "message": "¡Hola! Este es un mensaje de prueba desde Francachela POS"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "messageId": "ABC123DEF456"
}
```

---

## 🔗 FLUJO COMPLETO: Venta + Notificación WhatsApp

### Opción A: Envío Manual Después de Crear Venta

#### 1. Crear venta (como se mostró antes)

#### 2. Enviar notificación manualmente

```bash
POST http://localhost:3000/whatsapp/send-venta
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
  "phone": "51987654321",
  "total": 18.00,
  "puntosGanados": 18,
  "ventaId": 1
}
```

**Mensaje que recibe el cliente en WhatsApp:**
```
🍻 ¡Gracias por tu compra en Francachela!

💰 Total: S/ 18.00
⭐ Puntos ganados: 18
🎫 Ticket #20241205-0001

¡Vuelve pronto y sigue acumulando puntos! 🎉
```

### Opción B: Envío Automático (Recomendado)

**Modificar VentasService para enviar automáticamente:**

En `src/modulos/ventas/ventas.service.ts`, al final del método `create()`:

```typescript
// Enviar notificación WhatsApp si el cliente tiene teléfono
if (cliente && cliente.telefono && ventaGuardada.cliente) {
  try {
    await this.whatsappService.sendVentaNotification(
      cliente.telefono,
      ventaGuardada.total,
      ventaGuardada.puntosOtorgados,
      ventaGuardada.id
    );
  } catch (error) {
    this.logger.warn(`No se pudo enviar WhatsApp al cliente: ${error.message}`);
    // No lanzar error, solo loguear advertencia
  }
}

return this.findById(ventaGuardada.id);
```

Necesitarás inyectar `WhatsappService` en el constructor:

```typescript
constructor(
  @InjectRepository(Venta)
  private ventaRepository: Repository<Venta>,
  @InjectRepository(Cliente)
  private clienteRepository: Repository<Cliente>,
  private productosService: ProductosService,
  private clientesService: ClientesService,
  private whatsappService: WhatsappService,  // AGREGAR
) {}
```

Y agregar `WhatsappModule` a las importaciones del `VentasModule`:

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, Cliente]),
    ProductosModule,
    ClientesModule,
    WhatsappModule,  // AGREGAR
  ],
  // ...
})
```

---

## 🆘 TROUBLESHOOTING

### Error 500 al Crear Venta

#### "Cannot find module or undefined property"
**Causa:** Cliente o Producto no existe
**Solución:**
```bash
# Verificar cliente
GET http://localhost:3000/clientes/1
Authorization: Bearer YOUR_ACCESS_TOKEN

# Verificar producto
GET http://localhost:3000/productos/1
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### "Stock insuficiente"
**Causa:** No hay suficiente inventario
**Solución:** Aumentar stock del producto
```bash
PATCH http://localhost:3000/productos/1/stock
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
  "cantidad": 50,
  "tipo": "ENTRADA"
}
```

#### "El total no puede ser negativo"
**Causa:** Descuento es mayor que subtotal
**Solución:** Reducir el descuento o aumentar cantidades

#### "Unexpected token < in JSON"
**Causa:** Respuesta es HTML (error de servidor)
**Solución:**
1. Verificar logs del servidor
2. Verificar que PostgreSQL está corriendo
3. Verificar que el token JWT es válido

### Error 401 Unauthorized

**Causa:** Token JWT inválido o expirado
**Solución:**
```bash
# Hacer login nuevamente
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "username": "cajero_test",
  "password": "Test123456!"
}

# Usar el nuevo token
```

### WhatsApp muestra "No está conectado"

**Causa:** No se escaneó el QR o sesión expiró
**Solución:**
```bash
# Desconectar
DELETE http://localhost:3000/whatsapp/logout
Authorization: Bearer YOUR_ACCESS_TOKEN

# Esperar 5 segundos

# Obtener nuevo QR
GET http://localhost:3000/whatsapp/qr
Authorization: Bearer YOUR_ACCESS_TOKEN

# Escanear nuevamente
```

### Base de datos sin datos de prueba

```bash
# Ejecutar seeder
npm run seed:dev
```

---

## 📊 Ejemplos Completos de Requests en Postman

### Collection JSON

Copia y pega en Postman → File → Import → Paste Raw Text:

```json
{
  "info": {
    "name": "Francachela POS - Ventas & WhatsApp",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Login",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/auth/login",
        "body": {
          "mode": "raw",
          "raw": "{\"username\": \"cajero_test\", \"password\": \"Test123456!\"}"
        }
      }
    },
    {
      "name": "2. Crear Venta",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/ventas",
        "auth": {"bearer": "{{token}}"},
        "body": {
          "mode": "raw",
          "raw": "{\"clienteId\": 1, \"listaProductos\": [{\"productoId\": 1, \"cantidad\": 3}], \"metodoPago\": \"EFECTIVO\"}"
        }
      }
    },
    {
      "name": "3. Obtener Estado WhatsApp",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/whatsapp/status",
        "auth": {"bearer": "{{token}}"}
      }
    },
    {
      "name": "4. Enviar Notificación WhatsApp",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/whatsapp/send-venta",
        "auth": {"bearer": "{{token}}"},
        "body": {
          "mode": "raw",
          "raw": "{\"phone\": \"51987654321\", \"total\": 18.00, \"puntosGanados\": 18, \"ventaId\": 1}"
        }
      }
    }
  ]
}
```

---

## ✅ CHECKLIST DE VALIDACIÓN

- [ ] PostgreSQL está ejecutándose
- [ ] El servidor NestJS está corriendo en `http://localhost:3000`
- [ ] Swagger está accesible en `http://localhost:3000/api`
- [ ] Usuario (Cajero) fue creado
- [ ] Token JWT fue obtenido
- [ ] Producto(s) fueron creados
- [ ] Cliente(s) fueron creados (opcional pero recomendado)
- [ ] Primera venta fue creada exitosamente
- [ ] WhatsApp fue conectado escaneando QR
- [ ] Mensaje de prueba fue enviado
- [ ] Notificación de venta fue enviada

---

## 🔗 URLs Útiles

| Recurso | URL |
|---------|-----|
| **API Principal** | http://localhost:3000 |
| **Swagger UI** | http://localhost:3000/api |
| **Swagger JSON** | http://localhost:3000/api-json |
| **GraphQL** | http://localhost:3000/graphql (si está habilitado) |

---

## 📝 Notas Importantes

1. **Cambio de Baileys:** Se migró de `7.0.0-rc.9` a `6.6.10` (versión estable) para resolver problemas del logger
2. **WhatsApp es opcional:** Si no tienes conexión WhatsApp, las ventas se crean correctamente sin problemas
3. **Transacciones:** Cada creación de venta es transaccional y rollback automático si hay error
4. **Auditoría:** Todas las acciones quedan registradas con usuario y timestamp
5. **Puntos:** Se calculan automáticamente (1 punto = S/ 1.00 gastado)

---

## 🆘 Soporte Técnico

Si persisten errores después de seguir esta guía:

1. **Revisar logs completos:** `npm run start:dev` muestra todos los errores
2. **Verificar BD:** `psql -U postgres -d francachela_pos -c "\dt"`
3. **Clear cache:** `rm -r dist node_modules && npm install`
4. **Reiniciar servidor:** Ctrl+C en terminal → `npm run start:dev`

