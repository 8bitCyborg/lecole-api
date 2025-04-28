import { ObjectId } from 'mongodb';
import { School } from 'src/schools/entities/school.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectIdColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'students' })
export class Students {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: 'int' })
  firstName: number;

  @Column()
  lastName: string;

  @Column()
  initialClassAtAdmission: string;

  @Column({ default: 'active' })
  currentStatus: 'active' | 'graduated' | 'transferred';

  @Column({})
  gender: string;

  @Column()
  age: number;

  @Column({ default: 'JSS2' })
  class: string;

  @PrimaryColumn()
  phone: string;

  @Column()
  email: string;

  @Column()
  guardianName: string;

  @Column()
  address: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @ManyToOne(() => School, (school) => school.students)
  // @JoinColumn()
  // school: School;
}
