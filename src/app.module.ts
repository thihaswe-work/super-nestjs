import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { PostsModule } from './posts/posts.module.js';
import { ReactionsModule } from './reactions/reactions.module.js';
import { CommentsModule } from './comments/comments.module.js';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    PostsModule,
    ReactionsModule,
    CommentsModule,
    PassportModule.register({ defaultStrategy: 'local' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
