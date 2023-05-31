import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { BullModule } from '@nestjs/bull';
import { EventsService } from 'src/events/events.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { AlertProcessor } from './alert.processor';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    EventsModule,
    BullModule.registerQueue({ name: 'alert' }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          auth: {
            user: config.get('MAIL_USER'),
            password: config.get('MAIL_PASS'),
          },
        },
      }),
    }),
  ],
  providers: [AlertService, AlertProcessor],
  exports: [AlertService, BullModule],
})
export class AlertModule {}
