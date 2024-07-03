import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DrugDto, StorageDto, StorageLedgerDto } from './drugs.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediTestService {
  constructor(private readonly prismaService: PrismaService) {}

  async createDrug(drugDto: DrugDto) {
    return this.prismaService.drug.create({
      data: { ...drugDto },
    });
  }

  async getDrugs() {
    return this.prismaService.drug.findMany();
  }

  async getDrugById(id: string) {
    const drug = await this.prismaService.drug.findUnique({ where: { id } });
    if (!drug) {
      throw new NotFoundException(`Drug with ID ${id} not found.`);
    }
    return drug;
  }

  async getDrugByName(name: string) {
    return this.prismaService.drug.findMany({ where: { name } });
  }

  async getDrugByComposition(composition: string) {
    return this.prismaService.drug.findMany({ where: { composition } });
  }

  async updateDrug(id: string, drugDto: DrugDto) {
    const drug = await this.prismaService.drug.findUnique({ where: { id } });
    if (!drug) {
      throw new NotFoundException(`Drug with ID ${id} not found.`);
    }
    return this.prismaService.drug.update({
      where: { id },
      data: { ...drugDto },
    });
  }

  async deleteDrug(id: string) {
    const drug = await this.prismaService.drug.findUnique({ where: { id } });
    if (!drug) {
      throw new NotFoundException(`Drug with ID ${id} not found.`);
    }
    return this.prismaService.drug.delete({ where: { id } });
  }

  async getStorage() {
    return this.prismaService.storage.findMany();
  }

  async getStorageByDrugId(drugId: string) {
    return this.prismaService.storage.findFirst({ where: { drugId } });
  }

  async addToStorage(storageDto: StorageDto) {
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
}
