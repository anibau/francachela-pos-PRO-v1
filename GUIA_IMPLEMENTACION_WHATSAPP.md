# 🚀 GUÍA DE IMPLEMENTACIÓN - REFACTORIZACIÓN WHATSAPP

## 📦 CAMBIOS REALIZADOS

### Archivo Modificado
- ✅ `src/modulos/whatsapp/whatsapp.service.ts`

---

## 🔧 DETALLES TÉCNICOS DE CAMBIOS

### 1. **Evento de conexión abierta (CRÍTICO)**

**Antes:** `isConnected` nunca se actualiza a `true`
```typescript
// ❌ Antes - Sin detección de 'open'
this.socket.ev.on('connection.update', async (update) => {
  const { connection, lastDisconnect, qr } = update;
  // isConnected nunca se activa aquí
});
```

**Después:** Conexión detectada correctamente
```typescript
// ✅ Después - Con detección de 'open' en connection.update
this.socket.ev.on('connection.update', async (update: Partial<ConnectionState>) => {
  const { connection, lastDisconnect, qr } = update;

  // NUEVO - Detectar conexión exitosa
  if (connection === 'open') {
    this.isConnected = true;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.logger.log('✅ Conexión exitosa - LISTO PARA ENVIAR');
    return;
  }
  // ... resto del código ...
});
```

**Por qué:** El evento `connection.update` con `connection === 'open'` se dispara cuando la conexión está lista. Sin esto, `isConnected` permanece `false` y todos los envíos fallan.

---

### 2. **Manejo de Código 515**

**Antes:**
```typescript
// ❌ Antes - Código 515 no se maneja
const shouldReconnect = error !== DisconnectReason.loggedOut;

if (shouldReconnect) {
  // Reintentar con otros errores, pero 515 falla
}
```

**Después:**
```typescript
// ✅ Después - Código 515 se maneja específicamente
if (statusCode === 515 || errorData?.tag === 'stream:error') {
  this.logger.warn(`🔄 Stream Errored (515) - Intentando reconectar...`);
  
  if (this.reconnectAttempts < this.maxReconnectAttempts) {
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);
    
    this.isConnecting = false;
    this.reconnectTimeout = setTimeout(() => this.initializeWhatsApp(), delay);
  }
  return; // Salir del flujo normal
}
```

**Backoff exponencial:**
```
Intento 1: 1000ms  (1s)
Intento 2: 2000ms  (2s)
Intento 3: 4000ms  (4s)
Intento 4: 8000ms  (8s)
Intento 5: 16000ms (16s)
Máximo: 30000ms (30s)
```

---

### 3. **Configuración Optimizada del Socket**

**Cambios:**
```typescript
const socket = makeWASocket({
  // ... versión, auth, etc ...

  // ANTES → DESPUÉS
  qrTimeout: 60000 → 90000,              // Más tiempo para escanear
  defaultQueryTimeoutMs: 10000 → 15000,  // Más tolerante con latencia
  keepAliveIntervalMs: 30000 → 20000,    // Mantiene conexión más activa
  retryRequestDelayMs: undefined → 100,  // NUEVO - Reintentos más rápidos
});
```

---

### 4. **Cleanup Mejorado**

**Antes:**
```typescript
// ❌ Antes - Limpieza incompleta
private cleanup() {
  if (this.reconnectTimeout) {
    clearTimeout(this.reconnectTimeout);
  }
  
  if (this.socket) {
    try {
      this.socket.end(undefined);
    } catch (error) {
      this.logger.warn('Error al cerrar socket:', error.message);
    }
  }
}
```

**Después:**
```typescript
// ✅ Después - Limpieza robusta
private cleanup() {
  try {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      // Intentar cerrar la conexión gracefully
      this.socket.end(undefined);
    }

    this.isConnected = false;
    this.isConnecting = false;
  } catch (error) {
    this.logger.error('Error en cleanup:', error);
  }
}
```

---

### 5. **Mejora en `sendMessage`**

**Antes:**
```typescript
// ❌ Antes - Validación mínima
async sendMessage(sendMessageDto: SendMessageDto) {
  if (!this.isConnected) {
    return { success: false, error: '...' };
  }

  const sentMessage = await this.socket.sendMessage(jid, { 
    text: sendMessageDto.message 
  });
}
```

**Después:**
```typescript
// ✅ Después - Validación robusta
async sendMessage(sendMessageDto: SendMessageDto) {
  if (!this.isConnected) {
    this.logger.warn('Intento de envío sin conexión');
    return { success: false, error: '...' };
  }

  if (!this.socket) {
    this.isConnected = false; // Sincronizar
    return { success: false, error: '...' };
  }

  // NUEVO - Validaciones adicionales
  if (!sendMessageDto.message?.trim()) {
    return { success: false, error: 'Mensaje vacío' };
  }

  try {
    const sentMessage = await this.socket.sendMessage(jid, { 
      text: sendMessageDto.message 
    });
    return { success: true, messageId: sentMessage?.key?.id };
  } catch (sendError) {
    // NUEVO - Detectar error de conexión durante envío
    if (sendError?.message?.includes('stream')) {
      this.isConnected = false;
      this.logger.error('❌ Conexión perdida durante envío');
    }
    return { success: false, error: sendError?.message };
  }
}
```

---

### 6. **Status mejorado**

**Antes:**
```typescript
getConnectionStatus() {
  return {
    connected: this.isConnected,
    isConnecting: this.isConnecting,
    phone: this.socket?.user?.id?.split(':')[0],
    qrAvailable: !this.isConnected && !!this.qrCode
  };
}
```

**Después:**
```typescript
getConnectionStatus() {
  let socketHealth = '🟢 OK';
  
  if (!this.isConnected && !this.isConnecting) {
    socketHealth = '🔴 DESCONECTADO';
  } else if (this.isConnecting) {
    socketHealth = '🟡 CONECTANDO';
  } else if (this.reconnectAttempts > 0) {
    socketHealth = '🟠 RECUPERÁNDOSE';
  }

  return {
    connected: this.isConnected,
    isConnecting: this.isConnecting,
    phone: this.socket?.user?.id?.split(':')[0],
    qrAvailable: !this.isConnected && !!this.qrCode,
    reconnectAttempts: this.reconnectAttempts,  // NUEVO
    socketHealth                                 // NUEVO
  };
}
```

---

## 🧪 PRUEBAS RECOMENDADAS

### 1. **Test de conexión inicial**
```bash
# Logs esperados:
# 🔌 Conectando a WhatsApp...
# ✅ Conexión exitosa con WhatsApp - LISTO PARA ENVIAR MENSAJES
```

### 2. **Test de error 515**
```bash
# Simular desconexión (apagar internet, bloquear en firewall)
# Logs esperados:
# ⚠️ Conexión cerrada - Status: 515
# 🔄 Stream Errored (515) - Intentando reconectar...
# 🔄 Reconectando en 1000ms (intento 1/5)
# 🔄 Reconectando en 2000ms (intento 2/5)
# [... etc ...]
```

### 3. **Test de envío de mensaje**
```bash
curl -X POST http://localhost:3000/whatsapp/send \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "51912345678",
    "message": "Test message"
  }'

# Respuesta esperada:
# { "success": true, "messageId": "3EB0..." }

# Logs esperados:
# ✉️ Mensaje enviado exitosamente a 51912345678
```

### 4. **Test de status**
```bash
curl -X GET http://localhost:3000/whatsapp/status \
  -H "Authorization: Bearer $TOKEN"

# Respuesta esperada:
# {
#   "connected": true,
#   "isConnecting": false,
#   "phone": "51912345678",
#   "qrAvailable": false,
#   "reconnectAttempts": 0,
#   "socketHealth": "🟢 OK"
# }
```

---

## ⚠️ POSIBLES PROBLEMAS Y SOLUCIONES

| Problema | Causa | Solución |
|----------|-------|----------|
| `isConnected` sigue siendo `false` | Evento `connection.open` no se dispara | Verificar que Baileys ^6.6.10 está instalado |
| Error 515 no reintentar | Código no detectado | Ver logs, debería mostrar "Stream Errored (515)" |
| Memory leak | Listeners duplicados | Verificar que `removeAllListeners()` se llama |
| Timeout en envío | KeepAlive insuficiente | No cambiar `keepAliveIntervalMs` < 15000 |
| QR no disponible | Timeout muy bajo | Aumentar `qrTimeout` a 120000 (2 minutos) |

---

## 📊 MONITOREO EN PRODUCCIÓN

### Métricas importantes

```typescript
// En tu dashboard o monitoring
const status = whatsappService.getConnectionStatus();

if (status.socketHealth === '🔴 DESCONECTADO') {
  // Alerta crítica
  sendAlert('WhatsApp desconectado');
}

if (status.reconnectAttempts > 3) {
  // Alerta de advertencia
  sendWarning('WhatsApp con múltiples reintentos: ' + status.reconnectAttempts);
}
```

---

## 🔄 FLUJO DE CONEXIÓN MEJORADO

```
┌─────────────────────────────────────────────────────┐
│ 1. onModuleInit()                                   │
│    └─ initializeWhatsApp()                          │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ 2. makeWASocket() con config optimizada             │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ 3. Listeners registrados:                           │
│    - connection.open          ✅ NEW                 │
│    - connection.update        (mejorado)            │
│    - creds.update             (sin cambios)         │
│    - connection.error         ✅ NEW                 │
└────────────────┬────────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
┌──────────────┐      ┌──────────────────────┐
│ connection.  │      │ Error 515?           │
│ open         │      │ ├─ Sí: Reintentar   │
│ = CONECTADO  │      │ └─ No: Logout?      │
└──────────────┘      │    ├─ Sí: Salir     │
                      │    └─ No: Reintentar│
                      └──────────────────────┘
```

---

## 🎯 CHECKLIST PRE-DEPLOY

- [ ] Compilar sin errores: `npm run build`
- [ ] Tests pasen: `npm run test`
- [ ] Lint sin warnings: `npm run lint`
- [ ] Verificar logs en local
- [ ] Probar conexión QR
- [ ] Probar envío de mensaje
- [ ] Simular error 515 y verificar reintentos
- [ ] Verificar status endpoint
- [ ] Memory usage normal (sin leaks)
- [ ] Documentación actualizada

---

## 📚 REFERENCIAS

- Baileys GitHub: https://github.com/WhiskeySockets/Baileys
- NestJS Lifecycle: https://docs.nestjs.com/fundamentals/lifecycle-events
- Error Handling: https://docs.nestjs.com/exception-filters/built-in-http-exceptions

---

**Última actualización:** 12/12/2025 - 14:30 UTC
