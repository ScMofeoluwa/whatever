import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto';
import { AtGuard } from '../auth/common/guards';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventsService) {}

  @UseGuards(AtGuard)
  @Get('/:id')
  @HttpCode(HttpStatus.FOUND)
  async getEvent(@Param('id') id: number, @Request() req) {
    return this.eventService.get(req.user.id, id);
  }

  @UseGuards(AtGuard)
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateEventDto, @Request() req) {
    return this.eventService.create(req.user.id, dto);
  }

  @UseGuards(AtGuard)
  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number, @Body() dto: CreateEventDto, @Request() req) {
    return this.eventService.update(req.user.id, { ...dto, id: id });
  }

  @UseGuards(AtGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: number, @Request() req) {
    return this.eventService.delete(req.user.id, id);
  }

  //   @Get('/user//:userId')
  //   @HttpCode(HttpStatus.FOUND)
  //   getEventsByUser(@Param('userId') userId: number) {}
}
