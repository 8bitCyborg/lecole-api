import {
  Entity,
  ObjectIdColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { School } from '../../schools/entities/school.entity';

@Entity()
export class Session {
  @ObjectIdColumn()
  _id: ObjectId;

  @ObjectIdColumn()
  schoolId: ObjectId;

  @ObjectIdColumn({ array: true })
  termsId: ObjectId[];

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => School, (school) => school.sessions)
  @JoinColumn()
  school: School;
}

// export class Session {
//   @ObjectIdColumn()
//   _id: ObjectId;

//   @Column()
//   schoolId: ObjectId;

//   @Column()
//   name: string; // e.g., "2024/2025"

//   @Column()
//   startDate: Date;

//   @Column()
//   endDate: Date;

//   @Column({ default: 'planning' })
//   status: 'planning' | 'active' | 'archived';

//   @CreateDateColumn()
//   createdAt: Date;
// }
