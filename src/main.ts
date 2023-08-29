import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const PORT = 3001;
  await app.listen(PORT, () => {
    Logger.log(`PORT = ${PORT}`);
  });
}
bootstrap();
