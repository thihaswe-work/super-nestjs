import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsersModule } from '../users/users.module.js';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy.js';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants.js';
import { JwtStrategy } from './strategy/jwt.strategy.js';
import { GoogleAuthService } from './google-auth.service.js';
import { FacebookAuthService } from './facebook-auth.service.js';
import { FirebaseAuthService } from './firebase-auth.service.js';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: "local" }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleAuthService, FacebookAuthService, FirebaseAuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
