import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  private get comment() {
    return this.prisma.client.orm.public.Comment;
  }

  private get post() {
    return this.prisma.client.orm.public.Post;
  }

  async create(userId: number, postId: number, dto: CreateCommentDto) {
    const post = await this.post.where((p) => p.id.eq(postId)).first();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (dto.parentId !== undefined) {
      const parent = await this.comment.where((c) => c.id.eq(dto.parentId!)).first();
      if (!parent) {
        throw new NotFoundException('Parent comment not found');
      }
      if (parent.postId !== postId) {
        throw new BadRequestException('Parent comment does not belong to this post');
      }
    }

    return await this.comment.create({
      content: dto.content,
      postId,
      userId,
      parentId: dto.parentId ?? null,
    });
  }

  async findByPost(postId: number) {
    return await this.comment
      .where((c) => c.postId.eq(postId))
      .include('user', (author) => author.select('id', 'email', 'username', 'photo'))
      .orderBy((c) => c.createdAt.desc())
      .all();
  }

  async update(id: number, userId: number, dto: UpdateCommentDto) {
    const comment = await this.comment.where((c) => c.id.eq(id)).first();
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only edit your own comment');
    }

    return await this.comment.where({ id }).update({ content: dto.content });
  }

  async remove(id: number, userId: number) {
    const comment = await this.comment.where((c) => c.id.eq(id)).first();
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comment');
    }

    return await this.comment.where({ id }).delete();
  }
}
