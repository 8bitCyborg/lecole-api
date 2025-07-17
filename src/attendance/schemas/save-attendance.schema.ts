import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Single attendance record DTO
export class AttendanceRecordDto {
  @ApiProperty({
    description: 'School ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @IsString()
  schoolId: string;

  @ApiProperty({
    description: 'Class ID',
    example: '507f1f77bcf86cd799439012',
  })
  @IsNotEmpty()
  @IsString()
  classId: string;

  @ApiProperty({
    description: 'Session ID',
    example: '507f1f77bcf86cd799439013',
  })
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @ApiProperty({
    description: 'Term ID',
    example: '507f1f77bcf86cd799439014',
  })
  @IsNotEmpty()
  @IsString()
  termId: string;

  @ApiProperty({
    description: 'Student ID',
    example: '507f1f77bcf86cd799439015',
  })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({
    description: 'Attendance date',
    example: '2024-03-15',
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Whether student is present',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  present: boolean;
}

// Bulk save attendance DTO
export class SaveAttendanceDto {
  @ApiProperty({
    description: 'Array of attendance records to save',
    type: [AttendanceRecordDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordDto)
  attendanceRecords: AttendanceRecordDto[];
}

// Alternative: Individual attendance save DTO
export class SaveSingleAttendanceDto {
  @ApiProperty({
    description: 'School ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @IsString()
  schoolId: string;

  @ApiProperty({
    description: 'Class ID',
    example: '507f1f77bcf86cd799439012',
  })
  @IsNotEmpty()
  @IsString()
  classId: string;

  @ApiProperty({
    description: 'Session ID',
    example: '507f1f77bcf86cd799439013',
  })
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @ApiProperty({
    description: 'Term ID',
    example: '507f1f77bcf86cd799439014',
  })
  @IsNotEmpty()
  @IsString()
  termId: string;

  @ApiProperty({
    description: 'Student ID',
    example: '507f1f77bcf86cd799439015',
  })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({
    description: 'Attendance date',
    example: '2024-03-15',
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Whether student is present',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  present: boolean;
}

// Update attendance DTO (for editing existing records)
export class UpdateAttendanceDto {
  @ApiProperty({
    description: 'School ID',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiProperty({
    description: 'Class ID',
    example: '507f1f77bcf86cd799439012',
    required: false,
  })
  @IsOptional()
  @IsString()
  classId?: string;

  @ApiProperty({
    description: 'Session ID',
    example: '507f1f77bcf86cd799439013',
    required: false,
  })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiProperty({
    description: 'Term ID',
    example: '507f1f77bcf86cd799439014',
    required: false,
  })
  @IsOptional()
  @IsString()
  termId?: string;

  @ApiProperty({
    description: 'Student ID',
    example: '507f1f77bcf86cd799439015',
    required: false,
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiProperty({
    description: 'Attendance date',
    example: '2024-03-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({
    description: 'Whether student is present',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  present?: boolean;
}
