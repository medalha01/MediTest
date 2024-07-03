import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { MediTestService } from './medi-test.service';
import { DrugDto, StorageDto, DRDto } from './drugs.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('MediTestService', () => {
  let service: MediTestService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediTestService,
        {
          provide: PrismaService,
          useValue: {
            drug: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            storage: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              create: jest.fn(),
            },
            storageLedger: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MediTestService>(MediTestService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDrug', () => {
    it('should create a drug', async () => {
      const drugDto: DrugDto = {
        name: 'Aspirin',
        composition: 'Acetylsalicylic Acid',
        manufacturer: 'Pharma Inc',
        description: 'Painkiller',
        buyCost: 10,
      };

      prismaService.drug.create = jest.fn().mockResolvedValue(drugDto);

      await expect(service.createDrug(drugDto)).resolves.toEqual(drugDto);
      expect(prismaService.drug.create).toHaveBeenCalledWith({
        data: { ...drugDto },
      });
    });
  });

  describe('getDrugs', () => {
    it('should fetch all drugs', async () => {
      const drugs = [{ id: '123', name: 'Aspirin' }];
      prismaService.drug.findMany = jest.fn().mockResolvedValue(drugs);

      await expect(service.getDrugs()).resolves.toEqual(drugs);
      expect(prismaService.drug.findMany).toHaveBeenCalled();
    });
  });

  describe('getDrugById', () => {
    it('should fetch a drug by ID', async () => {
      const drug = { id: '123', name: 'Aspirin' };
      prismaService.drug.findUnique = jest.fn().mockResolvedValue(drug);

      await expect(service.getDrugById('123')).resolves.toEqual(drug);
      expect(prismaService.drug.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      });
    });

    it('should throw exception when not found', async () => {
      prismaService.drug.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.getDrugById('123')).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.drug.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      });
    });
  });

  describe('getDrugByName', () => {
    it('should get drugs by name', async () => {
      const drugs = [{ id: '123', name: 'Aspirin' }];
      prismaService.drug.findMany = jest.fn().mockResolvedValue(drugs);

      await expect(service.getDrugByName('Aspirin')).resolves.toEqual(drugs);
      expect(prismaService.drug.findMany).toHaveBeenCalledWith({
        where: { name: 'Aspirin' },
      });
    });
  });

  describe('getDrugByComposition', () => {
    it('should get drugs by composition', async () => {
      const drugs = [{ id: '123', composition: 'Acetylsalicylic Acid' }];
      prismaService.drug.findMany = jest.fn().mockResolvedValue(drugs);

      await expect(
        service.getDrugByComposition('Acetylsalicylic Acid'),
      ).resolves.toEqual(drugs);
      expect(prismaService.drug.findMany).toHaveBeenCalledWith({
        where: { composition: 'Acetylsalicylic Acid' },
      });
    });
  });

  describe('updateDrug', () => {
    it('should update a drug', async () => {
      const drugDto: DrugDto = {
        name: 'Aspirin',
        composition: 'Acetylsalicylic Acid',
        manufacturer: 'Pharma Inc',
        description: 'Painkiller',
        buyCost: 10,
      };
      const updatedDrug = { id: '123', ...drugDto };
      prismaService.drug.findUnique = jest.fn().mockResolvedValue(updatedDrug);
      prismaService.drug.update = jest.fn().mockResolvedValue(updatedDrug);

      await expect(service.updateDrug('123', drugDto)).resolves.toEqual(
        updatedDrug,
      );
      expect(prismaService.drug.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      });
      expect(prismaService.drug.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: { ...drugDto },
      });
    });

    it('should throw NotFoundException if drug not found', async () => {
      const drugDto: DrugDto = {
        name: 'Aspirin',
        composition: 'Acetylsalicylic Acid',
        manufacturer: 'Pharma Inc',
        description: 'Painkiller',
        buyCost: 10,
      };
      prismaService.drug.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.updateDrug('123', drugDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.drug.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      });
    });
  });

  describe('deleteDrug', () => {
    it('should delete a drug', async () => {
      const drug = { id: '123', name: 'Aspirin' };
      prismaService.drug.findUnique = jest.fn().mockResolvedValue(drug);
      prismaService.drug.delete = jest.fn().mockResolvedValue(drug);

      await expect(service.deleteDrug('123')).resolves.toEqual(drug);
      expect(prismaService.drug.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      });
      expect(prismaService.drug.delete).toHaveBeenCalledWith({
        where: { id: '123' },
      });
    });

    it('should throw NotFoundException if drug not found', async () => {
      prismaService.drug.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.deleteDrug('123')).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.drug.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      });
    });
  });

  describe('getStorage', () => {
    it('should get all storage entries', async () => {
      const storageEntries = [{ id: '123', drugId: '123', quantity: 10 }];
      prismaService.storage.findMany = jest
        .fn()
        .mockResolvedValue(storageEntries);

      await expect(service.getStorage()).resolves.toEqual(storageEntries);
      expect(prismaService.storage.findMany).toHaveBeenCalled();
    });
  });

  describe('getStorageByDrugId', () => {
    it('should get storage by drug ID', async () => {
      const storage = { id: '123', drugId: '123', quantity: 10 };
      prismaService.storage.findFirst = jest.fn().mockResolvedValue(storage);

      await expect(service.getStorageByDrugId('123')).resolves.toEqual(storage);
      expect(prismaService.storage.findFirst).toHaveBeenCalledWith({
        where: { drugId: '123' },
      });
    });
  });

  describe('addToStorage', () => {
    it('should add to storage', async () => {
      const storageDto: StorageDto = { drugId: '123', quantity: 10 };
      prismaService.storage.findFirst = jest.fn().mockResolvedValue(null);
      prismaService.storage.create = jest.fn().mockResolvedValue(storageDto);
      prismaService.storageLedger.create = jest
        .fn()
        .mockResolvedValue({ drugId: '123', change: 10 });

      await expect(service.addToStorage(storageDto)).resolves.toBeUndefined();
      expect(prismaService.storage.create).toHaveBeenCalledWith({
        data: { ...storageDto },
      });
      expect(prismaService.storageLedger.create).toHaveBeenCalledWith({
        data: { drugId: '123', change: 10, timestamp: expect.any(Date) },
      });
    });

    it('should update existing storage', async () => {
      const storageDto: StorageDto = { drugId: '123', quantity: 10 };
      const existingStorage = { id: '123', drugId: '123', quantity: 5 };
      prismaService.storage.findFirst = jest
        .fn()
        .mockResolvedValue(existingStorage);
      prismaService.storage.update = jest
        .fn()
        .mockResolvedValue({ ...existingStorage, quantity: 15 });
      prismaService.storageLedger.create = jest
        .fn()
        .mockResolvedValue({ drugId: '123', change: 10 });

      await expect(service.addToStorage(storageDto)).resolves.toBeUndefined();
      expect(prismaService.storage.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: { quantity: 15 },
      });
      expect(prismaService.storageLedger.create).toHaveBeenCalledWith({
        data: { drugId: '123', change: 10, timestamp: expect.any(Date) },
      });
    });

    it('should throw exception when the storage goes to negative', async () => {
      const storageDto: StorageDto = { drugId: '123', quantity: -10 };
      const existingStorage = { id: '123', drugId: '123', quantity: 5 };
      prismaService.storage.findFirst = jest
        .fn()
        .mockResolvedValue(existingStorage);

      await expect(service.addToStorage(storageDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getStorageTransactions', () => {
    it('should generate report within a date range', async () => {
      const dateRangeDto: DRDto = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-31'),
      };
      const transactions = [
        {
          id: '123',
          drugId: '123',
          change: 10,
          timestamp: new Date('2023-01-10'),
        },
      ];
      prismaService.storageLedger.findMany = jest
        .fn()
        .mockResolvedValue(transactions);

      await expect(
        service.getStorageTransactions(dateRangeDto),
      ).resolves.toEqual(transactions);
      expect(prismaService.storageLedger.findMany).toHaveBeenCalledWith({
        where: {
          timestamp: { gte: dateRangeDto.startDate, lte: dateRangeDto.endDate },
        },
      });
    });
  });
});
