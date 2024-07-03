import { Module } from '@nestjs/common';
import { MediTestController } from './medi-test.controller';
import { MediTestService } from './medi-test.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MediTestController],
  providers: [MediTestService],
})
export class MediTestModule {}
