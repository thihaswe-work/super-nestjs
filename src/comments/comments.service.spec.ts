import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CommentsService } from './comments.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('CommentsService', () => {
  let service: CommentsService;
  let commentMock: any;
  let postMock: any;

  beforeEach(async () => {
    commentMock = {
      where: vi.fn().mockReturnThis(),
      include: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      first: vi.fn(),
      all: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    postMock = {
      where: vi.fn().mockReturnThis(),
      first: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: PrismaService,
          useValue: {
            client: { orm: { public: { Comment: commentMock, Post: postMock } } },
          },
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('throws NotFoundException when creating a comment on a missing post', async () => {
    postMock.first.mockResolvedValue(null);
    await expect(service.create(1, 99, { content: 'hi' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('creates a comment when post exists and no parent', async () => {
    postMock.first.mockResolvedValue({ id: 99 });
    commentMock.create.mockResolvedValue({ id: 1, content: 'hi', postId: 99, userId: 1 });

    await expect(service.create(1, 99, { content: 'hi' })).resolves.toEqual({
      id: 1,
      content: 'hi',
      postId: 99,
      userId: 1,
    });
    expect(commentMock.create).toHaveBeenCalledWith({
      content: 'hi',
      postId: 99,
      userId: 1,
      parentId: null,
    });
  });

  it('supports replying to a comment on the same post', async () => {
    postMock.first.mockResolvedValue({ id: 99 });
    commentMock.first.mockResolvedValue({ id: 5, postId: 99 });
    commentMock.create.mockResolvedValue({ id: 2 });

    await service.create(1, 99, { content: 'reply', parentId: 5 });
    expect(commentMock.create).toHaveBeenCalledWith({
      content: 'reply',
      postId: 99,
      userId: 1,
      parentId: 5,
    });
  });

  it('rejects a parent comment from another post', async () => {
    postMock.first.mockResolvedValue({ id: 99 });
    commentMock.first.mockResolvedValue({ id: 5, postId: 50 });
    await expect(service.create(1, 99, { content: 'reply', parentId: 5 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws NotFoundException when updating a missing comment', async () => {
    commentMock.first.mockResolvedValue(null);
    await expect(service.update(1, 1, { content: 'x' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('forbids updating another users comment', async () => {
    commentMock.first.mockResolvedValue({ id: 1, userId: 2 });
    await expect(service.update(1, 99, { content: 'x' })).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('forbids deleting another users comment', async () => {
    commentMock.first.mockResolvedValue({ id: 1, userId: 2 });
    await expect(service.remove(1, 99)).rejects.toBeInstanceOf(ForbiddenException);
  });
});
