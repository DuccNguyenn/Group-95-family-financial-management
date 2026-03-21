import { PartialType } from '@nestjs/mapped-types';
import { CreateSpaceDto } from './create-space.dto';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

//PATCH/space/me
export class UpdateSpaceDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  alertThresholds?: number[];
}
