import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post(':schoolId')
  create(
    @Param('schoolId') schoolId,
    @Body() createPaymentDto: CreateExpenseDto,
  ) {
    return this.expensesService.create(createPaymentDto);
  }

  @Get(':schoolId')
  findAll(@Param('schoolId') schoolId: string) {
    return this.expensesService.findAll(schoolId);
  }

  @Get('/details/:expenseId')
  findOne(@Param('expenseId') expenseId: string) {
    return this.expensesService.findOne(expenseId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(+id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expensesService.remove(+id);
  }
}
