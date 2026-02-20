import {
  IsMongoId,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvoiceDto {
  @IsMongoId()
  contract: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @Type(() => Number)
  @IsNumber()
  @Min(2000)
  year: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  waterMeter: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  electricMeter: number;
}
