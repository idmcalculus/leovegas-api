import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req: Request, @Res() res: Response): void {
    const host = req.protocol + '://' + req.get('host');
    res.set('Content-Type', 'text/html');
    res.send(this.appService.getHello(host));
  }
}
