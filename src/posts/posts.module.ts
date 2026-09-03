import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PostsService } from './posts.service.js';
import { PostsController } from './posts.controller.js';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'local' })],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
