import { IsNotEmpty, IsString, IsOptional, IsDateString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateTermEmbeddedDto {
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsNumber()
  numberOfWeeks: number;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class CreateAcademicSessionDto {
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @IsOptional()
  @IsString()
  schoolId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateTermEmbeddedDto)
  term?: CreateTermEmbeddedDto;
}

export class UpdateAcademicSessionDto {
  @IsOptional()
  @IsString()
  identifier?: string;

  @IsOptional()
  @IsString()
  schoolId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
