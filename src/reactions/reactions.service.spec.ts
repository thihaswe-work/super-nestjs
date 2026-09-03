import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ReactionsService } from './reactions.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('ReactionsService', () => {
  let service: ReactionsService;
  let reactionMock: any;
  let postMock: any;

  beforeEach(async () => {
    reactionMock = {
      where: vi.fn().mockReturnThis(),
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
        ReactionsService,
        {
          provide: PrismaService,
          useValue: {
            client: { orm: { public: { Reaction: reactionMock, Post: postMock } } },
          },
        },
      ],
    }).compile();

    service = module.get<ReactionsService>(ReactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('throws NotFoundException when reacting to a missing post', async () => {
    postMock.first.mockResolvedValue(null);
    await expect(service.react(1, 99, 'like')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates a reaction when none existed', async () => {
    postMock.first.mockResolvedValue({ id: 99 });
    reactionMock.first.mockResolvedValue(null);
    reactionMock.create.mockResolvedValue({ id: 1, postId: 99, userId: 1, type: 'like' });

    const result = await service.react(1, 99, 'like');
    expect(result).toEqual({ id: 1, postId: 99, userId: 1, type: 'like' });
    expect(reactionMock.create).toHaveBeenCalledWith({ postId: 99, userId: 1, type: 'like' });
  });

  it('updates an existing reaction type', async () => {
    postMock.first.mockResolvedValue({ id: 99 });
    reactionMock.first.mockResolvedValue({ id: 7, postId: 99, userId: 1, type: 'like' });
    reactionMock.update.mockResolvedValue({ id: 7, type: 'love' });

    await service.react(1, 99, 'love');
    expect(reactionMock.update).toHaveBeenCalledWith({ type: 'love' });
  });

  it('unreacts by deleting when a reaction exists', async () => {
    reactionMock.first.mockResolvedValue({ id: 7, postId: 99, userId: 1 });
    reactionMock.delete.mockResolvedValue({ id: 7 });

    await expect(service.unreact(1, 99)).resolves.toEqual({ id: 7 });
    expect(reactionMock.where).toHaveBeenCalledWith({ id: 7 });
  });

  it('returns null when unreacting with no existing reaction', async () => {
    reactionMock.first.mockResolvedValue(null);
    await expect(service.unreact(1, 99)).resolves.toBeNull();
  });
});
