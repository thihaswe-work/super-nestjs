import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller.js';
import { PostsService } from './posts.service.js';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard.js';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const serviceMock = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [{ provide: PostsService, useValue: serviceMock }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates a post using the authenticated user id', () => {
    const dto = { title: 'Hi', type: 'normal' as const };
    serviceMock.create.mockReturnValue({ id: 1 });
    controller.create({ user: { userId: 7 } }, dto);
    expect(service.create).toHaveBeenCalledWith(7, dto);
  });

  it('lists posts, passing the type filter', () => {
    serviceMock.findAll.mockReturnValue([]);
    controller.findAll({ type: 'question' });
    expect(service.findAll).toHaveBeenCalledWith('question');
  });

  it('gets one post by parsed id', () => {
    serviceMock.findOne.mockReturnValue({ id: 3 });
    controller.findOne(3);
    expect(service.findOne).toHaveBeenCalledWith(3);
  });

  it('updates and removes posts', () => {
    serviceMock.update.mockReturnValue({ id: 1 });
    serviceMock.remove.mockReturnValue({ id: 1 });

    controller.update(1, { title: 'New' });
    expect(service.update).toHaveBeenCalledWith(1, { title: 'New' });

    controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
