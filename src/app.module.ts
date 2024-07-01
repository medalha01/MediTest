import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediTestModule } from './medi-test/medi-test.module';

@Module({
  imports: [MediTestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
