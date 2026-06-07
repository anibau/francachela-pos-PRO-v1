import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'JWT_SECRET no está definido. Configura la variable de entorno antes de iniciar la aplicación.',
    );
  }
  return {
    secret,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  };
});

