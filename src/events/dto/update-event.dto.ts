import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
