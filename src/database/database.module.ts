import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Event, Notification } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User, Notification])],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
