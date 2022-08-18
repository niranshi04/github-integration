import { Injectable, Inject } from '@nestjs/common';
import { Users } from './users/users.entity';
import { Octokit } from "@octokit/rest";
import { UsersService } from './users/users.service';
import { Base64 } from 'js-base64';
import { join } from 'path';
import * as fs from 'fs';


@Injectable()
export class AppService {
  @Inject(UsersService)
    private readonly usersService: UsersService;

  async githubLoginDBUpdate(req): Promise<any> {
    try{
        await this.usersService.create(<Users>req.user);
        return {
            message: 'Added or updated the user in db.'
        };
    } catch(e) {
        return {
            message: e.message
        };
    }
  }

  async addRepo(req, res): Promise<any> {
    const repoName = req.body.repository;
    const user = req.user;
    const obj = req.user;
    try {
        const octokit = new Octokit({
            auth: user.accessToken
        });
        await octokit.repos.createForAuthenticatedUser({
            name: repoName
        });
        const content = fs.readFileSync(join(__dirname, '../input.txt'), "utf-8");
        const contentEncoded = Base64.encode(content);
        
        await octokit.repos.createOrUpdateFileContents({
            // replace the owner and email with your own details
            owner: user.username,
            repo: repoName,
            path: "Readme.md",
            message: "feat: Added Readme.md programatically",
            content: contentEncoded,
            committer: {
            name: process.env.OWNER_USERNAME,
            email: process.env.OWNER_EMAIL
            },
            author: {
            name: process.env.OWNER_USERNAME,
            email: process.env.OWNER_EMAIL,
            },
        });
        obj.message = 'Repository Successfully Created';
        return res.render('home', obj);
    } catch(e) {
        console.log(e.stack);
        obj.message = 'Failed to Create Repository.';
        return res.render('home', obj);
    }
  }
}
