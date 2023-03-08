import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/user.dto.ts/createUser.dto.ts';
import { UpdateUserDto } from './dto/update-user.dto.ts/update-user.dto.ts';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
  @Get('/:id')
  findById(@Param('id') id: number) {
    return this.userService.findOne(id);
  }
  @Post()
  createUser(@Body() createUser: createUserDto) {
    return this.userService.create(createUser);
  }
}
