import {
  Entity,
  Column,
  ObjectId,
  ObjectIdColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Users {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ default: false })
  is_active: boolean;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  
}