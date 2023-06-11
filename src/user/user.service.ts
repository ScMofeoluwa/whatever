import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }
    return user;
  }
  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email: email } });
  }
  async verifyUsername(username: string) {
    const user = await this.findByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username: ${username} not found`);
    }
    return user;
  }
  async create(data: CreateUserDto) {
    if (await this.findByEmail(data.email)) {
      throw new ConflictException('user with this email already exists');
    }
    if (await this.findByUsername(data.username)) {
      throw new ConflictException('user with this username already exists');
    }
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }
  async update(userId: number, data: UpdateUserDto) {
    return await this.userRepository.update(userId, data);
  }

  private async findByUsername(username: string) {
    return this.userRepository.findOneBy({ username: username });
  }
}
