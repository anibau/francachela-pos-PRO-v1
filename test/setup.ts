// Jest setup file para configuración global de tests
import { config } from 'dotenv';

// Cargar variables de entorno para tests
config({ path: '.env.test' });

// Configuración global para tests
beforeAll(async () => {
  // Configuración inicial para todos los tests
});

afterAll(async () => {
  // Limpieza después de todos los tests
});

// Mock global para console.log en tests si es necesario
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

