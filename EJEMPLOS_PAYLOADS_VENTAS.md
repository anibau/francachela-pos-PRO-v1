# 📋 EJEMPLOS DE PAYLOADS: Creación de Ventas en Francachela POS

## 🔑 Requisitos Previos

### 1. Obtener Token JWT
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "username": "cajero_test",
  "password": "Test123456!"
}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiY2FqZXJvX3Rlc3QiLCJyb2wiOiJDQUpFUk8iLCJpYXQiOjE3MzMzODc2MDB9...",
  "user": {
    "id": 1,
    "username": "cajero_test",
    "rol": "CAJERO"
  }
}
```

Guarda el `access_token` para los siguientes requests.

---

## 💰 EJEMPLO 1: Venta Básica Sin Cliente

**Caso de Uso:** Cliente anónimo, pago en efectivo, sin puntos.

```bash
POST http://localhost:3000/ventas
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Payload:**
```json
{
  "listaProductos": [
    {
      "productoId": 1,
      "cantidad": 2
    },
    {
      "productoId": 3,
      "cantidad": 1
    }
  ],
  "metodoPago": "EFECTIVO",
  "montoRecibido": 50.00
}
```

**Respuesta (201 Created):**
```json
{
  "id": 1,
  "fecha": "2024-12-05T15:30:45.123Z",
  "ticketId": "20241205-0001",
  "cliente": null,
  "listaProductos": [
    {
      "productoId": 1,
      "codigoBarra": "7891234567890",
      "descripcion": "Cerveza Arequipeña 350ml",
      "cantidad": 2,
      "precioUnitario": 6.00,
      "subtotal": 12.00,
      "valorPuntos": 1
    },
    {
      "productoId": 3,
      "codigoBarra": "7891234567891",
      "descripcion": "Chicha Morada 500ml",
      "cantidad": 1,
      "precioUnitario": 8.00,
      "subtotal": 8.00,
      "valorPuntos": 2
    }
  ],
  "subTotal": 20.00,
  "descuento": 0,
  "total": 20.00,
  "metodoPago": "EFECTIVO",
  "cajero": "cajero_test",
  "estado": "COMPLETADO",
  "puntosOtorgados": 0,
  "puntosUsados": 0,
  "tipoCompra": "LOCAL",
  "montoRecibido": 50.00,
  "vuelto": 30.00,
  "fechaCreacion": "2024-12-05T15:30:45.123Z"
}
```

---

## 👥 EJEMPLO 2: Venta Con Cliente y Puntos Acumulados

**Caso de Uso:** Cliente registrado, acumula puntos, pago por Yape.

```bash
POST http://localhost:3000/ventas
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Payload:**
```json
{
  "clienteId": 5,
  "listaProductos": [
    {
      "productoId": 2,
      "cantidad": 3
    },
    {
      "productoId": 4,
      "cantidad": 2
    }
  ],
  "descuento": 0,
  "metodoPago": "YAPE",
  "tipoCompra": "LOCAL",
  "comentario": "Cliente preferente - promoción especial",
  "puntosUsados": 0
}
```

**Respuesta (201 Created):**
```json
{
  "id": 2,
  "fecha": "2024-12-05T15:35:22.456Z",
  "ticketId": "20241205-0002",
  "cliente": {
    "id": 5,
    "nombres": "Carlos",
    "apellidos": "López Mendoza",
    "dni": "87654321",
    "telefono": "987654321",
    "email": "carlos.lopez@example.com",
    "puntosAcumulados": 58,
    "codigoCorto": "CLM001"
  },
  "listaProductos": [
    {
      "productoId": 2,
      "codigoBarra": "7891234567892",
      "descripcion": "Cerveza Negra 375ml",
      "cantidad": 3,
      "precioUnitario": 7.50,
      "subtotal": 22.50,
      "valorPuntos": 1
    },
    {
      "productoId": 4,
      "codigoBarra": "7891234567893",
      "descripcion": "Refresco Inca Kola 500ml",
      "cantidad": 2,
      "precioUnitario": 5.00,
      "subtotal": 10.00,
      "valorPuntos": 0
    }
  ],
  "subTotal": 32.50,
  "descuento": 0,
  "total": 32.50,
  "metodoPago": "YAPE",
  "cajero": "cajero_test",
  "estado": "COMPLETADO",
  "puntosOtorgados": 32,
  "puntosUsados": 0,
  "tipoCompra": "LOCAL",
  "montoRecibido": 32.50,
  "vuelto": 0,
  "fechaCreacion": "2024-12-05T15:35:22.456Z"
}
```

**📱 Notificación WhatsApp Enviada Automáticamente:**
```
🍻 ¡Gracias por tu compra en Francachela!

💰 Total: S/ 32.50
⭐ Puntos ganados: 32
🎫 Ticket #20241205-0002

¡Vuelve pronto y sigue acumulando puntos! 🎉
```

---

## 🎁 EJEMPLO 3: Venta Con Descuento Manual

**Caso de Uso:** Cliente con descuento especial (aniversario, promoción, etc.).

```bash
POST http://localhost:3000/ventas
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Payload:**
```json
{
  "clienteId": 10,
  "listaProductos": [
    {
      "productoId": 1,
      "cantidad": 6
    }
  ],
  "descuento": 5.00,
  "metodoPago": "EFECTIVO",
  "tipoCompra": "LOCAL",
  "montoRecibido": 40.00,
  "comentario": "Descuento por cumpleaños - 5% OFF",
  "puntosUsados": 0
}
```

**Respuesta (201 Created):**
```json
{
  "id": 3,
  "fecha": "2024-12-05T16:00:10.789Z",
  "ticketId": "20241205-0003",
  "cliente": {
    "id": 10,
    "nombres": "Rosa",
    "apellidos": "García Flores",
    "telefono": "998765432",
    "puntosAcumulados": 120
  },
  "listaProductos": [
    {
      "productoId": 1,
      "codigoBarra": "7891234567890",
      "descripcion": "Cerveza Arequipeña 350ml",
      "cantidad": 6,
      "precioUnitario": 6.00,
      "subtotal": 36.00,
      "valorPuntos": 1
    }
  ],
  "subTotal": 36.00,
  "descuento": 5.00,
  "total": 31.00,
  "metodoPago": "EFECTIVO",
  "cajero": "cajero_test",
  "estado": "COMPLETADO",
  "puntosOtorgados": 31,
  "puntosUsados": 0,
  "tipoCompra": "LOCAL",
  "montoRecibido": 40.00,
  "vuelto": 9.00,
  "fechaCreacion": "2024-12-05T16:00:10.789Z"
}
```

**📱 Notificación WhatsApp Enviada Automáticamente:**
```
🍻 ¡Gracias por tu compra en Francachela!

💰 Total: S/ 31.00
⭐ Puntos ganados: 31
🎫 Ticket #20241205-0003

¡Vuelve pronto y sigue acumulando puntos! 🎉
```

---

## ⭐ EJEMPLO 4: Venta Con Uso de Puntos

**Caso de Uso:** Cliente canjea puntos acumulados (1 punto = S/ 0.10 de descuento).

```bash
POST http://localhost:3000/ventas
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Payload:**
```json
{
  "clienteId": 8,
  "listaProductos": [
    {
      "productoId": 2,
      "cantidad": 2
    },
    {
      "productoId": 5,
      "cantidad": 1
    }
  ],
  "descuento": 0,
  "metodoPago": "TARJETA",
  "tipoCompra": "LOCAL",
  "comentario": "Canjeando 100 puntos",
  "puntosUsados": 100
}
```

**Detalles del Cálculo:**
- Subtotal: S/ 25.00
- Descuento por 100 puntos (100 × 0.10): S/ 10.00
- **Total a pagar: S/ 15.00**
- Puntos otorgados: 15 (nuevos puntos por esta compra)
- Puntos usados: 100 (se restan del cliente)

**Respuesta (201 Created):**
```json
{
  "id": 4,
  "fecha": "2024-12-05T16:15:33.012Z",
  "ticketId": "20241205-0004",
  "cliente": {
    "id": 8,
    "nombres": "Miguel",
    "apellidos": "Ramírez Castro",
    "telefono": "999888777",
    "puntosAcumulados": 315
  },
  "listaProductos": [
    {
      "productoId": 2,
      "codigoBarra": "7891234567892",
      "descripcion": "Cerveza Negra 375ml",
      "cantidad": 2,
      "precioUnitario": 7.50,
      "subtotal": 15.00,
      "valorPuntos": 1
    },
    {
      "productoId": 5,
      "codigoBarra": "7891234567894",
      "descripcion": "Vino Tinto 750ml",
      "cantidad": 1,
      "precioUnitario": 10.00,
      "subtotal": 10.00,
      "valorPuntos": 2
    }
  ],
  "subTotal": 25.00,
  "descuento": 10.00,
  "total": 15.00,
  "metodoPago": "TARJETA",
  "cajero": "cajero_test",
  "estado": "COMPLETADO",
  "puntosOtorgados": 15,
  "puntosUsados": 100,
  "tipoCompra": "LOCAL",
  "montoRecibido": 15.00,
  "vuelto": 0,
  "fechaCreacion": "2024-12-05T16:15:33.012Z"
}
```

**📱 Notificación WhatsApp Enviada Automáticamente:**
```
🍻 ¡Gracias por tu compra en Francachela!

💰 Total: S/ 15.00
⭐ Puntos ganados: 15
🎫 Ticket #20241205-0004

¡Vuelve pronto y sigue acumulando puntos! 🎉
```

---

## 🚚 EJEMPLO 5: Venta Con Delivery

**Caso de Uso:** Pedido a domicilio, pago por Plin.

```bash
POST http://localhost:3000/ventas
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Payload:**
```json
{
  "clienteId": 15,
  "listaProductos": [
    {
      "productoId": 1,
      "cantidad": 4
    },
    {
      "productoId": 2,
      "cantidad": 2
    },
    {
      "productoId": 6,
      "cantidad": 1
    }
  ],
  "descuento": 0,
  "metodoPago": "PLIN",
  "tipoCompra": "DELIVERY",
  "comentario": "Entregar en Jr. Principal 500 - Sin hielo por favor",
  "puntosUsados": 0
}
```

**Respuesta (201 Created):**
```json
{
  "id": 5,
  "fecha": "2024-12-05T16:45:50.234Z",
  "ticketId": "20241205-0005",
  "cliente": {
    "id": 15,
    "nombres": "Andrea",
    "apellidos": "Martínez López",
    "telefono": "991111222",
    "direccion": "Jr. Principal 500, Depto 302",
    "puntosAcumulados": 180
  },
  "listaProductos": [
    {
      "productoId": 1,
      "codigoBarra": "7891234567890",
      "descripcion": "Cerveza Arequipeña 350ml",
      "cantidad": 4,
      "precioUnitario": 6.00,
      "subtotal": 24.00,
      "valorPuntos": 1
    },
    {
      "productoId": 2,
      "codigoBarra": "7891234567892",
      "descripcion": "Cerveza Negra 375ml",
      "cantidad": 2,
      "precioUnitario": 7.50,
      "subtotal": 15.00,
      "valorPuntos": 1
    },
    {
      "productoId": 6,
      "codigoBarra": "7891234567895",
      "descripcion": "Hielo 5kg",
      "cantidad": 1,
      "precioUnitario": 8.00,
      "subtotal": 8.00,
      "valorPuntos": 0
    }
  ],
  "subTotal": 47.00,
  "descuento": 0,
  "total": 47.00,
  "metodoPago": "PLIN",
  "cajero": "cajero_test",
  "estado": "COMPLETADO",
  "puntosOtorgados": 47,
  "puntosUsados": 0,
  "tipoCompra": "DELIVERY",
  "montoRecibido": 47.00,
  "vuelto": 0,
  "fechaCreacion": "2024-12-05T16:45:50.234Z"
}
```

**📱 Notificación WhatsApp Enviada Automáticamente:**
```
🍻 ¡Gracias por tu compra en Francachela!

💰 Total: S/ 47.00
⭐ Puntos ganados: 47
🎫 Ticket #20241205-0005

¡Vuelve pronto y sigue acumulando puntos! 🎉
```

---

## 🔧 EJEMPLO 6: Venta Con Precio Unitario Personalizado

**Caso de Uso:** Oferta especial donde el precio es diferente al de lista.

```bash
POST http://localhost:3000/ventas
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Payload:**
```json
{
  "clienteId": 12,
  "listaProductos": [
    {
      "productoId": 1,
      "cantidad": 12,
      "precioUnitario": 5.50
    }
  ],
  "descuento": 0,
  "metodoPago": "EFECTIVO",
  "tipoCompra": "LOCAL",
  "montoRecibido": 70.00,
  "comentario": "Docena a precio especial"
}
```

**Detalles:**
- Producto: Cerveza Arequipeña 350ml
- Precio normal: S/ 6.00
- Precio especial: S/ 5.50
- Cantidad: 12
- Subtotal: 12 × 5.50 = S/ 66.00
- **Total: S/ 66.00**

**Respuesta (201 Created):**
```json
{
  "id": 6,
  "fecha": "2024-12-05T17:20:15.567Z",
  "ticketId": "20241205-0006",
  "cliente": {
    "id": 12,
    "nombres": "Fernando",
    "apellidos": "Sánchez Morales"
  },
  "listaProductos": [
    {
      "productoId": 1,
      "codigoBarra": "7891234567890",
      "descripcion": "Cerveza Arequipeña 350ml",
      "cantidad": 12,
      "precioUnitario": 5.50,
      "subtotal": 66.00,
      "valorPuntos": 1
    }
  ],
  "subTotal": 66.00,
  "descuento": 0,
  "total": 66.00,
  "metodoPago": "EFECTIVO",
  "cajero": "cajero_test",
  "estado": "COMPLETADO",
  "puntosOtorgados": 66,
  "puntosUsados": 0,
  "tipoCompra": "LOCAL",
  "montoRecibido": 70.00,
  "vuelto": 4.00,
  "fechaCreacion": "2024-12-05T17:20:15.567Z"
}
```

---

## 📊 TABLA COMPARATIVA DE EJEMPLOS

| Ejemplo | Cliente | Tipo | Puntos | Descuento | Total | Notif. WhatsApp |
|---------|---------|------|--------|-----------|-------|-----------------|
| 1 | NO | Local | NO | NO | S/ 20.00 | ❌ |
| 2 | SÍ (5) | Local | Gana 32 | NO | S/ 32.50 | ✅ (987654321) |
| 3 | SÍ (10) | Local | Gana 31 | S/ 5.00 | S/ 31.00 | ✅ (998765432) |
| 4 | SÍ (8) | Local | Gana 15, Usa 100 | S/ 10.00 | S/ 15.00 | ✅ (999888777) |
| 5 | SÍ (15) | Delivery | Gana 47 | NO | S/ 47.00 | ✅ (991111222) |
| 6 | SÍ (12) | Local | Gana 66 | NO | S/ 66.00 | ✅ |

---

## ⚠️ VALIDACIONES Y ERRORES

### Error 1: Cliente No Existe
```bash
POST http://localhost:3000/ventas
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
  "clienteId": 9999,
  "listaProductos": [{"productoId": 1, "cantidad": 1}],
  "metodoPago": "EFECTIVO"
}
```

**Respuesta (404):**
```json
{
  "statusCode": 404,
  "message": "Cliente no encontrado",
  "error": "Not Found"
}
```

---

### Error 2: Producto No Existe
```bash
POST http://localhost:3000/ventas
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
  "listaProductos": [{"productoId": 9999, "cantidad": 1}],
  "metodoPago": "EFECTIVO"
}
```

**Respuesta (404):**
```json
{
  "statusCode": 404,
  "message": "Producto no encontrado",
  "error": "Not Found"
}
```

---

### Error 3: Stock Insuficiente
```bash
POST http://localhost:3000/ventas
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
  "listaProductos": [{"productoId": 1, "cantidad": 1000}],
  "metodoPago": "EFECTIVO"
}
```

**Respuesta (400):**
```json
{
  "statusCode": 400,
  "message": "Stock insuficiente para Cerveza Arequipeña 350ml",
  "error": "Bad Request"
}
```

---

### Error 4: Puntos Insuficientes
```bash
POST http://localhost:3000/ventas
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
  "clienteId": 8,
  "listaProductos": [{"productoId": 1, "cantidad": 1}],
  "metodoPago": "EFECTIVO",
  "puntosUsados": 1000
}
```

**Respuesta (400):**
```json
{
  "statusCode": 400,
  "message": "El cliente no tiene suficientes puntos",
  "error": "Bad Request"
}
```

---

### Error 5: Total Negativo
```bash
POST http://localhost:3000/ventas
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
  "listaProductos": [{"productoId": 1, "cantidad": 1}],
  "descuento": 1000,
  "metodoPago": "EFECTIVO"
}
```

**Respuesta (400):**
```json
{
  "statusCode": 400,
  "message": "El total no puede ser negativo",
  "error": "Bad Request"
}
```

---

## 🔐 Headers Requeridos

Todos los requests de ventas requieren:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

---

## 📋 Campos Descripción

### Campos Obligatorios
- **listaProductos**: Array con al menos 1 producto
  - **productoId**: ID del producto (requerido)
  - **cantidad**: Cantidad a comprar (requerido, mín. 1)
  - **precioUnitario**: Opcional (usa precio del producto si no se indica)

- **metodoPago**: Método de pago (EFECTIVO, YAPE, PLIN, TARJETA)

### Campos Opcionales
- **clienteId**: ID del cliente (si no se indica, venta anónima)
- **descuento**: Descuento en soles (default: 0)
- **tipoCompra**: LOCAL o DELIVERY (default: LOCAL)
- **montoRecibido**: Monto recibido del cliente (para calcular vuelto)
- **puntosUsados**: Puntos a canjear (default: 0)
- **comentario**: Notas de la venta

### Campos Calculados Automáticamente
- **ticketId**: Se genera automáticamente (YYYYMMDD-XXXX)
- **puntosOtorgados**: Se calcula como `floor(total)` si hay cliente
- **vuelto**: Se calcula como `montoRecibido - total`
- **fecha**: Fecha actual
- **estado**: COMPLETADO

---

## ✅ Respuestas Exitosas

Todas las respuestas de venta exitosa retornan código **201 Created** con la estructura completa de la venta incluyendo:

```json
{
  "id": 1,
  "fecha": "ISO8601 DateTime",
  "ticketId": "YYYYMMDD-XXXX",
  "cliente": { ... } | null,
  "listaProductos": [ ... ],
  "subTotal": number,
  "descuento": number,
  "total": number,
  "metodoPago": "enum",
  "cajero": "string",
  "estado": "COMPLETADO",
  "puntosOtorgados": number,
  "puntosUsados": number,
  "tipoCompra": "LOCAL" | "DELIVERY",
  "montoRecibido": number,
  "vuelto": number,
  "fechaCreacion": "ISO8601 DateTime"
}
```

---

## 🎯 Testing Flow Recomendado

1. ✅ **Crear Usuario Cajero** (si no existe)
2. ✅ **Login** para obtener token
3. ✅ **Crear Productos** (si no existen)
4. ✅ **Crear Clientes** (opcional)
5. ✅ **Conectar WhatsApp** (escanear QR)
6. ✅ **Crear Ventas** (ejecutar ejemplos de esta guía)
7. ✅ **Verificar Notificaciones** (revisar WhatsApp)
8. ✅ **Verificar BD** (stock decrementado, puntos actualizados)

---

## 📚 Referencias Adicionales

- **GET /ventas**: Listar todas las ventas (paginated)
- **GET /ventas/{id}**: Obtener venta por ID
- **GET /ventas/ticket/{ticketId}**: Obtener venta por ticket ID
- **GET /ventas/hoy**: Obtener ventas del día
- **PATCH /ventas/{id}/anular**: Anular una venta
- **GET /ventas/estadisticas?fechaInicio=&fechaFin=**: Obtener estadísticas
