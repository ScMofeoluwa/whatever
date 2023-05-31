import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';

export type NotificationTime = 1800 | 3600;

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'enum', enum: [1800, 3600], default: 1800 })
  reminderTime: NotificationTime;
  @Column({ type: 'boolean', default: false })
  executed: boolean;
  @OneToOne(() => Event, (event) => event.notification)
  event: Event;
  @CreateDateColumn({ nullable: true })
  dateExecuted: Date;
}
