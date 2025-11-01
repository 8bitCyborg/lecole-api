import { ObjectId } from 'mongodb';
import { School } from '../../schools/entities/school.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectIdColumn,
} from 'typeorm';

@Entity()
export class Staff {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  userId: ObjectId;

  @Column()
  position: string;

  @Column()
  qualification: string;

  @Column()
  employmentDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => School, (school) => school.sessions)
  @JoinColumn()
  school: School;
}
