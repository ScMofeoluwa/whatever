import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class AlertService {
  constructor(
    @InjectQueue('alert') private readonly alertQueue: Queue,
    private readonly eventService: EventsService,
  ) {}

  async addNotificationsToQueue() {
    console.log('Added to queue');
    const eventsWithActiveAlerts =
      await this.eventService.getEventsWithActiveNotification();
    await Promise.all(
      eventsWithActiveAlerts.map(async (event) => {
        if (
          event.startTime.getTime() + event.notification.reminderTime * 1000 >=
          Date.now()
        ) {
          await this.alertQueue.add({
            recipient: event.user.email,
            title: 'Event Reminder',
            message: `Your event meeting scheduled for ${event.startTime.toISOString()} starts in ${
              event.notification.reminderTime
            } minutes.`,
          });
          await this.eventService.updateNotificationExecutedStatus(
            event.notification.id,
          );
        }
      }),
    );
  }
}
