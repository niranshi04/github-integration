import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { databaseProviders, spacesProviders } from './database.providers';
import { JwtModule } from '@nestjs/jwt';
import { pem } from './constants';

@Module({
  imports: [
    JwtModule.register({ secret: pem,
        signOptions: { algorithm: 'RS256'}, }),
    HttpModule
  ],
  controllers: [AppController],
  providers: [
    ...databaseProviders,
    ...spacesProviders,
    AppService],
})
export class AppModule {}
