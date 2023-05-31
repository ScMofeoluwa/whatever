import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../database/entities/event.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto.ts';
import { Notification, NotificationTime } from '../database/entities/notification.entity';
import { UserService } from 'src/user/user.service';
import { UpdateEventDto } from './dto/update-event.dto.ts';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly userService: UserService,
  ) {}

  async get(id: number) {
    return this.eventRepository.findOne({ where: { id: id } });
  }

  async create(data: CreateEventDto) {
    const { user, notificationReminderTime, ...eventData } = data;
    let notification = null;
    if (eventData.allowNotification && notificationReminderTime) {
      notification = this.createNotification(notificationReminderTime);
    }
    const existingUser = await this.userService.findOne(user);
    const event = this.eventRepository.create({
      user: existingUser,
      ...eventData,
      notification: notification,
    });
    return this.eventRepository.save(event);
  }

  //change notification time
  //switch off notification
  async update(data: UpdateEventDto) {
    const { id, notificationReminderTime, ...updateEventInfo } = data;
    const event = await this.eventRepository.findOne({
      where: { id: id },
      relations: ['notification', 'user'],
    });
    let eventNotification = event.notification;
    //throw error if we try to update notification if it has already been executed
    if (
      eventNotification.executed &&
      updateEventInfo.allowNotification != null &&
      notificationReminderTime != null
    ) {
      throw new Error('Notification already executed');
    }
    //if update data disables notification while notification already exists
    if (updateEventInfo.allowNotification == false && eventNotification) {
      await this.notificationRepository.remove(eventNotification);
      eventNotification = null;
    }
    //update notification if only there is a change in the time
    if (notificationReminderTime && updateEventInfo.allowNotification) {
      const { reminderTime, ...otherNotificationData } = eventNotification;
      eventNotification = await this.notificationRepository.preload({
        ...otherNotificationData,
        reminderTime: notificationReminderTime,
      });
    }
    return this.eventRepository.preload({
      id: id,
      ...updateEventInfo,
      user: event.user,
      notification: eventNotification,
    });
  }

  async delete(data: UpdateEventDto) {
    const { id } = data;
    const event = await this.eventRepository.findOne({
      where: { id: id },
      relations: ['notification', 'user'],
    });
    await this.notificationRepository.remove(event.notification);
    return this.eventRepository.remove(event);
  }

  createNotification(reminderTime: NotificationTime) {
    const notification = this.notificationRepository.create({
      reminderTime: reminderTime,
    });
    return this.notificationRepository.save(notification);
  }

  updateNotificationExecutedStatus(id: number) {
    return this.notificationRepository.update(id, {
      executed: true,
      dateExecuted: Date.now(),
    });
  }

  async getEventsWithActiveNotification() {
    const allEvents = await this.eventRepository.find({
      where: { allowNotification: true },
      relations: ['notification', 'user'],
    });
    return allEvents.filter((event) => event.notification.executed == false); //return only active notification
  }
}
