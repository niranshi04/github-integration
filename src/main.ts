import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
ConfigModule.forRoot();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  await app.listen(process.env.PORT || 5000);
}
bootstrap();
