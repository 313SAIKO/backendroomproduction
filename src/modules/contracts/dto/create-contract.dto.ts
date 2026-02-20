import {
  IsDateString,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContractDto {
  @IsMongoId()
  tenant: string;

  @IsMongoId()
  room: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  monthlyRent: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  deposit: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
