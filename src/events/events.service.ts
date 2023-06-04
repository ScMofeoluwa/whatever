import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../database/entities';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateEventDto, UpdateEventDto } from './dto';
import {
  Notification,
  NotificationTime,
} from '../database/entities/notification.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly userService: UserService,
  ) {}

  async get(user, id: number) {
    const event = await this.eventRepository.findOne({
      where: { id: id, user: { id: user } },
    });
    if (!event) {
      throw new EntityNotFoundError(Event, { id: id });
    }
    return event;
  }

  async create(user: number, data: CreateEventDto) {
    const { allowNotification, notificationReminderTime, ...eventData } = data;
    const existingUser = await this.userService.findOne(user);
    let event = this.eventRepository.create({
      user: existingUser,
      allowNotification,
      ...eventData,
    });
    if (allowNotification) {
      event.notification = await this.createNotification(
        notificationReminderTime,
      );
    }
    event = await this.eventRepository.save(event);
    return this.get(user, event.id);
  }

  //change notification time
  //switch off notification
  async update(user: number, data: UpdateEventDto) {
    const { id, notificationReminderTime, ...updateEventInfo } = data;
    const event = await this.eventRepository.findOne({
      where: { id: id, user: { id: user } },
      relations: ['notification'],
    });
    if (!event) {
      throw new EntityNotFoundError(Event, { id: id });
    }
    const eventNotification = event.notification;
    //throw error if we try to update notification if it has already been executed
    if (eventNotification.executed) {
      throw new Error('Notification already executed');
    }
    //if update data disables notification while notification already exists
    if (updateEventInfo.allowNotification == false && eventNotification) {
      const eventNotificationId = eventNotification.id;
      event.notification = null;
      await this.eventRepository.save(event);
      await this.notificationRepository.delete(eventNotificationId);
    }
    //update notification if only there is a change in the time
    if (notificationReminderTime !== eventNotification.reminderTime) {
      await this.notificationRepository.update(eventNotification.id, {
        reminderTime: notificationReminderTime,
      });
    }
    await this.eventRepository.preload({
      id: id,
      ...updateEventInfo,
      notification: eventNotification,
    });
    return this.get(user, event.id);
  }

  async delete(user: number, id: number) {
    const event = await this.eventRepository.findOne({
      where: { id: id, user: { id: user } },
      relations: ['notification', 'user'],
    });
    if (!event) {
      throw new EntityNotFoundError(Event, { id: id });
    }
    const eventNotificationId = event.notification.id;
    await this.eventRepository.delete(event.id);
    return this.notificationRepository.delete(eventNotificationId);
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
