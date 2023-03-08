import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.ts/user.entity.ts';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/user.dto.ts/createUser.dto.ts.js';
import { UpdateUserDto } from './dto/update-user.dto.ts/update-user.dto.ts.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id: id } });
  }
  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email: email } });
  }
  async findByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username: username } });
  }
  async create(createUser: createUserDto) {
    const newUser = await this.userRepository.create(createUser);
    return this.userRepository.save(newUser);
  }
  async update(updateUser: UpdateUserDto) {
    const user = await this.userRepository.preload(updateUser);
    return this.userRepository.save(user);
  }
}
