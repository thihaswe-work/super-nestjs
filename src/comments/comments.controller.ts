import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard.js';

@Controller('posts')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  create(
    @Request() req: any,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(req.user.userId, postId, dto);
  }

  @Get(':postId/comments')
  findByPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentsService.findByPost(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':postId/comments/:id')
  update(
    @Request() req: any,
    @Param('postId', ParseIntPipe) _postId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId/comments/:id')
  remove(
    @Request() req: any,
    @Param('postId', ParseIntPipe) _postId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commentsService.remove(id, req.user.userId);
  }
}
