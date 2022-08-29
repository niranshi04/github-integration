import { Sequelize } from 'sequelize-typescript';
import { Logger } from '@nestjs/common';
import { GithubAuthorizationModel } from './model/github-authorization-model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const dbName = "postgres";
      const dbUser = "postgres";
      const dbHost = "localhost";
      const dbDriver = 'postgres';
      const dbPassword = "smile123";
      const dbPort = 5432;
      const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
        host: dbHost,
        dialect: dbDriver,
        port: dbPort,
        logging: (msg) => Logger.debug(msg),
      });
      sequelize.addModels([
        GithubAuthorizationModel
      ]);
      // await sequelize.sync({ force: true });
      await sequelize.sync();
      return sequelize;
    },
  },
];

export const spacesProviders = [
  {
    provide: 'GITHUB_AUTHORIZATION_DAO',
    useValue: GithubAuthorizationModel,
  }
];
