import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ForbiddenException } from '@nestjs/common';

@Catch(ForbiddenException)
export class GithubFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    console.log('AuthRedirectFilter', status);

    response.status(status).redirect('/auth');
  }
}
