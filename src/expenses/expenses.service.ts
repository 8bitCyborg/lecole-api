import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './schemas/expense.schema';
import { Model } from 'mongoose';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
  ) {}
  async create(createExpenseDto: CreateExpenseDto) {
    console.log('Expense dto', createExpenseDto);
    return await this.expenseModel.create(createExpenseDto);
  }

  async findAll(schoolId: string) {
    return await this.expenseModel.find({ schoolId: schoolId });
  }

  async findOne(expenseId: string) {
    return await this.expenseModel
      .findById(expenseId)
      .populate('termId')
      .populate('schoolId')
      .populate('sessionId');
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return `This action updates a #${id} expense`;
  }

  remove(id: number) {
    return `This action removes a #${id} expense`;
  }
}
