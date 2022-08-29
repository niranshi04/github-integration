import {
  Controller,
  Get,
  Req,
  Res,
  Query,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';
import { Octokit } from '@octokit/rest';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, private readonly httpService: HttpService) {}


@Get ('/linkGithub') 
async linkGit(@Req() req, @Res() res ) : Promise<void> {
    const providerUrl = "https://github.com/apps/git-integrate/installations/new";
      const stateObj: {userName : string} = {
       userName : req.user.userName
      };
      const url = new URL(providerUrl);
      url.searchParams.set('state', JSON.stringify(stateObj));
      res.redirect(url.toString());
}
  @Get('/auth/github/callback')
  async gitCallback(@Query() query: { installation_id: number, code: string, state:string }, @Res() res): Promise<void> {
    if(query.installation_id)  
    { const stateJson = JSON.parse(query.state) as {userName : string};
        const success = await this.appService.upsertGithubAuthorization(
        stateJson.userName,
        query.installation_id
      );
      res.redirect(`http://localhost:5001/integrations?tab=git`);
    }
  }

  @Get('/installations')
  async getAllInstallations(@Req() req): Promise<any> {
    const installations = await this.appService.getAllInstallations(req.user.userName);
    // https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#jwt-payload
    const token = this.appService.getGithubAppToken();
    const octokit = new Octokit({
        auth: token
    });
    let installation_details : { name: string, installation_id: number }[] = [];
    await Promise.all(installations.map(async (installation) => {
        const resp = await octokit.request('GET /app/installations/{installation_id}', {
            installation_id: installation['installation_id']
        })
        installation_details.push({name : resp.data['account'].login, installation_id: installation['installation_id']});
    }));
    return installation_details;
    }

@Get('/getRepositories')
  async getAllRepositories(@Req() req): Promise<any> {
    const installations = await this.appService.getAllInstallations("niranshi");
    // https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#jwt-payload
    const token = this.appService.getGithubAppToken();
    const octokit = new Octokit({
        auth: token
    });
    let repositories : { name: string, installation_id: number, owner: string, url: string }[] = [];
    await Promise.all(installations.map(async (installation) => {
        const resp = await octokit.request('POST /app/installations/{installation_id}/access_tokens', {
            installation_id: installation['installation_id']
        });
        const octokit_1 = new Octokit({
            auth: resp.data['token']
        });
        const resp1 = await octokit_1.request('GET /installation/repositories', {})
        resp1.data.repositories.forEach(repository => {
            repositories.push({name : repository['full_name'],
                            installation_id: installation['installation_id'],
                            owner: repository['owner'].login,
                            url: repository['html_url']})
        })
    }));
    return repositories;     
}

@Get('/GetBranches')
async getBranches(@Req() req, @Query() query: { installation_id: number, repo_name : string, owner: string}): Promise<any> {
      const token = this.appService.getGithubAppToken();
      const octokit = new Octokit({
        auth: token
    });
    const resp = await octokit.request('POST /app/installations/{installation_id}/access_tokens', {
        installation_id: query.installation_id
    });
    const octokit_1 = new Octokit({
        auth: resp.data['token']
    });
    let branches : string[] = [];
    const resp1 = await octokit_1.request('GET /repos/{owner}/{repo}/branches', {
        owner: query.owner,
        repo: query.repo_name
    });
    resp1.data.forEach(branch => {
        branches.push(branch.name);
    })
    return branches;
}

@Get('UnlinkGithub')
async unlinkGithub(@Req() req, @Query() query: { installation_id: number}): Promise<void> {
    const token = this.appService.getGithubAppToken();
    const octokit = new Octokit({
        auth: token
    });
      
    await octokit.request('DELETE /app/installations/{installation_id}', {
        installation_id: query.installation_id
    });
    const success = await this.appService.deleteGithubAuthorization(
        "niranshi",
        query.installation_id
      );
      if (!success) {
        throw new HttpException(
          `Error deleting github authorization details.`,
          HttpStatus.BAD_REQUEST,
        );
      }
  }

@Get('/Deploy')
async deployCode(@Req() req, @Query() query: { installation_id: number}): Promise<any> {
      const token = this.appService.getGithubAppToken();
      const octokit = new Octokit({
        auth: token
    });
      const resp = await octokit.request('GET /app/installations/{installation_id}/access_tokens', {
        installation_id: query.installation_id
    });

}

}
