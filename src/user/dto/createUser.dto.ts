import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Event } from 'src/events/entity/event.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsOptional()
  @IsNotEmpty()
  refreshToken: string;
  @IsOptional()
  events: Event[];
}
