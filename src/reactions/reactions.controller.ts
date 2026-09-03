import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReactionsService } from './reactions.service.js';
import { ReactDto } from './dto/react.dto.js';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard.js';

@Controller('posts')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':postId/reactions')
  react(
    @Request() req: any,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: ReactDto,
  ) {
    return this.reactionsService.react(req.user.userId, postId, dto.type);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId/reactions')
  unreact(
    @Request() req: any,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.reactionsService.unreact(req.user.userId, postId);
  }
}
