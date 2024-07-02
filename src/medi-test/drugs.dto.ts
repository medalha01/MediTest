//drugs.dto.ts
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

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
