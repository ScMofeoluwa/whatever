import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { AlertProcessor } from './alert.processor';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    EventsModule,
    BullModule.registerQueue({ name: 'alert' }),
    MailerModule,
  ],
  providers: [AlertService, AlertProcessor],
  exports: [AlertService, BullModule],
})
export class AlertModule {}
