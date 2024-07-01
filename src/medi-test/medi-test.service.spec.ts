import { Test, TestingModule } from '@nestjs/testing';
import { MediTestService } from './medi-test.service';

describe('MediTestService', () => {
  let service: MediTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediTestService],
    }).compile();

    service = module.get<MediTestService>(MediTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
