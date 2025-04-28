import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StudentDto {
  @ApiProperty({ description: 'First name of the student' })
  @IsNotEmpty()
  // @IsString()
  firstName: number;

  @ApiProperty({ description: 'Last name of the student' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Initial class at admission' })
  @IsNotEmpty()
  @IsString()
  initialClassAtAdmission: string;

  @ApiProperty({
    description: 'Current status of the student',
    enum: ['active', 'graduated', 'transferred'],
  })
  @IsEnum(['active', 'graduated', 'transferred'])
  currentStatus: 'active' | 'graduated' | 'transferred';

  @ApiProperty({ description: 'Gender of the student' })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({ description: 'Age of the student' })
  @IsNumber()
  @Min(1)
  age: number;

  @ApiProperty({ description: 'Current class of the student' })
  @IsNotEmpty()
  @IsString()
  class: string;

  @ApiProperty({ description: 'Phone number of the student or guardian' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Email address of the student or guardian' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Name of the guardian' })
  @IsNotEmpty()
  @IsString()
  guardianName: string;

  @ApiProperty({ description: 'Address of the student' })
  @IsNotEmpty()
  @IsString()
  address: string;
}

// export class UpdateStudentDto extends CreateStudentDto {}
