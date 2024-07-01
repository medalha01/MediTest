//medi-test.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { DrugDto } from './drugs.dto';
import { MediTestService } from './medi-test.service';

@Controller('medi-test')
export class MediTestController {
  constructor(private readonly mediTestService: MediTestService) {}

  @Post('register-drug')
  async registerDrug(@Body() drug: DrugDto) {
    const createdDrug = await this.mediTestService.createDrug(drug);
    return createdDrug;
  }
}
