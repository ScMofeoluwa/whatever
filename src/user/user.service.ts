import { Injectable, ConflictException } from '@nestjs/common';
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
      throw new EntityNotFoundError(User, { id: id });
    }
    return user;
  }
  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email: email } });
  }
  async findByUsername(username: string) {
    const user = await this.userRepository.findOneBy({ username: username });
    if (!user) {
      throw new EntityNotFoundError(User, { username: username });
    }
    return user;
  }
  async create(data: CreateUserDto) {
    if (await this.findByEmail(data.email)) {
      throw new ConflictException('user with this email already exists');
    }
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }
  async update(userId: number, data: UpdateUserDto) {
    return await this.userRepository.update(userId, data);
  }
}
