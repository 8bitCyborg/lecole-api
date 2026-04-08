import { IsString, IsNotEmpty, IsNumber, IsEnum, IsBoolean, IsOptional, Min, Max } from 'class-validator';
import { ModuleCategory } from '@prisma/client';

export class CreateGradingModuleDto {
  @IsString()
  @IsOptional()
  schoolId?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  @IsEnum(ModuleCategory)
  @IsOptional()
  category?: ModuleCategory;

  @IsNumber()
  @IsOptional()
  sequence?: number;

  @IsBoolean()
  @IsOptional()
  isLocked?: boolean;

  @IsString()
  @IsOptional()
  subjectId?: string;
}
