# 🍻 Sistema POS Francachela - Backend API

Backend completo para el Sistema de Punto de Venta Francachela desarrollado con NestJS, TypeScript, PostgreSQL y TypeORM.

## 🚀 Características Principales

### ✅ Módulos Implementados

1. **Autenticación y Usuarios**
   - ✅ JWT Authentication con roles (ADMIN, CAJERO, INVENTARIOS)
   - ✅ CRUD completo de usuarios
   - ✅ Protección de rutas por roles
   - ✅ Encriptación de contraseñas con bcrypt

2. **Gestión de Productos e Inventario**
   - ✅ CRUD completo de productos
   - ✅ Búsqueda por código de barras, nombre, categoría
   - ✅ Control de stock con movimientos de inventario
   - ✅ Alertas de stock bajo
   - ✅ Precios normales y de mayoreo
   - ✅ Sistema de puntos por producto

3. **Gestión de Clientes**
   - ✅ CRUD completo de clientes
   - ✅ Sistema de puntos de fidelidad
   - ✅ Historial de compras y canjes
   - ✅ Búsqueda por DNI, nombre, código corto
   - ✅ Clientes cumpleañeros

4. **Sistema de Ventas (POS)**
   - ✅ Creación de ventas con múltiples productos
   - ✅ Aplicación automática de puntos
   - ✅ Múltiples métodos de pago
   - ✅ Generación de tickets únicos
   - ✅ Anulación de ventas con reversión de inventario
   - ✅ Estadísticas de ventas

5. **Promociones**
   - ✅ CRUD de promociones
   - ✅ Tipos: porcentaje, monto fijo, 2x1, 3x2
   - ✅ Fechas de vigencia
   - ✅ Límites de uso
   - ✅ Aplicación automática

6. **Caja Registradora**
   - ✅ Apertura y cierre de caja
   - ✅ Control de efectivo inicial y final
   - ✅ Desglose por método de pago
   - ✅ Cálculo automático de diferencias
   - ✅ Estadísticas de caja

7. **Control de Gastos**
   - ✅ Registro de gastos operativos
   - ✅ Categorización de gastos
   - ✅ Comprobantes y proveedores
   - ✅ Estadísticas por categoría

## 🏗️ Arquitectura Técnica

### Stack Tecnológico
- **Framework**: NestJS 10.x
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM
- **Autenticación**: JWT + Passport
- **Validación**: class-validator + class-transformer
- **Documentación**: Swagger/OpenAPI

### Estructura del Proyecto

```
src/
├── auth/                 # Módulo de autenticación
│   ├── guards/          # Guards JWT y roles
│   ├── strategies/      # Estrategias Passport
│   └── dto/            # DTOs de login
├── users/               # Gestión de usuarios
├── productos/           # Gestión de productos e inventario
├── clientes/           # Gestión de clientes y puntos
├── ventas/             # Sistema POS y ventas
├── promociones/        # Sistema de promociones
├── caja/               # Caja registradora
├── gastos/             # Control de gastos
├── entities/           # Entidades TypeORM
├── common/             # Utilidades compartidas
│   ├── decorators/     # Decoradores personalizados
│   ├── guards/         # Guards compartidos
│   ├── dto/           # DTOs compartidos
│   └── interfaces/     # Interfaces compartidas
└── config/             # Configuraciones
```

## 🗄️ Modelo de Base de Datos

### Entidades Principales

1. **Usuario** - Gestión de usuarios del sistema
2. **Producto** - Catálogo de productos
3. **Cliente** - Base de datos de clientes
4. **Venta** - Transacciones de venta
5. **Promocion** - Promociones y descuentos
6. **Combo** - Combos de productos
7. **Caja** - Sesiones de caja registradora
8. **Gasto** - Gastos operativos
9. **Delivery** - Gestión de entregas
10. **MovimientoInventario** - Auditoría de inventario

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- PostgreSQL 12+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd francachela-pos-backend

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
DB_PASSWORD=password
DB_DATABASE=francachela_pos

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Aplicación
PORT=3000
NODE_ENV=development
```

### Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Modo watch
npm run start:debug
```

## 📚 API Documentation

La documentación completa de la API está disponible en Swagger:

```
http://localhost:3000/api
```

### Endpoints Principales

#### Autenticación
- `POST /auth/login` - Iniciar sesión
- `GET /auth/profile` - Obtener perfil del usuario

#### Productos
- `GET /productos` - Listar productos
- `POST /productos` - Crear producto
- `GET /productos/codigo/:codigo` - Buscar por código de barras
- `PATCH /productos/:id/stock` - Actualizar stock

#### Clientes
- `GET /clientes` - Listar clientes
- `POST /clientes` - Crear cliente
- `GET /clientes/dni/:dni` - Buscar por DNI

#### Ventas
- `POST /ventas` - Crear venta
- `GET /ventas/hoy` - Ventas del día
- `PATCH /ventas/:id/anular` - Anular venta

#### Caja
- `POST /caja/abrir` - Abrir caja
- `PATCH /caja/:id/cerrar` - Cerrar caja
- `GET /caja/resumen` - Resumen de caja actual

## 🔐 Sistema de Roles

### Roles Disponibles

1. **ADMIN** - Acceso completo al sistema
2. **CAJERO** - Operaciones de venta y caja
3. **INVENTARIOS** - Gestión de productos y stock

### Protección de Rutas

Todas las rutas están protegidas con:
- **JwtAuthGuard** - Verificación de token JWT
- **RolesGuard** - Verificación de roles específicos

## 🎯 Flujos de Negocio

### Flujo de Venta

1. Cajero abre caja registradora
2. Busca productos por código de barras
3. Agrega productos al carrito
4. Asocia cliente (opcional)
5. Aplica descuentos/promociones
6. Usa puntos del cliente (opcional)
7. Selecciona método de pago
8. Completa la venta
9. Sistema actualiza automáticamente:
   - Stock de productos
   - Puntos del cliente
   - Totales de caja

### Flujo de Inventario

1. Recepción de mercancía
2. Registro de entrada en sistema
3. Actualización automática de stock
4. Generación de movimiento de inventario
5. Alertas automáticas de stock bajo

## 🔄 Integración con Frontend

Este backend está diseñado para integrarse con el frontend React del Sistema POS Francachela. Proporciona:

- **API RESTful** completa
- **Documentación Swagger** para desarrollo
- **Validación de datos** robusta
- **Manejo de errores** consistente
- **Paginación** en todas las listas
- **Filtros y búsquedas** avanzadas

## 🚀 Próximas Funcionalidades

- [ ] Módulo de Delivery completo
- [ ] Módulo de Combos avanzado
- [ ] Integración con Baileys (WhatsApp)
- [ ] Reportes avanzados en PDF
- [ ] Dashboard en tiempo real
- [ ] Notificaciones push
- [ ] Backup automático
- [ ] Logs de auditoría

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run start:dev      # Modo desarrollo con hot reload
npm run start:debug    # Modo debug

# Construcción
npm run build          # Compilar para producción
npm run start:prod     # Ejecutar en producción

# Testing
npm run test           # Tests unitarios
npm run test:e2e       # Tests end-to-end
npm run test:cov       # Coverage de tests

# Linting
npm run lint           # Verificar código
npm run format         # Formatear código

# Base de datos
npm run typeorm        # Comandos TypeORM CLI
```

## 📊 Monitoreo y Logs

El sistema incluye:
- **Logging estructurado** con Winston
- **Validación de entrada** en todos los endpoints
- **Manejo de errores** centralizado
- **Métricas de performance** básicas

## 🔒 Seguridad

Implementaciones de seguridad:
- **Autenticación JWT** robusta
- **Encriptación de contraseñas** con bcrypt
- **Validación de entrada** estricta
- **Protección CORS** configurada
- **Rate limiting** (recomendado para producción)

## 📄 Licencia

Proyecto privado - Francachela POS System

---

**Desarrollado con ❤️ usando NestJS y TypeScript para optimizar la gestión de tu negocio**

