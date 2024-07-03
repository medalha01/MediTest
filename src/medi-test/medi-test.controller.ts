import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MediTestService } from './medi-test.service';
import { DrugDto, StorageDto, DRDto } from './drugs.dto';

@ApiTags('MediTest')
@Controller('meditest')
export class MediTestController {
  constructor(private readonly mediTestService: MediTestService) {}

  @Post('drug')
  @ApiOperation({ summary: 'Create a new drug' })
  @ApiResponse({
    status: 201,
    description: 'The drug has been created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async createDrug(@Body() drugDto: DrugDto) {
    try {
      const result = await this.mediTestService.createDrug(drugDto);
      return { data: result, message: 'Drug created ' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('drugs')
  @ApiOperation({ summary: 'Get all drugs' })
  @ApiResponse({ status: 200, description: 'Retrieved all drugs.' })
  async getDrugs() {
    const result = await this.mediTestService.getDrugs();
    return { data: result };
  }

  @Get('drug/:id')
  @ApiOperation({ summary: 'Get a drug by ID' })
  @ApiResponse({ status: 200, description: 'Retrieved the drug.' })
  @ApiResponse({ status: 404, description: 'Drug not found.' })
  async getDrugById(@Param('id') id: string) {
    try {
      const result = await this.mediTestService.getDrugById(id);
      return { data: result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get('drug/name/:name')
  @ApiOperation({ summary: 'Get drugs by name' })
  @ApiResponse({ status: 200, description: 'Retrieved the drugs.' })
  async getDrugByName(@Param('name') name: string) {
    const result = await this.mediTestService.getDrugByName(name);
    return { data: result };
  }

  @Get('drug/composition/:composition')
  @ApiOperation({ summary: 'Get drugs by composition' })
  @ApiResponse({ status: 200, description: 'Retrieved the drugs.' })
  async getDrugByComposition(@Param('composition') composition: string) {
    const result = await this.mediTestService.getDrugByComposition(composition);
    return { data: result };
  }

  @Put('drug/:id')
  @ApiOperation({ summary: 'Update a drug' })
  @ApiResponse({
    status: 200,
    description: 'The drug has been updated.',
  })
  @ApiResponse({ status: 404, description: 'Drug not found.' })
  async updateDrug(@Param('id') id: string, @Body() drugDto: DrugDto) {
    try {
      const result = await this.mediTestService.updateDrug(id, drugDto);
      return { data: result, message: 'Drug updated' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete('drug/:id')
  @ApiOperation({ summary: 'Delete a drug' })
  @ApiResponse({
    status: 200,
    description: 'The drug has been deleted.',
  })
  @ApiResponse({ status: 404, description: 'Drug not found.' })
  async deleteDrug(@Param('id') id: string) {
    try {
      const result = await this.mediTestService.deleteDrug(id);
      return { data: result, message: 'Drug deleted' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get('storage')
  @ApiOperation({ summary: 'Get all storage entries' })
  @ApiResponse({ status: 200, description: 'Retrieved all storage entries.' })
  async getStorage() {
    const result = await this.mediTestService.getStorage();
    return { data: result };
  }

  @Get('storage/:drugId')
  @ApiOperation({ summary: 'Get storage by drug ID' })
  @ApiResponse({ status: 200, description: 'Retrieved the storage entry.' })
  async getStorageByDrugId(@Param('drugId') drugId: string) {
    const result = await this.mediTestService.getStorageByDrugId(drugId);
    return { data: result };
  }

  @Post('storage')
  @ApiOperation({ summary: 'Add to storage' })
  @ApiResponse({ status: 201, description: 'Storage updated.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async addToStorage(@Body() storageDto: StorageDto) {
    try {
      await this.mediTestService.addToStorage(storageDto);
      return { message: 'Storage updated' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('storage/transactions')
  @ApiOperation({ summary: 'Get storage transactions within a date range' })
  @ApiResponse({ status: 200, description: 'Retrieved storage transactions.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
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
