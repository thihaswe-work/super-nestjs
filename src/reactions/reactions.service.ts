import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ReactionType } from './dto/react.dto.js';

@Injectable()
export class ReactionsService {
  constructor(private readonly prisma: PrismaService) {}

  private get reaction() {
    return this.prisma.client.orm.public.Reaction;
  }

  private get post() {
    return this.prisma.client.orm.public.Post;
  }

  async react(userId: number, postId: number, type: ReactionType) {
    const post = await this.post.where((p) => p.id.eq(postId)).first();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existing = await this.reaction
      .where((r) => r.postId.eq(postId) && r.userId.eq(userId))
      .first();

    if (existing) {
      return await this.reaction
        .where({ id: existing.id })
        .update({ type });
    }

    return await this.reaction.create({ postId, userId, type });
  }

  async unreact(userId: number, postId: number) {
    const existing = await this.reaction
      .where((r) => r.postId.eq(postId) && r.userId.eq(userId))
      .first();

    if (!existing) {
      return null;
    }

    return await this.reaction.where({ id: existing.id }).delete();
  }

  async findByPost(postId: number) {
    return await this.reaction.where((r) => r.postId.eq(postId)).all();
  }
}
