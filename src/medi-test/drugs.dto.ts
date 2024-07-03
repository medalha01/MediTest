//drugs.dto.ts
import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
export class DrugDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  manufacturer: string;

  @IsInt()
  buyCost: number;

  @IsString()
  @IsNotEmpty()
  composition: string;
}

export class StorageLedgerDto {
  @IsString()
  drugId: string;

  @IsInt()
  change: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  timestamp?: Date;
}

export class StorageDto {
  @IsString()
  drugId: string;

  @IsInt()
  quantity: number;
}
