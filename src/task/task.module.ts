import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { AlertModule } from 'src/alert/alert.module';

@Module({
  imports: [AlertModule],
  providers: [TaskService],
})
export class TaskModule {}
