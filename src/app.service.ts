import { Injectable, Inject } from '@nestjs/common';
import { Transaction } from 'sequelize/types';
import { GithubAuthorizationModel } from './model/github-authorization-model';
import { GithubAuthorization } from './entity/GithubAuthorization'; 
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AppService {
    constructor(
    @Inject('GITHUB_AUTHORIZATION_DAO')
    private githubAuthorizationRepo: typeof GithubAuthorizationModel,
    private jwtService: JwtService) {}

    public async upsertGithubAuthorization(
        userName: string,
        installation_id: number,
        transaction?: Transaction,
      ) {
        const githubAuthEntity = new GithubAuthorization({
            userName,
            installation_id
        });
        const success = await this.githubAuthorizationRepo.upsert(githubAuthEntity, {
          transaction,
        });
        return success[0];
      }

      public async getAllInstallations( userName: string ) {
        return await this.githubAuthorizationRepo.findAll({
            where: {
            userName: userName
            }
        });

      }

      public getGithubAppToken = () => {
        const timestamp = Math.floor(Date.now() / 1000);
        const expiryTime = 9 * 60;
        const payload = {
            // Issued at time
            iat: timestamp,
            // JWT expiration time
            exp: timestamp + expiryTime,
            // Github app identifier
            iss: 232055,
        };
    
        const token = this.jwtService.sign(payload);
        return token;
        };

    public async deleteGithubAuthorization(
        userName: string,
        installation_id: number,
        transaction?: Transaction,
    ) {
    return await this.githubAuthorizationRepo.destroy({
        where: {
            userName,
            installation_id,
        },
        transaction: transaction,
      });
    }
}
