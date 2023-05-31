import { MailerService } from '@nestjs-modules/mailer';
import { Processor, Process } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';

@Processor('alert')
export class AlertProcessor {
  constructor(
    private mailService: MailerService,
    private configService: ConfigService,
  ) {}
  async sendMail(recipient: string, title: string, message: string) {
    return this.mailService.sendMail({
      to: recipient,
      subject: title,
      text: message,
      from: this.configService.get('MAIL_USER'),
    });
  }

  @Process()
  async queueAlert(
    job: Job<{ recipient: string; title: string; message: string }>,
  ) {
    const { recipient, title, message } = job.data;
    await this.sendMail(recipient, title, message);
    return {};
  }
}
