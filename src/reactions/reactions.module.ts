import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ReactionsService } from './reactions.service.js';
import { ReactionsController } from './reactions.controller.js';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'local' })],
  providers: [ReactionsService],
  controllers: [ReactionsController],
  exports: [ReactionsService],
})
export class ReactionsModule {}
