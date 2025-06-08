import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Public } from 'src/auth/authUtils/auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // @Public()
  @Post(':schoolId')
  create(
    @Param('schoolId') schoolId,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentsService.createPayment(createPaymentDto);
  }

  @Get(':schoolId')
  findAll(@Param('schoolId') schoolId: string) {
    return this.paymentsService.findAll(schoolId);
  }

  @Get('/details/:id')
  async findOne(@Param('id') id: string) {
    console.log('id', id);
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    return this.paymentsService.findOne(id);
  }

  @Get(':termId')
  findTermPayments(@Param('termId') termId: string) {
    return this.paymentsService.findTermPayments(termId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
