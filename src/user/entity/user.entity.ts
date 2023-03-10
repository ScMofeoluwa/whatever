import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

//User entity
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
}
