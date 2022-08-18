import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { GithubFilter } from './github/github-filter';
import { GithubGuard } from './github/github-gaurd';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/')
  async getMainPage(@Req() req: any, @Res() res: Response): Promise<any> {
    if (!req.isAuthenticated()) {
      return res.render('login');
    }
    const obj = req.user;
    obj.message = '';
    return res.render('home', obj);
  }

  @Get('/auth')
  async login(@Req() req, @Res() res: Response): Promise<any> {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    } else {
      return res.render('login');
    }
  }

  @Get('/logout')
  async logout(@Req() req, @Res() res: Response): Promise<any> {
    if (req.isAuthenticated()) {
      req.logout();
    }
    return res.redirect('/auth');
  }

  @Get('/login')
  @UseGuards(GithubGuard)
  @UseFilters(GithubFilter)
  async githubAuth(): Promise<any> {
    console.log('Logged in');
  }

  @Get('/git/cb')
  @UseGuards(GithubGuard)
  @UseFilters(GithubFilter)
  async gitCallback(@Req() req, @Res() res: Response): Promise<any> {
    if (req.isAuthenticated()) {
      await this.appService.githubLoginDBUpdate(req);
    }
    return res.redirect('/');
  }

  @Post('/add-repo')
  async addRepo(@Req() req, @Res() res: Response): Promise<any> {
    if (req.isAuthenticated()) {
      await this.appService.addRepo(req, res);
    } else {
      return res.redirect('/');
    }
  }
}
