import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

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
