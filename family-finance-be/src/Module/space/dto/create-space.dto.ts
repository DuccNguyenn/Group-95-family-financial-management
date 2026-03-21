import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

//POST/spaces
export class CreateSpaceDto {
  @IsString({ message: 'Tên phòng không được để trống' })
  @IsNotEmpty({ message: 'Tên phòng không được để trống' })
  @MaxLength(50, { message: 'Tên phòng không được vượt quá 50 ký tự' })
  name: string;
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  alertThresholds?: number[];
}
//POST/space/join
export class JoinSpaceDto {
  @IsString({ message: 'Mã mời không được để trống' })
  @IsNotEmpty({ message: 'Mã mời không được để trống' })
  invitedCode: string;
}
