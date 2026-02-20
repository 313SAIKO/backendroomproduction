import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PriceDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  daily: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  monthly: number;
}
