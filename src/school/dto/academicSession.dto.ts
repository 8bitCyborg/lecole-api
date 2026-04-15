import { IsNotEmpty, IsString, IsOptional, IsDateString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAcademicSessionDto {
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @IsOptional()
  @IsString()
  schoolId?: string;

  @IsOptional()
  @IsNumber()
  termsPerSession?: number;
}

export class UpdateAcademicSessionDto {
  @IsOptional()
  @IsString()
  identifier?: string;

  @IsOptional()
  @IsNumber()
  termsPerSession?: number;
}
