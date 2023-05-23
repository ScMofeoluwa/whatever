import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto.ts';
import { UpdateEventDto } from './dto/update-event.dto.ts';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventsService) {}

  @Get('/:id')
  @HttpCode(HttpStatus.FOUND)
  getEvent(@Param('id') id: number) {
    return this.eventService.get(id);
  }
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateEventDto) {
    return this.eventService.create(dto);
  }

  @Patch('/update/:id')
  @HttpCode(204)
  update(@Param('id') id: number, @Body() dto: UpdateEventDto) {
    return this.eventService.update({ ...dto, id: id });
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: number) {
    return this.eventService.delete({ id });
  }

  //   @Get('/user//:userId')
  //   @HttpCode(HttpStatus.FOUND)
  //   getEventsByUser(@Param('userId') userId: number) {}
}
