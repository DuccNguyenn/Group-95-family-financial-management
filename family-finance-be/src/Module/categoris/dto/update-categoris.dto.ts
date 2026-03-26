import { PartialType } from '@nestjs/mapped-types';
import { CreateCategorisDto } from './create-categoris.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CategorisType } from '../schema/categoris.schema';

export class UpdateCategorisDto extends PartialType(CreateCategorisDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsEnum(CategorisType)
  @IsOptional()
  type?: CategorisType;
}
