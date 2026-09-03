import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import { GoogleAuthService } from './google-auth.service.js';
import { FacebookAuthService } from './facebook-auth.service.js';
import { FirebaseAuthService } from './firebase-auth.service.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private googleAuthService: GoogleAuthService,
    private facebookAuthService: FacebookAuthService,
    private firebaseAuthService: FirebaseAuthService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(dto: RegisterDto) {
    if (dto.provider === 'local') {
      return this.registerLocal(dto);
    }
    if (dto.provider === 'google') {
      return this.registerGoogle(dto);
    }
    if (dto.provider === 'facebook') {
      return this.registerFacebook(dto);
    }
    return this.registerFirebase(dto);
  }

  private async registerLocal(dto: RegisterDto) {
    if (!dto.email || !dto.password) {
      throw new BadRequestException('email and password are required for local registration');
    }

    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('A user with this email already exists');
    }

    const user = await this.usersService.createUser({
      email: dto.email,
      username: dto.username || dto.email.split('@')[0],
      password: dto.password,
    });

    return this.login(user);
  }

  private async registerGoogle(dto: RegisterDto) {
    if (!dto.accessToken) {
      throw new BadRequestException('accessToken is required for google registration');
    }

    const info = await this.googleAuthService.verifyAccessToken(dto.accessToken);
    if (!info.email) {
      throw new BadRequestException('Google account has no verified email');
    }

    let user = await this.usersService.findByEmail(info.email);
    if (!user) {
      user = await this.usersService.createUser({
        email: info.email,
        username: info.name || info.email.split('@')[0],
        photo: info.picture ?? undefined,
      });
    }

    return this.login(user);
  }

  private async registerFacebook(dto: RegisterDto) {
    if (!dto.accessToken) {
      throw new BadRequestException('accessToken is required for facebook registration');
    }

    const info = await this.facebookAuthService.verifyAccessToken(dto.accessToken);
    if (!info.email) {
      throw new BadRequestException('Facebook account has no verified email');
    }

    let user = await this.usersService.findByEmail(info.email);
    if (!user) {
      user = await this.usersService.createUser({
        email: info.email,
        username: info.name || info.email.split('@')[0],
        photo: info.picture ?? undefined,
      });
    }

    return this.login(user);
  }

  private async registerFirebase(dto: RegisterDto) {
    if (!dto.idToken) {
      throw new BadRequestException('idToken is required for firebase registration');
    }

    const info = await this.firebaseAuthService.verifyIdToken(dto.idToken);
    if (!info.email) {
      throw new BadRequestException('Firebase account has no verified email');
    }

    let user = await this.usersService.findByEmail(info.email);
    if (!user) {
      user = await this.usersService.createUser({
        email: info.email,
        username: info.name || info.email.split('@')[0],
        photo: info.picture ?? undefined,
      });
    }

    return this.login(user);
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
