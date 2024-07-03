import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { DrugDto, StorageDto, StorageLedgerDto, DRDto } from './drugs.dto';
import { PrismaService } from '../prisma/prisma.service';
import { validateOrReject } from 'class-validator';

@Injectable()
export class MediTestService {
  private readonly logger = new Logger(MediTestService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async createDrug(drugDto: DrugDto) {
    await validateOrReject(drugDto);
    this.logger.log(`Creating drug with data: ${JSON.stringify(drugDto)}`);
    return this.prismaService.drug.create({
      data: { ...drugDto },
    });
  }

  async getDrugs() {
    this.logger.log('Fetching all drugs');
    return this.prismaService.drug.findMany();
  }

  async getDrugById(id: string) {
    this.logger.log(`Fetching drug with ID: ${id}`);
    const drug = await this.prismaService.drug.findUnique({ where: { id } });
    if (!drug) {
      this.logger.warn(`Drug with ID ${id} not found`);
      throw new NotFoundException(`Drug with ID ${id} not found.`);
    }
    return drug;
  }

  async getDrugByName(name: string) {
    this.logger.log(`Fetching drugs with name: ${name}`);
    return this.prismaService.drug.findMany({ where: { name } });
  }

  async getDrugByComposition(composition: string) {
    this.logger.log(`Fetching drugs with composition: ${composition}`);
    return this.prismaService.drug.findMany({ where: { composition } });
  }

  async updateDrug(id: string, drugDto: DrugDto) {
    await validateOrReject(drugDto);
    this.logger.log(`Updating drug with ID: ${id}`);
    const drug = await this.prismaService.drug.findUnique({ where: { id } });
    if (!drug) {
      this.logger.warn(`Drug with ID ${id} not found`);
      throw new NotFoundException(`Drug with ID ${id} not found.`);
    }
    return this.prismaService.drug.update({
      where: { id },
      data: { ...drugDto },
    });
  }

  async deleteDrug(id: string) {
    this.logger.log(`Deleting drug with ID: ${id}`);
    const drug = await this.prismaService.drug.findUnique({ where: { id } });
    if (!drug) {
      this.logger.warn(`Drug with ID ${id} not found`);
      throw new NotFoundException(`Drug with ID ${id} not found.`);
    }
    return this.prismaService.drug.delete({ where: { id } });
  }

  async getStorage() {
    this.logger.log('Fetching all storage entries');
    return this.prismaService.storage.findMany();
  }

  async getStorageByDrugId(drugId: string) {
    this.logger.log(`Fetching storage for drug ID: ${drugId}`);
    return this.prismaService.storage.findFirst({ where: { drugId } });
  }

  async addToStorage(storageDto: StorageDto) {
    await validateOrReject(storageDto);
    this.logger.log(
      `Adding to storage with data: ${JSON.stringify(storageDto)}`,
    );
    const existingStorage = await this.prismaService.storage.findFirst({
      where: { drugId: storageDto.drugId },
    });

    if (existingStorage) {
      if (existingStorage.quantity + storageDto.quantity < 0) {
        throw new BadRequestException('Cannot reduce quantity below zero.');
      }
      await this.prismaService.storage.update({
        where: { id: existingStorage.id },
        data: { quantity: existingStorage.quantity + storageDto.quantity },
      });
    } else {
      if (storageDto.quantity < 0) {
        throw new BadRequestException(
          'Cannot create negative quantity storage entry.',
        );
      }
      await this.prismaService.storage.create({
        data: { ...storageDto },
      });
    }

    await this.prismaService.storageLedger.create({
      data: {
        drugId: storageDto.drugId,
        change: storageDto.quantity,
        timestamp: new Date(),
      },
    });
  }

  async getStorageTransactions(dateRangeDto: DRDto) {
    await validateOrReject(dateRangeDto);
    this.logger.log(
      `Fetching storage transactions between ${dateRangeDto.startDate} and ${dateRangeDto.endDate}`,
    );
    return this.prismaService.storageLedger.findMany({
      where: {
        timestamp: {
          gte: dateRangeDto.startDate,
          lte: dateRangeDto.endDate,
        },
      },
    });
  }

  async getReport(dateRangeDto: DRDto) {
    await validateOrReject(dateRangeDto);
    this.logger.log(
      `Fetching detailed storage transactions between ${dateRangeDto.startDate} and ${dateRangeDto.endDate}`,
    );
    return this.prismaService.storageLedger.findMany({
      where: {
        timestamp: {
          gte: dateRangeDto.startDate,
          lte: dateRangeDto.endDate,
        },
      },
      include: {
        drug: {
          select: {
            name: true,
            description: true,
            composition: true,
          },
        },
      },
    });
  }
}
