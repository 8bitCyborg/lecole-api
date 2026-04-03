import { IsArray, IsUUID } from 'class-validator';

export class AssignSubjectsDto {
  @IsArray()
  @IsUUID('all', { each: true })
  subjectIds: string[];
}
