import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePostDto, PostType } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  private get post() {
    return this.prisma.client.orm.public.Post;
  }

  async create(authorId: number, dto: CreatePostDto) {
    return await this.post.create({
      title: dto.title,
      content: dto.content ?? null,
      type: dto.type,
      authorId,
    });
  }

  async findAll(type?: PostType) {
    const collection = type ? this.post.where((p) => p.type.eq(type)) : this.post;
    return await collection.include('author', (author) =>
      author.select('id', 'email', 'username', 'photo'),
    ).all();
  }

  async findOne(id: number) {
    const post = await this.post
      .include('author', (author) => author.select('id', 'email', 'username', 'photo'))
      .where((p) => p.id.eq(id))
      .first();

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(id: number, dto: UpdatePostDto) {
    const existing = await this.post.where((p) => p.id.eq(id)).first();
    if (!existing) {
      throw new NotFoundException('Post not found');
    }

    return await this.post
      .where({ id })
      .update({
        title: dto.title ?? existing.title,
        content: dto.content !== undefined ? dto.content : existing.content,
        type: dto.type ?? existing.type,
      });
  }

  async remove(id: number) {
    const existing = await this.post.where((p) => p.id.eq(id)).first();
    if (!existing) {
      throw new NotFoundException('Post not found');
    }

    return await this.post.where({ id }).delete();
  }
}
