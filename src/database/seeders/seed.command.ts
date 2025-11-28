import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DatabaseSeeder } from './database.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const seeder = app.get(DatabaseSeeder);
    await seeder.seed();
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();

