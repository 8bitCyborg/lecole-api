import { IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Title, Gender } from '@prisma/client';

export class CreateStaffDto {
  @IsEnum(Title)
  @IsOptional()
  title?: Title;

  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  staffId?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  designation?: string;

  @IsBoolean()
  @IsOptional()
  isTeachingStaff?: boolean;
}
