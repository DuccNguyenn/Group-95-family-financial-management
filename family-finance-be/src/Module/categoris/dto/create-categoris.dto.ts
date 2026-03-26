import { CategorisType } from '@/Module/categoris/schema/categoris.schema';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategorisDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Icon không được để trống' })
  icon: string;

  @IsString()
  @IsEnum(CategorisType, { message: 'Loại danh mục không hợp lệ' })
  type: CategorisType;
}
