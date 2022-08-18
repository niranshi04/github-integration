import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
ConfigModule.forRoot();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const viewsPath = join(__dirname, '../views');
  const publicPath = join(__dirname, '../public');
  app.set('views', viewsPath);
  app.set('view engine', '.hbs');
  app.use(express.static(publicPath));
  app.use(
    session({
      cookie: {
        maxAge: 60 * 60 * 1000,
      },
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT || 5000);
}
bootstrap();
