import { IsArray, IsEnum, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Category } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  schoolId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(Category)
  category: Category;
};

export class BulkClassItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(Category)
  category: Category;
}

export class CreateBulkClassesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkClassItemDto)
  classes: BulkClassItemDto[];

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  schoolId: string;
}