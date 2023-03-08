import { PartialType } from '@nestjs/mapped-types';
import { createUserDto } from '../user.dto.ts/createUser.dto.ts';

export class UpdateUserDto extends PartialType(createUserDto) {}
