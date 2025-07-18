// import { PartialType } from '@nestjs/swagger';
// import { CreateClassDto } from './create-class.dto';

// export class UpdateClassDto extends PartialType(CreateClassDto) {}

import {
  IsMongoId,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

class SubjectGroupDto {
  @IsMongoId()
  subjectId: string;

  @IsOptional()
  @IsMongoId()
  @Transform(({ value }): string | undefined =>
    value === '' ? undefined : value,
  )
  teacherId?: string;
}

export class UpdateClassDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  schoolId: string;

  //   @ValidateIf((o) => o.classTeacher !== '' && o.classTeacher !== null)
  @IsOptional()
  @IsMongoId()
  @Transform(({ value }): string | undefined =>
    value === '' ? undefined : value,
  )
  classTeacher?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  subjects?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubjectGroupDto)
  subjectGroups?: SubjectGroupDto[];

  @IsOptional()
  @IsString()
  subClass?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsString()
  arm?: string;

  @IsOptional()
  @IsString()
  alt?: string;
}
