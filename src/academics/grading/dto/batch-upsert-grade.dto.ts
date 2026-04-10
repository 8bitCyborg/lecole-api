import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class GradeContextDto {
  @IsString()
  @IsNotEmpty()
  schoolId: string;

  @IsString()
  @IsNotEmpty()
  classId: string;

  @IsString()
  @IsNotEmpty()
  armId: string;

  @IsString()
  @IsNotEmpty()
  term: string;

  @IsString()
  @IsNotEmpty()
  session: string;
}

class GradeEntryDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsString()
  @IsNotEmpty()
  gradingModuleId: string;

  @IsNumber()
  @IsNotEmpty()
  score: number;
}

export class BatchUpsertGradeDto {
  @ValidateNested()
  @Type(() => GradeContextDto)
  @IsNotEmpty()
  context: GradeContextDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GradeEntryDto)
  scores: GradeEntryDto[];
}
