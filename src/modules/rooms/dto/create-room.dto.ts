import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoomStatus } from '../../../common/enums/room-status.enum';
import { PriceDto } from './price.dto';

export class CreateRoomDto {
  @IsString()
  roomNumber: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  floor: number;

  @IsString()
  roomType: string;

  @ValidateNested()
  @Type(() => PriceDto)
  prices: PriceDto;

  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;
}
