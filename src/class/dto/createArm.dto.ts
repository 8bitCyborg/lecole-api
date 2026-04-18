import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArmDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  classId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  schoolId: string;

  @IsNumber()
  @IsOptional()
  capacity?: number;
}

export class BulkArmItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  capacity?: number;

  @IsString()
  @IsOptional()
  @IsUUID()
  classMasterId?: string;
}

export class CreateBulkArmsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkArmItemDto)
  arms: BulkArmItemDto[];

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  classId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  schoolId: string;
}
