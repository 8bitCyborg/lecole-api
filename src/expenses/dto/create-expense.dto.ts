import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
} from 'class-validator';

export class CreateExpenseDto {
  @IsMongoId()
  @IsNotEmpty()
  schoolId: string;

  @IsMongoId()
  @IsOptional()
  sessionId?: string;

  @IsMongoId()
  @IsOptional()
  termId?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  purpose?: string;

  @IsIn(['cash', 'transfer'])
  type: 'cash' | 'transfer';

  @IsNumber()
  amount: number;
}
