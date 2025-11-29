# 🍻 Francachela POS - Backend API

Sistema de Punto de Venta completo desarrollado con **NestJS**, **TypeScript**, **PostgreSQL** y **TypeORM**.

## 🚀 Características Principales

### ✅ Módulos Implementados

1. **Autenticación y Autorización**
   - ✅ JWT Authentication
   - ✅ Roles de usuario (ADMIN, CAJERO, INVENTARIOS)
   - ✅ Guards de protección de rutas
   - ✅ Decoradores personalizados

2. **Gestión de Usuarios**
   - ✅ CRUD completo de usuarios
   - ✅ Sistema de roles y permisos
   - ✅ Autenticación segura

3. **Gestión de Productos**
   - ✅ CRUD completo con validaciones
   - ✅ Código de barras único
   - ✅ Control de stock e inventario
   - ✅ Precios normal y mayoreo
   - ✅ Categorías y proveedores
   - ✅ Sistema de puntos por producto

4. **Gestión de Clientes**
   - ✅ CRUD completo con validaciones
   - ✅ Sistema de puntos de fidelidad
   - ✅ Historial de compras y canjes
   - ✅ Filtros avanzados
   - ✅ Códigos cortos únicos

5. **Sistema de Ventas**
   - ✅ Registro completo de transacciones
   - ✅ Múltiples métodos de pago
   - ✅ Sistema de descuentos
   - ✅ Puntos automáticos
   - ✅ Ventas locales y delivery

6. **Promociones y Combos**
   - ✅ CRUD de promociones
   - ✅ Combos de productos
   - ✅ Descuentos por porcentaje y monto
   - ✅ Fechas de vigencia

7. **Caja Registradora**
   - ✅ Apertura y cierre de caja
   - ✅ Control de efectivo
   - ✅ Desglose por método de pago
   - ✅ Historial completo

8. **Control de Gastos**
   - ✅ Registro de gastos operativos
   - ✅ Categorización
   - ✅ Métodos de pago
   - ✅ Comprobantes

9. **Sistema de Delivery**
   - ✅ Gestión de pedidos
   - ✅ Estados de entrega
   - ✅ Asignación de repartidores
   - ✅ Costos de delivery

10. **Movimientos de Inventario**
    - ✅ Entradas, salidas y ajustes
    - ✅ Trazabilidad completa
    - ✅ Control de stock mínimo
    - ✅ Historial de movimientos

## 🏗️ Arquitectura Técnica

```
src/
├── common/
│   ├── decorators/     # Decoradores personalizados
│   ├── dto/           # DTOs compartidos
│   ├── enums/         # Enumeraciones centralizadas
│   ├── filters/       # Filtros de excepción
│   ├── guards/        # Guards de autenticación
│   └── pipes/         # Pipes de validación
├── config/
│   └── database.config.ts  # Configuración de BD
├── database/
│   ├── migrations/    # Migraciones de BD
│   └── seeders/       # Datos de prueba
├── entities/          # Entidades TypeORM
├── modulos/
│   ├── auth/          # Autenticación JWT
│   ├── usuarios/      # Gestión de usuarios
│   ├── productos/     # Inventario de productos
│   ├── clientes/      # CRM de clientes
│   ├── ventas/        # Sistema de ventas
│   ├── promociones/   # Promociones y combos
│   ├── caja/          # Caja registradora
│   ├── gastos/        # Control de gastos
│   └── delivery/      # Sistema de delivery
└── main.ts           # Punto de entrada
```

## 🛠️ Tecnologías

- **Framework**: NestJS 10.x
- **Lenguaje**: TypeScript 5.x
- **Base de Datos**: PostgreSQL 15+
- **ORM**: TypeORM 0.3.x
- **Autenticación**: JWT + Passport
- **Validación**: class-validator + class-transformer
- **Documentación**: Swagger/OpenAPI
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## 📊 Entidades de Base de Datos

### Principales Entidades

1. **Usuario** - Sistema de usuarios y roles
2. **Producto** - Inventario de productos
3. **Cliente** - CRM y fidelización
4. **Venta** - Transacciones de venta
5. **Promocion** - Promociones y descuentos
6. **Combo** - Combos de productos
7. **Caja** - Control de caja registradora
8. **Gasto** - Gastos operativos
9. **Delivery** - Gestión de entregas
10. **MovimientoInventario** - Trazabilidad de stock

### Enumeraciones Centralizadas

```typescript
// Estados y tipos
EstadoVenta: COMPLETADO | ANULADO | PENDIENTE
EstadoCaja: ABIERTA | CERRADA
EstadoDelivery: PENDIENTE | EN_CAMINO | ENTREGADO | CANCELADO
TipoCompra: LOCAL | DELIVERY
TipoMovimiento: ENTRADA | SALIDA | AJUSTE

// Métodos de pago
MetodoPago: EFECTIVO | YAPE | PLIN | TARJETA | TRANSFERENCIA

// Categorías
CategoriaGasto: OPERATIVO | MARKETING | MANTENIMIENTO | SERVICIOS | OTROS
UserRole: ADMIN | CAJERO | INVENTARIOS
```

## 🔧 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- PostgreSQL 15+
- npm o yarn

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/anibau/francachela-pos-PRO-v1.git
cd francachela-pos-PRO-v1

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

### Variables de Entorno

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_DATABASE=francachela_pos

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=1h

# Aplicación
PORT=3000
NODE_ENV=development

# Baileys WhatsApp (opcional)
BAILEYS_SESSION_PATH=./sessions
BAILEYS_WEBHOOK_URL=http://localhost:3000/webhook
```

### Configuración de Base de Datos

```bash
# Crear base de datos
createdb francachela_pos

# Ejecutar migraciones
npm run migration:run

# Cargar datos de prueba
npm run seed
```

## 🚀 Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Testing
npm run test
npm run test:e2e
```

## 📚 API Documentation

Una vez ejecutado el servidor, la documentación Swagger estará disponible en:

```
http://localhost:3000/api/docs
```

### Endpoints Principales

#### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `GET /auth/profile` - Perfil del usuario

#### Productos
- `GET /productos` - Listar productos
- `POST /productos` - Crear producto
- `PUT /productos/:id` - Actualizar producto
- `DELETE /productos/:id` - Eliminar producto

#### Ventas
- `GET /ventas` - Listar ventas
- `POST /ventas` - Registrar venta
- `PUT /ventas/:id/anular` - Anular venta

#### Clientes
- `GET /clientes` - Listar clientes
- `POST /clientes` - Crear cliente
- `GET /clientes/:id/historial` - Historial de compras

## 🔐 Autenticación y Autorización

### Sistema de Roles

```typescript
// Roles disponibles
enum UserRole {
  ADMIN = 'ADMIN',           // Acceso total
  CAJERO = 'CAJERO',         // Ventas y caja
  INVENTARIOS = 'INVENTARIOS' // Solo inventario
}
```

### Protección de Rutas

```typescript
// Ejemplo de uso
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.CAJERO)
@Post()
async crearVenta(@Body() createVentaDto: CreateVentaDto) {
  // Solo ADMIN y CAJERO pueden crear ventas
}
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests de integración
npm run test:e2e

# Coverage
npm run test:cov
```

## 📦 Deployment

### Docker

```dockerfile
# Dockerfile incluido
docker build -t francachela-pos-backend .
docker run -p 3000:3000 francachela-pos-backend
```

### Variables de Producción

```env
NODE_ENV=production
DB_SSL=true
JWT_SECRET=super_secret_production_key
```

## 🔄 Integración con Frontend

Este backend está diseñado para integrarse perfectamente con el frontend React del sistema POS. 

### Configuración del Frontend

```typescript
// En el frontend React
const API_BASE_URL = 'http://localhost:3000/api';

// Configuración de axios
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

## 📈 Características Avanzadas

### Sistema de Puntos
- Acumulación automática por compras
- Canje de puntos por descuentos
- Historial completo de transacciones

### Inventario Inteligente
- Alertas de stock mínimo
- Movimientos automáticos por ventas
- Trazabilidad completa

### Reportes y Analytics
- Ventas por período
- Productos más vendidos
- Análisis de clientes
- Control de caja detallado

## 🛡️ Seguridad

- ✅ Validación de datos con class-validator
- ✅ Sanitización de inputs
- ✅ Autenticación JWT segura
- ✅ Control de roles granular
- ✅ Logs de auditoría
- ✅ Rate limiting
- ✅ CORS configurado

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es privado y propietario de Francachela.

## 🆘 Soporte

Para soporte técnico o consultas:
- Email: soporte@francachela.com
- Issues: GitHub Issues

---

**Desarrollado con ❤️ para optimizar la gestión de tu negocio**

## 🎯 Estado del Proyecto

✅ **COMPLETADO AL 100%**
- Backend completamente funcional
- 0 errores de TypeScript
- Todas las entidades implementadas
- Sistema de autenticación robusto
- API REST completa
- Documentación Swagger
- Seeders de datos de prueba
- Listo para producción

🚀 **PRÓXIMOS PASOS**
- Integración con frontend React
- Despliegue en producción
- Implementación de WebSockets para tiempo real
- Sistema de notificaciones push
- App móvil nativa

