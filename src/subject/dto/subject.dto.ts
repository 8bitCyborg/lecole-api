import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  schoolId: string;

  @IsString()
  @IsOptional()
  code?: string;
}

export class BulkSubjectItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;
}

export class CreateBulkSubjectsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkSubjectItemDto)
  subjects: BulkSubjectItemDto[];

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  schoolId: string;
}
