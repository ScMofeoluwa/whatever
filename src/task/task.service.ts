import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AlertService } from 'src/alert/alert.service';

@Injectable()
export class TaskService {
  constructor(private readonly alertService: AlertService) {}

  @Cron('45 * * * * *')
  async handleCron() {
    await this.alertService.addNotificationsToQueue();
  }
}
