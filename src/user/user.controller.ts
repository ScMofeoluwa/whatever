import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto';

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
  createUser(@Body() createUser: CreateUserDto) {
    return this.userService.create(createUser);
  }
}
