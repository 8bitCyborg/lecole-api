import { ObjectId } from 'mongodb';
import { Users } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  OneToMany,
} from 'typeorm';
import { Session } from 'src/sessions/entity/session.entity';
import { Students } from 'src/students/entity/student.entity';
import { Staff } from 'src/staff/entities/staff.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
}

@Entity()
export class School {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  subscriptionStatus: SubscriptionStatus;

  @Column({ nullable: true })
  currentSessionId?: ObjectId;

  @Column({ nullable: true })
  currentTermId?: ObjectId;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Users, (users) => users.school)
  users: Users[];

  @OneToMany(() => Session, (sessions) => sessions.school)
  sessions: Session[];

  // @OneToMany(() => Students, (students) => students.school)
  // students: Students[];

  @OneToMany(() => Staff, (staff) => staff.school)
  staff: Staff[];
}
