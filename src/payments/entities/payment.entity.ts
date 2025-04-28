import { ObjectId } from 'mongodb';
import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  schoolId: ObjectId;

  @Column()
  studentId: ObjectId;

  @Column()
  sessionId: ObjectId;

  @Column()
  termId: ObjectId;

  @Column()
  amountPaid: number;

  @Column()
  paymentType: string;

  @Column()
  paymentDate: Date;

  @Column()
  method: 'bank transfer' | 'cash' | 'card';

  @Column({ default: 'completed' })
  status: 'completed' | 'pending' | 'failed';

  @Column({ nullable: true })
  reference?: string;

  @CreateDateColumn()
  createdAt: Date;
}
