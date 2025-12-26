import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'],
    credentials: true,
  });

  // Configurar validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('🍻 Francachela POS API')
    .setDescription(`
    ## Sistema de Punto de Venta Completo
    
    API REST para el sistema POS Francachela con funcionalidades completas de:
    
    ### 📋 Módulos Disponibles
    - **👥 Autenticación**: Login con JWT y roles
    - **🍺 Productos**: Gestión de inventario y catálogo
    - **👤 Clientes**: Sistema de fidelidad y puntos
    - **🛒 Ventas**: POS completo con múltiples métodos de pago
    - **🎁 Promociones**: Descuentos y ofertas especiales
    - **💰 Caja**: Control de apertura/cierre y flujo de efectivo
    - **💸 Gastos**: Registro de gastos operativos
    - **🚚 Delivery**: Gestión completa de entregas
    - **📦 Inventario**: Tracking de movimientos de stock
    - **📱 WhatsApp**: Notificaciones automáticas
    - **📊 Excel**: Exportación de reportes
    
    ### 🔐 Autenticación
    Usa **Bearer Token** en el header Authorization para acceder a los endpoints protegidos.
    
    ### 👥 Roles de Usuario
    - **ADMIN**: Acceso completo a todos los módulos
    - **CAJERO**: Operaciones de venta y consultas
    - **INVENTARIOS**: Gestión de stock y productos
    
    ### 🚀 Tecnologías
    - **Backend**: NestJS + TypeScript
    - **Base de Datos**: PostgreSQL + TypeORM
    - **Validación**: class-validator
    - **Documentación**: Swagger/OpenAPI
    - **WhatsApp**: Baileys
    - **Reportes**: ExcelJS
    `)
    .setVersion('2.0.0')
    .setContact(
      'Francachela POS',
      'https://francachela.com',
      'soporte@francachela.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .addServer('http://localhost:3000', 'Servidor de Desarrollo')
    .addServer('https://api.francachela.com', 'Servidor de Producción')
    .addTag('Autenticación', 'Endpoints de login y gestión de sesiones')
    .addTag('Usuarios', 'Gestión de usuarios del sistema')
    .addTag('Productos', 'Catálogo de productos e inventario')
    .addTag('Clientes', 'Gestión de clientes y sistema de puntos')
    .addTag('Ventas', 'Punto de venta y transacciones')
    .addTag('Promociones', 'Descuentos y ofertas especiales')
    .addTag('Caja', 'Control de caja registradora')
    .addTag('Gastos', 'Registro de gastos operativos')
    .addTag('Delivery', 'Gestión de entregas a domicilio')
    .addTag('Movimiento Inventario', 'Tracking de movimientos de stock')
    .addTag('WhatsApp', 'Notificaciones automáticas por WhatsApp')
    .addTag('Excel Export', 'Exportación de reportes en Excel')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Francachela POS API',
    customfavIcon: '🍻',
    customCss: `
      .topbar-wrapper img { content: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHRleHQgeD0iNSIgeT0iMjgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzMzNzNkYyI+8J+Nuwo8L3RleHQ+Cjwvc3ZnPgo='); }
      .swagger-ui .topbar { background-color: #3373dc; }
      .swagger-ui .info .title { color: #3373dc; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Aplicación ejecutándose en: http://localhost:${port}`);
  console.log(`📚 Documentación Swagger: http://localhost:${port}/api`);
}
bootstrap();
