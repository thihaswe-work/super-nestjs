import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { UsersModule } from './users/users.module.js';
import { UsesController } from './uses/uses.controller.js';

@Module({
  imports: [AuthModule, UserModule, UsersModule],
  controllers: [AppController, UsesController],
  providers: [AppService],
})
export class AppModule {}
