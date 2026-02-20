import { IsOptional, IsString } from 'class-validator';

export class ProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  idCardNumber?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
