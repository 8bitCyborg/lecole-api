import { ObjectId } from 'mongodb';
import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class Term {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  sessionId: ObjectId;

  @Column()
  name: string; // e.g., "First Term"

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ default: 'active' })
  status: 'active' | 'archived';

  @CreateDateColumn()
  createdAt: Date;
}
