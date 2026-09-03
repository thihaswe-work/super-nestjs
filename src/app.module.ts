import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'local' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
