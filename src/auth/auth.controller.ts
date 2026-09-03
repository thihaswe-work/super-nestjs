import { Controller, Request, Get, Post, UseGuards, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guard/jwt-auth.guard.js';
import { RegisterDto } from './dto/register.dto.js';
@Controller('/auth')
export class AuthController {
    constructor(private authService: AuthService,) { }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    // @UseGuards(AuthGuard('local'))
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: any) {
        return this.authService.login(req.user);
    }

    @UseGuards(LocalAuthGuard)
    @Post('logout')
    async logout(@Request() req: any) {
        return req.logout();
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req: any) {
        return req.user;
    }


}
