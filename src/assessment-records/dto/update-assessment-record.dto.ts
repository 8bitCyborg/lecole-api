import { PartialType } from '@nestjs/swagger';
import { CreateAssessmentRecordDto } from './create-assessment-record.dto';

export class UpdateAssessmentRecordDto extends PartialType(
  CreateAssessmentRecordDto,
) {}
