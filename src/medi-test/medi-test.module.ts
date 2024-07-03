import { Module } from '@nestjs/common';
import { MediTestController } from './medi-test.controller';
import { MediTestService } from './medi-test.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MediTestController],
  providers: [MediTestService],
})
export class MediTestModule {}
