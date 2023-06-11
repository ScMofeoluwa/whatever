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
    const eventsWithActiveAlerts =
      await this.eventService.getEventsWithActiveNotification();
    await Promise.all(
      eventsWithActiveAlerts.map(async (event) => {
        const reminderTimeInMillisecs = event.notification.reminderTime * 1000;
        const currentTime = Date.now();
        const eventStartTime = event.startTime.getTime();

        if (currentTime + reminderTimeInMillisecs <= eventStartTime) {
          const delay = eventStartTime - reminderTimeInMillisecs - currentTime;
          await this.alertQueue.add(
            {
              recipient: event.user.email,
              title: 'Event Reminder',
              message: `Your event meeting scheduled for ${event.startTime.toISOString()} starts in ${
                event.notification.reminderTime / 60
              } minutes.`,
            },
            { delay: delay },
          );
          console.log('Added to queue');
          await this.eventService.updateNotificationExecutedStatus(
            event.notification.id,
          );
        }
      }),
    );
  }
}
