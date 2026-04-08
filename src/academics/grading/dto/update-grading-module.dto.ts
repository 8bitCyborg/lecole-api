import { IsString, IsNumber, IsEnum, IsBoolean, IsOptional, Min, Max } from 'class-validator';
import { ModuleCategory } from '@prisma/client';

export class UpdateGradingModuleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  percentage?: number;

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
