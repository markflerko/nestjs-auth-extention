import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cors from 'cors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  app.use(
    //TODO: change to frontend url before release
    cors({
      credentials: true,
      origin: function (origin, callback) {
        return callback(null, true);
      },
    }),
  );
  const PORT = 3001;
  await app.listen(PORT, () => {
    Logger.log(`PORT = ${PORT}`);
  });
}
bootstrap();
