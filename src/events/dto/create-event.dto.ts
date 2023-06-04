import {
  IsBoolean,
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { NotificationTime } from '../../database/entities/notification.entity';
import { NoNotificationTimeIfNotAllowed } from './notification-decorator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  @Length(5, 50)
  title: string;
  @IsNotEmpty()
  @IsString()
  @Length(5, 255)
  description: string;
  @IsNotEmpty()
  @IsDate()
  startTime: Date;
  @IsNotEmpty()
  @IsDate()
  endTime: Date;
  @IsOptional()
  @IsBoolean()
  allowNotification: boolean;
  @IsOptional()
  @NoNotificationTimeIfNotAllowed()
  @IsInt()
  @IsIn([1800, 3600])
  notificationReminderTime: NotificationTime;
}
