import { PartialType } from '@nestjs/swagger';
import { CreateSubjectDto } from './create-subject.dto';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {
  id: string; // Ensure the ID is included for updates
  // Additional fields can be added here if needed
}
