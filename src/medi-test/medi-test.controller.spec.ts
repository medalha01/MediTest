import { Test, TestingModule } from '@nestjs/testing';
import { MediTestController } from './medi-test.controller';
import { MediTestService } from './medi-test.service';
import { DrugDto, StorageDto, DRDto } from './drugs.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('MediTestController', () => {
  let controller: MediTestController;
  let service: MediTestService;

  const mockMediTestService = {
    createDrug: jest
      .fn()
      .mockImplementation((drugDto: DrugDto) =>
        Promise.resolve({ id: '123', ...drugDto }),
      ),
    getDrugs: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([{ id: '123', name: 'Aspirin' }]),
      ),
    getDrugById: jest
      .fn()
      .mockImplementation((id: string) =>
        Promise.resolve({ id, name: 'Aspirin' }),
      ),
    getDrugByName: jest
      .fn()
      .mockImplementation((name: string) =>
        Promise.resolve([{ id: '123', name }]),
      ),
    getDrugByComposition: jest
      .fn()
      .mockImplementation((composition: string) =>
        Promise.resolve([{ id: '123', composition }]),
      ),
    updateDrug: jest
      .fn()
      .mockImplementation((id: string, drugDto: DrugDto) =>
        Promise.resolve({ id, ...drugDto }),
      ),
    deleteDrug: jest
      .fn()
      .mockImplementation((id: string) => Promise.resolve({ id })),
    getStorage: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([{ id: '123', drugId: '123', quantity: 10 }]),
      ),
    getStorageByDrugId: jest
      .fn()
      .mockImplementation((drugId: string) =>
        Promise.resolve({ id: '123', drugId, quantity: 10 }),
      ),
    addToStorage: jest
      .fn()
      .mockImplementation((storageDto: StorageDto) =>
        Promise.resolve({ id: '123', ...storageDto }),
      ),
    getStorageTransactions: jest
      .fn()
      .mockImplementation((dateRangeDto: DRDto) =>
        Promise.resolve([{ id: '123', date: new Date(), quantity: 10 }]),
      ),
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
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<MediTestController>(MediTestController);
    service = module.get<MediTestService>(MediTestService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a drug', async () => {
    const drugDto: DrugDto = {
      name: 'Aspirin',
      composition: 'Acetylsalicylic Acid',
      manufacturer: 'Pharma Inc',
      description: 'Painkiller',
      buyCost: 10,
    };
    const result = await controller.createDrug(drugDto);
    expect(result).toEqual({
      data: { id: '123', ...drugDto },
      message: 'Drug created ',
    });
    expect(service.createDrug).toHaveBeenCalledWith(drugDto);
  });

  it('should get all drugs', async () => {
    const result = await controller.getDrugs();
    expect(result).toEqual({ data: [{ id: '123', name: 'Aspirin' }] });
    expect(service.getDrugs).toHaveBeenCalled();
  });

  it('should get a drug by ID', async () => {
    const result = await controller.getDrugById('123');
    expect(result).toEqual({ data: { id: '123', name: 'Aspirin' } });
    expect(service.getDrugById).toHaveBeenCalledWith('123');
  });

  it('should get drugs by name', async () => {
    const result = await controller.getDrugByName('Aspirin');
    expect(result).toEqual({ data: [{ id: '123', name: 'Aspirin' }] });
    expect(service.getDrugByName).toHaveBeenCalledWith('Aspirin');
  });

  it('should get drugs by composition', async () => {
    const result = await controller.getDrugByComposition(
      'Acetylsalicylic Acid',
    );
    expect(result).toEqual({
      data: [{ id: '123', composition: 'Acetylsalicylic Acid' }],
    });
    expect(service.getDrugByComposition).toHaveBeenCalledWith(
      'Acetylsalicylic Acid',
    );
  });

  it('should update a drug', async () => {
    const drugDto: DrugDto = {
      name: 'Aspirin',
      composition: 'Acetylsalicylic Acid',
      manufacturer: 'Pharma Inc',
      description: 'Painkiller',
      buyCost: 10,
    };
    const result = await controller.updateDrug('123', drugDto);
    expect(result).toEqual({
      data: { id: '123', ...drugDto },
      message: 'Drug updated',
    });
    expect(service.updateDrug).toHaveBeenCalledWith('123', drugDto);
  });

  it('should delete a drug', async () => {
    const result = await controller.deleteDrug('123');
    expect(result).toEqual({ data: { id: '123' }, message: 'Drug deleted' });
    expect(service.deleteDrug).toHaveBeenCalledWith('123');
  });

  it('should get all storage entries', async () => {
    const result = await controller.getStorage();
    expect(result).toEqual({
      data: [{ id: '123', drugId: '123', quantity: 10 }],
    });
    expect(service.getStorage).toHaveBeenCalled();
  });

  it('should get storage by drug ID', async () => {
    const result = await controller.getStorageByDrugId('123');
    expect(result).toEqual({
      data: { id: '123', drugId: '123', quantity: 10 },
    });
    expect(service.getStorageByDrugId).toHaveBeenCalledWith('123');
  });

  it('should add to storage', async () => {
    const storageDto: StorageDto = { drugId: '123', quantity: 10 };
    const result = await controller.addToStorage(storageDto);
    expect(result).toEqual({ message: 'Storage updated' });
    expect(service.addToStorage).toHaveBeenCalledWith(storageDto);
  });

  it('should get storage transactions within a date range', async () => {
    const dateRangeDto: DRDto = {
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-01-31'),
    };
    const result = await controller.getStorageTransactions(dateRangeDto);
    expect(result).toEqual({
      data: [{ id: '123', date: new Date(), quantity: 10 }],
    });
    expect(service.getStorageTransactions).toHaveBeenCalledWith(dateRangeDto);
  });
});
