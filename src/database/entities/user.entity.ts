import { Event } from './event.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

//User entities
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 100, unique: true })
  username: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ nullable: true })
  refreshToken: string;
  @CreateDateColumn()
  createdAt: Date;
  @OneToMany(() => Event, (event) => event.user, {
    cascade: true,
    nullable: true,
  })
  events: Event[];
}
