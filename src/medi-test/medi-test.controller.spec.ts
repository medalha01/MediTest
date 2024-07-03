import { Test, TestingModule } from '@nestjs/testing';
import { MediTestController } from './medi-test.controller';
import { MediTestService } from './medi-test.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DrugDto, StorageDto, DRDto } from './drugs.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('MediTestController', () => {
  let controller: MediTestController;
  let service: MediTestService;

  const mockMediTestService = {
    createDrug: jest.fn(),
    getDrugs: jest.fn(),
    getDrugById: jest.fn(),
    getDrugByName: jest.fn(),
    getDrugByComposition: jest.fn(),
    updateDrug: jest.fn(),
    deleteDrug: jest.fn(),
    getStorage: jest.fn(),
    getStorageByDrugId: jest.fn(),
    addToStorage: jest.fn(),
    getStorageTransactions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediTestController],
      providers: [
        {
          provide: MediTestService,
          useValue: mockMediTestService,
        },
      ],
    }).compile();

    controller = module.get<MediTestController>(MediTestController);
    service = module.get<MediTestService>(MediTestService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
