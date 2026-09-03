import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('PostsService', () => {
  let service: PostsService;
  let postMock: any;

  const postFactory = () => ({
    select: vi.fn().mockReturnThis(),
    include: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    first: vi.fn(),
    all: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  });

  beforeEach(async () => {
    postMock = postFactory();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: { client: { orm: { public: { Post: postMock } } } },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a post with authorId and type', async () => {
    const input = { title: 'Hello', content: 'World', type: 'question' as const };
    const created = { id: 1, ...input, authorId: 5 };
    postMock.create.mockResolvedValue(created);

    await expect(service.create(5, input)).resolves.toEqual(created);
    expect(postMock.create).toHaveBeenCalledWith({
      title: 'Hello',
      content: 'World',
      type: 'question',
      authorId: 5,
    });
  });

  it('lists all posts including author', async () => {
    const rows = [{ id: 1 }];
    postMock.all.mockResolvedValue(rows);
    await expect(service.findAll()).resolves.toEqual(rows);
    expect(postMock.include).toHaveBeenCalled();
  });

  it('filters posts by type', async () => {
    postMock.all.mockResolvedValue([]);
    await service.findAll('alert');
    expect(postMock.where).toHaveBeenCalledWith(expect.any(Function));
  });

  it('throws NotFoundException when post is missing on findOne', async () => {
    postMock.first.mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('removes an existing post', async () => {
    postMock.first.mockResolvedValue({ id: 1 });
    postMock.delete.mockResolvedValue({ id: 1 });
    await expect(service.remove(1)).resolves.toEqual({ id: 1 });
    expect(postMock.where).toHaveBeenCalledWith({ id: 1 });
  });
});
