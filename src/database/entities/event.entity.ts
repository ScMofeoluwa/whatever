import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Notification } from './notification.entity';
import { User } from './user.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.events)
  user: User;
  @Column({ length: 50 })
  title: string;
  @Column({ length: 255 })
  description: string;
  @CreateDateColumn()
  createdAt: Date;
  @Column({ type: 'timestamptz' })
  startTime: Date;
  @Column({ type: 'timestamptz' })
  endTime: Date;
  @Column({ type: 'boolean', default: false })
  allowNotification: boolean;
  @OneToOne(() => Notification, (notification) => notification.event, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  notification: Notification | null;
}
