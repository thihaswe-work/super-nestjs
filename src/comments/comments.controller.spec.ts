import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller.js';
import { CommentsService } from './comments.service.js';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard.js';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const serviceMock = {
    create: vi.fn(),
    findByPost: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [{ provide: CommentsService, useValue: serviceMock }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates a comment with the authenticated user id', () => {
    const dto = { content: 'Hello' };
    serviceMock.create.mockReturnValue({ id: 1 });
    controller.create({ user: { userId: 7 } }, 42, dto);
    expect(service.create).toHaveBeenCalledWith(7, 42, dto);
  });

  it('lists comments for a post', () => {
    serviceMock.findByPost.mockReturnValue([]);
    controller.findByPost(42);
    expect(service.findByPost).toHaveBeenCalledWith(42);
  });

  it('updates a comment by parsed ids and user', () => {
    serviceMock.update.mockReturnValue({ id: 3 });
    controller.update({ user: { userId: 7 } }, 42, 3, { content: 'New' });
    expect(service.update).toHaveBeenCalledWith(3, 7, { content: 'New' });
  });

  it('removes a comment by parsed ids and user', () => {
    serviceMock.remove.mockReturnValue({ id: 3 });
    controller.remove({ user: { userId: 7 } }, 42, 3);
    expect(service.remove).toHaveBeenCalledWith(3, 7);
  });
});
