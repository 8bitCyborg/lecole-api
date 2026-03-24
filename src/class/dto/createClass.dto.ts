import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  schoolId: string;

  @IsString()
  @IsNotEmpty()
  name: string;
};