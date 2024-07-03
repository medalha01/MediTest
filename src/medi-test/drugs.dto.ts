import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DrugDto {
  @ApiProperty({ description: 'The name of the drug' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The description of the drug' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'The manufacturer of the drug' })
  @IsString()
  @IsNotEmpty()
  manufacturer: string;

  @ApiProperty({ description: 'The cost to buy the drug' })
  @IsInt()
  buyCost: number;

  @ApiProperty({ description: 'The composition of the drug' })
  @IsString()
  @IsNotEmpty()
  composition: string;
}

export class StorageDto {
  @ApiProperty({ description: 'The ID of the target drug' })
  @IsString()
  drugId: string;

  @ApiProperty({ description: 'The quantity of the drug' })
  @IsInt()
  quantity: number;
}

export class DRDto {
  @ApiProperty({ description: 'The start date' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'The end date' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}

export class StorageLedgerDto {
  @ApiProperty({ description: 'The ID of the target drug' })
  @IsString()
  drugId: string;

  @ApiProperty({ description: 'The quantity changed of the drug in storage' })
  @IsInt()
  change: number;

  @ApiProperty({ description: 'The date of the ledger entry', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  timestamp?: Date;
}
