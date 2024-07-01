import { Injectable } from '@nestjs/common';
import { DrugDto } from './drugs.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class MediTestService {
  constructor(private readonly prismaService: PrismaService) {}

  async createDrug(drugDto: DrugDto) {
    return this.prismaService.drug.create({
      data: {
        name: drugDto.name,
        description: drugDto.description,
        manufacturer: drugDto.manufacturer,
        buyCost: drugDto.buyCost,
        composition: drugDto.composition,
      },
    });
  }
}
