# 🍻 Francachela POS Backend

Sistema de Punto de Venta completo desarrollado con **NestJS**, **TypeScript**, **PostgreSQL**, **TypeORM** y **Baileys** para WhatsApp.

## 🚀 Características Principales

### ✅ Módulos Implementados

1. **👥 Autenticación & Usuarios**
   - ✅ Login con JWT y roles (ADMIN, CAJERO, INVENTARIOS)
   - ✅ Gestión de usuarios del sistema
   - ✅ Middleware de autorización por roles

2. **🍺 Gestión de Productos**
   - ✅ CRUD completo de productos
   - ✅ Código de barras único
   - ✅ Control de stock y alertas de inventario bajo
   - ✅ Precios normales y mayoreo
   - ✅ Categorías y proveedores
   - ✅ Sistema de puntos por producto

3. **👤 Gestión de Clientes**
   - ✅ CRUD completo con DNI único
   - ✅ Sistema de puntos de fidelidad
   - ✅ Historial de compras y canjes
   - ✅ Filtros por cumpleaños y deudas

4. **🛒 Sistema de Ventas (POS)**
   - ✅ Multi-ticket (múltiples ventas simultáneas)
   - ✅ Búsqueda por código de barras
   - ✅ Múltiples métodos de pago (Efectivo, Yape, Plin, Tarjeta)
   - ✅ Aplicación automática de descuentos
   - ✅ Sistema de puntos automático
   - ✅ Ventas locales y delivery

5. **🎁 Promociones & Combos**
   - ✅ Promociones por porcentaje o monto fijo
   - ✅ Combos de productos con precios especiales
   - ✅ Validación de disponibilidad automática
   - ✅ Cálculo de ahorros en tiempo real

6. **💰 Caja Registradora**
   - ✅ Apertura/cierre de caja con control de diferencias
   - ✅ Desglose por método de pago
   - ✅ Historial de cajas por cajero
   - ✅ Control de gastos operativos

7. **🚚 Sistema de Delivery**
   - ✅ Estados controlados (PENDIENTE → ASIGNADO → EN_CAMINO → ENTREGADO)
   - ✅ Asignación de repartidores
   - ✅ Tracking de tiempos de entrega
   - ✅ Estadísticas por repartidor

8. **📦 Movimientos de Inventario**
   - ✅ Tracking independiente (ENTRADA, SALIDA, AJUSTE)
   - ✅ Integración automática con productos
   - ✅ Estadísticas detalladas por período
   - ✅ Reportes por producto y cajero

9. **📱 Integración WhatsApp**
   - ✅ Notificaciones automáticas post-venta
   - ✅ Mensajes de combos y promociones
   - ✅ Alertas de delivery en tiempo real
   - ✅ Notificaciones de stock bajo para administradores

10. **📊 Exportación Excel**
    - ✅ Reportes de ventas con filtros de fecha
    - ✅ Exportación de productos e inventario
    - ✅ Reportes de clientes y delivery
    - ✅ Formato profesional con totales y estadísticas

11. **📚 Documentación Swagger**
    - ✅ Documentación completa de todos los endpoints
    - ✅ Autenticación Bearer Token integrada
    - ✅ Ejemplos de request/response
    - ✅ Interfaz interactiva en `/api`

## 🏗️ Arquitectura

```
src/
├── modulos/                    # Módulos organizados
│   ├── auth/                  # Autenticación JWT
│   ├── users/                 # Gestión de usuarios
│   ├── productos/             # Catálogo e inventario
│   ├── clientes/              # Clientes y fidelidad
│   ├── ventas/                # POS y transacciones
│   ├── promociones/           # Descuentos y ofertas
│   ├── combos/                # Paquetes de productos
│   ├── caja/                  # Caja registradora
│   ├── gastos/                # Gastos operativos
│   ├── delivery/              # Entregas a domicilio
│   ├── movimiento-inventario/ # Tracking de stock
│   ├── whatsapp/              # Notificaciones
│   └── excel/                 # Exportación de reportes
├── entities/                   # Entidades TypeORM
├── common/                     # Utilidades compartidas
├── config/                     # Configuraciones
├── database/
│   └── seeders/               # Scripts de población
└── main.ts                    # Punto de entrada
```

## 🛠️ Tecnologías

- **Backend**: NestJS + TypeScript
- **Base de Datos**: PostgreSQL + TypeORM
- **Autenticación**: JWT + bcryptjs
- **Validación**: class-validator + class-transformer
- **Documentación**: Swagger/OpenAPI
- **WhatsApp**: @whiskeysockets/baileys
- **Reportes**: ExcelJS
- **Testing**: Jest

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL 12+
- npm o yarn

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/anibau/francachela-pos-PRO-v1.git
cd francachela-pos-PRO-v1
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```env
# Base de Datos
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=tu_password
DATABASE_NAME=francachela_pos

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_EXPIRES_IN=24h

# Servidor
PORT=3000
NODE_ENV=development
```

### 4. Crear base de datos
```bash
# Conectar a PostgreSQL y crear la base de datos
createdb francachela_pos
```

### 5. Ejecutar migraciones (si las hay)
```bash
npm run migration:run
```

### 6. Poblar base de datos con datos de prueba
```bash
npm run seed
```

### 7. Iniciar el servidor
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## 📚 Documentación API

Una vez iniciado el servidor, accede a:

- **Swagger UI**: http://localhost:3000/api
- **JSON Schema**: http://localhost:3000/api-json

### 🔐 Autenticación

1. **Login** en `/auth/login` con:
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```

2. **Usar el token** en el header:
   ```
   Authorization: Bearer tu_jwt_token_aqui
   ```

### 👥 Usuarios por Defecto (después del seeding)

| Usuario | Password | Rol | Descripción |
|---------|----------|-----|-------------|
| `admin` | `admin123` | ADMIN | Administrador principal |
| `cajero1` | `cajero123` | CAJERO | María González |
| `cajero2` | `cajero123` | CAJERO | Carlos Rodríguez |
| `inventarios` | `inv123` | INVENTARIOS | Ana Martínez |

## 📊 Datos de Prueba

El comando `npm run seed` crea **5 registros de prueba** en cada tabla:

- ✅ **5 Usuarios** con diferentes roles
- ✅ **5 Productos** (cervezas, pisco, chicharrón, agua)
- ✅ **5 Clientes** con puntos acumulados
- ✅ **5 Promociones** activas e inactivas
- ✅ **5 Combos** con diferentes productos
- ✅ **5 Ventas** de ejemplo con diferentes métodos de pago
- ✅ **5 Cajas** con historial de apertura/cierre
- ✅ **5 Gastos** operativos
- ✅ **5 Deliveries** en diferentes estados
- ✅ **5 Movimientos** de inventario

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Servidor con hot-reload
npm run start:debug        # Servidor con debug

# Producción
npm run build              # Compilar TypeScript
npm run start:prod         # Servidor de producción

# Base de Datos
npm run migration:generate # Generar migración
npm run migration:run      # Ejecutar migraciones
npm run migration:revert   # Revertir migración
npm run seed              # Poblar base de datos
npm run seed:dev          # Poblar en desarrollo
npm run seed:prod         # Poblar en producción

# Calidad de Código
npm run lint              # Linter ESLint
npm run format            # Formatear con Prettier
npm run test              # Tests unitarios
npm run test:e2e          # Tests end-to-end
```

## 📱 Integración WhatsApp

### Configuración

1. **Habilitar WhatsApp** en `.env`:
   ```env
   WHATSAPP_ENABLED=true
   ```

2. **Primera conexión**:
   - Iniciar el servidor
   - Escanear el código QR que aparece en la consola
   - El sistema guardará la sesión automáticamente

3. **Endpoints disponibles**:
   - `POST /whatsapp/send` - Enviar mensaje personalizado
   - `POST /whatsapp/send-venta` - Notificación de venta
   - `POST /whatsapp/send-combo` - Notificación de combo
   - `POST /whatsapp/send-delivery` - Estado de delivery
   - `GET /whatsapp/status` - Estado de conexión

### Mensajes Automáticos

El sistema envía automáticamente:

- 🍻 **Post-venta**: Agradecimiento con total y puntos ganados
- 🎁 **Combos**: Confirmación con ahorro obtenido
- 🚚 **Delivery**: Actualizaciones de estado de entrega
- ⚠️ **Stock bajo**: Alertas para administradores

## 📊 Exportación Excel

### Reportes Disponibles

- **Ventas**: `/excel/export-ventas` - Con filtros de fecha
- **Productos**: `/excel/export-productos` - Inventario completo
- **Clientes**: `/excel/export-clientes` - Base de datos de clientes
- **Inventario**: `/excel/export-inventario` - Movimientos de stock
- **Delivery**: `/excel/export-delivery` - Historial de entregas

### Características

- ✅ Formato profesional con headers estilizados
- ✅ Totales y estadísticas automáticas
- ✅ Filtros por rango de fechas
- ✅ Descarga directa desde el navegador
- ✅ Nombres de archivo con timestamp

## 🔐 Seguridad

- ✅ **Autenticación JWT** con expiración configurable
- ✅ **Control de roles** granular por endpoint
- ✅ **Validación de datos** con class-validator
- ✅ **Sanitización de inputs** automática
- ✅ **CORS** configurado para frontend
- ✅ **Rate limiting** (recomendado para producción)

## 🚀 Despliegue en Producción

### Variables de Entorno Adicionales

```env
NODE_ENV=production
DATABASE_SSL=true
DATABASE_SYNCHRONIZE=false
LOG_LEVEL=error
CORS_ORIGIN=https://tu-frontend.com
```

### Recomendaciones

1. **Base de Datos**:
   - Usar conexión SSL
   - Configurar backup automático
   - Monitorear performance

2. **Servidor**:
   - Usar PM2 para gestión de procesos
   - Configurar reverse proxy (Nginx)
   - Implementar rate limiting

3. **Seguridad**:
   - JWT secret fuerte y único
   - HTTPS obligatorio
   - Logs de auditoría

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:cov

# Tests end-to-end
npm run test:e2e

# Tests en modo watch
npm run test:watch
```

## 📈 Métricas y Monitoreo

### Endpoints de Salud

- `GET /health` - Estado general del sistema
- `GET /health/database` - Estado de la base de datos
- `GET /whatsapp/status` - Estado de WhatsApp

### Logs

El sistema registra automáticamente:
- ✅ Todas las transacciones de venta
- ✅ Movimientos de inventario
- ✅ Errores y excepciones
- ✅ Conexiones de WhatsApp
- ✅ Exportaciones de reportes

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es privado y propietario de Francachela.

## 📞 Soporte

- **Email**: soporte@francachela.com
- **Documentación**: http://localhost:3000/api
- **Issues**: GitHub Issues

---

**🍻 Desarrollado con ❤️ para mejorar la gestión de tu negocio**

### 📊 Estadísticas del Proyecto

- **Líneas de código**: ~6,000+
- **Endpoints**: 50+
- **Módulos**: 12
- **Entidades**: 10
- **Tests**: 100+ (objetivo)
- **Cobertura**: 90%+ (objetivo)

### 🎯 Roadmap

- [ ] **App móvil** nativa (React Native)
- [ ] **Dashboard en tiempo real** con WebSockets
- [ ] **Impresión térmica** de tickets
- [ ] **Modo offline** con sincronización
- [ ] **Integración con bancos** para pagos
- [ ] **BI y analytics** avanzados
- [ ] **Multi-tienda** y franquicias

