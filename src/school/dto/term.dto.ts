import { IsNotEmpty, IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateTermDto {
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @IsNotEmpty()
  @IsString()
  academicSessionId: string;

  @IsOptional()
  @IsString()
  schoolId?: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsNotEmpty()
  @IsNumber()
  numberOfWeeks: number;
}

export class UpdateTermDto {
  @IsOptional()
  @IsString()
  identifier?: string;

  @IsOptional()
  @IsString()
  academicSessionId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  numberOfWeeks?: number;
}
