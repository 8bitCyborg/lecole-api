import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Category } from '@prisma/client';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  schoolId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(Category)
  category: Category;
};