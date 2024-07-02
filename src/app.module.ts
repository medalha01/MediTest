import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediTestModule } from './medi-test/medi-test.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MediTestModule, PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
