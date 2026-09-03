import { Test, TestingModule } from '@nestjs/testing';
import { ReactionsController } from './reactions.controller.js';
import { ReactionsService } from './reactions.service.js';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard.js';

describe('ReactionsController', () => {
  let controller: ReactionsController;
  let service: ReactionsService;

  const serviceMock = {
    react: vi.fn(),
    unreact: vi.fn(),
    findByPost: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReactionsController],
      providers: [{ provide: ReactionsService, useValue: serviceMock }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ReactionsController>(ReactionsController);
    service = module.get<ReactionsService>(ReactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('reacts using the authenticated user id and parsed post id', () => {
    const dto = { type: 'like' as const };
    serviceMock.react.mockReturnValue({ id: 1 });
    controller.react({ user: { userId: 3 } }, 42, dto);
    expect(service.react).toHaveBeenCalledWith(3, 42, 'like');
  });

  it('unreacts using the authenticated user id and parsed post id', () => {
    serviceMock.unreact.mockReturnValue({ id: 1 });
    controller.unreact({ user: { userId: 3 } }, 42);
    expect(service.unreact).toHaveBeenCalledWith(3, 42);
  });
});
