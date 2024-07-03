//medi-test.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DrugDto, StorageDto, DRDto } from './drugs.dto';
import { MediTestService } from './medi-test.service';

@Controller('medi-test')
export class MediTestController {
  constructor(private readonly mediTestService: MediTestService) {}

  @Post('drug/register')
  async registerDrug(@Body() drug: DrugDto) {
    const createdDrug = await this.mediTestService.createDrug(drug);
    return createdDrug;
  }

  @Get('drugs')
  async getDrugs() {
    const result = await this.mediTestService.getDrugs();
    return { data: result };
  }

  @Get('drug/:id')
  async getDrugById(@Param('id') id: string) {
    try {
      const result = await this.mediTestService.getDrugById(id);
      return { data: result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get('drug/name/:name')
  async getDrugByName(@Param('name') name: string) {
    const result = await this.mediTestService.getDrugByName(name);
    return { data: result };
  }

  @Get('drug/composition/:composition')
  async getDrugByComposition(@Param('composition') composition: string) {
    const result = await this.mediTestService.getDrugByComposition(composition);
    return { data: result };
  }

  @Put('drug/:id')
  async updateDrug(@Param('id') id: string, @Body() drugDto: DrugDto) {
    try {
      const result = await this.mediTestService.updateDrug(id, drugDto);
      return { data: result, message: 'Drug updated' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete('drug/:id')
  async deleteDrug(@Param('id') id: string) {
    try {
      const result = await this.mediTestService.deleteDrug(id);
      return { data: result, message: 'Drug deleted' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get('storage')
  async getStorage() {
    const result = await this.mediTestService.getStorage();
    return { data: result };
  }

  @Get('storage/:drugId')
  async getStorageByDrugId(@Param('drugId') drugId: string) {
    const result = await this.mediTestService.getStorageByDrugId(drugId);
    return { data: result };
  }

  @Post('storage')
  async addToStorage(@Body() storageDto: StorageDto) {
    try {
      await this.mediTestService.addToStorage(storageDto);
      return { message: 'Storage updated' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('storage/transactions')
  async getStorageTransactions(@Body() dateRangeDto: DRDto) {
    try {
      const result =
        await this.mediTestService.getStorageTransactions(dateRangeDto);
      return { data: result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
