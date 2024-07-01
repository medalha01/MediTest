import { Module } from '@nestjs/common';
import { MediTestController } from './medi-test.controller';
import { MediTestService } from './medi-test.service';

@Module({
  controllers: [MediTestController],
  providers: [MediTestService]
})
export class MediTestModule {}
