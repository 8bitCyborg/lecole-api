import {
  Entity,
  Column,
  ObjectId,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Staff } from '../../staff/entities/staff.entity';
import { School } from 'src/schools/entities/school.entity';

export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  // STAFF = 'staff',
  // STUDENT = 'student',
  SUBADMIN = 'subadmin',
  FINANCE = 'finance',
  EXAMS = 'exam',
}

@Entity()
export class Users {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ nullable: true, default: null })
  username: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SUPERADMIN,
  })
  role: UserRole;

  // @Column({ nullable: true })
  // studentId: ObjectId;

  // @OneToOne(() => Staff, { nullable: true })
  // @JoinColumn({ name: 'staffId' })
  // staff: Staff;

  // @Column({ nullable: true })
  // staffId: ObjectId;

  @Column({ default: false })
  isActive: boolean;

  @Column()
  password: string;

  @Column({ nullable: true })
  loginId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => School, (school) => school.users)
  @JoinColumn()
  school: School;
}
