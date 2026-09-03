import { Controller, Request, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service.js';
import { LocalAuthGuard } from './auth/local-auth.guard.js';
import { AuthService } from './auth/auth.service.js';
import { JwtAuthGuard } from './auth/jwt-auth.guard.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  // @UseGuards(AuthGuard('local'))

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    return req.logout();
  }

  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
