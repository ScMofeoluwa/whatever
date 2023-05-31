import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { UserModule } from 'src/user/user.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [UserModule, DatabaseModule],
  providers: [EventsService],
  exports: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
