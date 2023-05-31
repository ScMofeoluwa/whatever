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

export class CreateEventDto {
  @IsNotEmpty()
  @IsInt()
  user: number;
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
  @IsInt()
  @IsIn([1800, 3600])
  notificationReminderTime: NotificationTime;
}
