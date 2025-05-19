import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment.name) private paymentModel) {}
  async createPayment(paymentDetails: CreatePaymentDto) {
    try {
      const payment = await this.paymentModel.create(paymentDetails);
      console.log('Payment: ', payment);
      return payment;
    } catch (error) {
      console.log('error creating payment: ', error);
    }
  }

  async findAll(schoolId: string) {
    const payments = await this.paymentModel.find({ schoolId: schoolId });
    return payments;
  }

  async findTermPayments(termId: string) {
    const payments = await this.paymentModel.find({ termId: termId });
    return payments;
  }

  async findOne(id: string) {
    const payments = await this.paymentModel.findById(id);
    return payments;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
