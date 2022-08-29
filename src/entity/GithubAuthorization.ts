import { GithubAuthorizationModel } from 'src/model/github-authorization-model';

export class GithubAuthorization {
  userName: string;
  installation_id: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(input: {
    userName: string;
    installation_id: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, input);
  }

  static fromModel(githubAuthModel: GithubAuthorizationModel): GithubAuthorization {
    return new GithubAuthorization({
        userName: githubAuthModel.userName,
        installation_id: githubAuthModel.installation_id,
        createdAt: githubAuthModel.createdAt,
        updatedAt: githubAuthModel.updatedAt,
        });
  }
}
