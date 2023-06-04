import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  UseFilters,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { CreateUserDto } from '../user/dto';
import { AtGuard, RtGuard } from './common/guards';
import { EntityNotFoundExceptionFilter } from '../filters';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseFilters(new EntityNotFoundExceptionFilter())
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Req() req: Request) {
    const payload = req.user;
    return this.authService.refresh(payload['id'], payload['refreshToken']);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    const payload = req.user;
    return this.authService.logout(payload['id']);
  }
}
