import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CommentsService } from './comments.service.js';
import { CommentsController } from './comments.controller.js';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'local' })],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
