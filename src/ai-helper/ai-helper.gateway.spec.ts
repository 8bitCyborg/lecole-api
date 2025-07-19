import { Test, TestingModule } from '@nestjs/testing';
import { AiHelperGateway } from './ai-helper.gateway';

describe('AiHelperGateway', () => {
  let gateway: AiHelperGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiHelperGateway],
    }).compile();

    gateway = module.get<AiHelperGateway>(AiHelperGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
