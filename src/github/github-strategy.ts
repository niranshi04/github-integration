import { Strategy } from 'passport-github';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['repo'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    cb: any,
  ): void {
    const { username, profileUrl } = profile;
    const user = {
      accessToken,
      username,
      profileUrl,
    };
    cb(null, user);
  }
}
