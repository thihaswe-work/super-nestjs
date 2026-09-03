import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { PassportModule } from '@nestjs/passport';
import { GoogleAuthService } from './google-auth.service.js';
import { FacebookAuthService } from './facebook-auth.service.js';
import { FirebaseAuthService } from './firebase-auth.service.js';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'local' })],
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        JwtService,
        {
          provide: PrismaService,
          useValue: { client: { orm: { public: { User: {} } } } },
        },
        {
          provide: GoogleAuthService,
          useValue: { verifyAccessToken: async () => ({}) },
        },
        {
          provide: FacebookAuthService,
          useValue: { verifyAccessToken: async () => ({}) },
        },
        {
          provide: FirebaseAuthService,
          useValue: { verifyIdToken: async () => ({}) },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

