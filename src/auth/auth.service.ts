import { ForbiddenException, Injectable, HttpStatus } from '@nestjs/common';
import { AuthDto } from './dto';
import { CreateUserDto } from '../user/dto';
import { genSalt, hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthToken } from './types';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private userService: UserService,
  ) {}

  async signup(data: CreateUserDto) {
    data.password = await this.hashPassword(data.password);
    await this.userService.create(data);
    return { message: 'account successfully created' };
  }

  async login(data: AuthDto): Promise<AuthToken> {
    const user = await this.userService.verifyUsername(data.username);
    if (!user) throw new ForbiddenException('Access Denied');
    const valid = await this.isValid(data.password, user.password);
    if (!valid) throw new ForbiddenException('Access Denied');
    const tokens = await this.generateTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new ForbiddenException('Access Denied');
    const valid = await this.isValid(refreshToken, user.refreshToken);
    if (!valid) throw new ForbiddenException('Access Denied');
    const tokens = await this.generateTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number) {
    await this.userService.update(userId, { refreshToken: null });
    return {
      statusCode: HttpStatus.OK,
      message: 'user has been successfully logged out.',
    };
  }

  async generateTokens(userId: number) {
    const accessToken = await this.jwtService.signAsync(
      { id: userId },
      { expiresIn: 60 * 15, secret: this.config.get('AT_SECRET') },
    );
    const refreshToken = await this.jwtService.signAsync(
      { id: userId },
      { expiresIn: 60 * 60 * 24 * 7, secret: this.config.get('RT_SECRET') },
    );
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const data = await this.hashPassword(refreshToken);
    await this.userService.update(userId, { refreshToken: data });
  }

  async hashPassword(password: string) {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }

  async isValid(given: string, expected: string): Promise<boolean> {
    return await compare(given, expected);
  }
}
