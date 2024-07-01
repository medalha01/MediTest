import { Test, TestingModule } from '@nestjs/testing';
import { MediTestController } from './medi-test.controller';

describe('MediTestController', () => {
  let controller: MediTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediTestController],
    }).compile();

    controller = module.get<MediTestController>(MediTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
