import { Controller, Post, Body } from '@nestjs/common';
import { DrugDto } from './drugs.dto';

@Controller('medi-test')
export class MediTestController {
  @Post('register-drug')
  registerDrug(@Body() drug: DrugDto) {
    console.log(drug);
    return drug;
  }
}
