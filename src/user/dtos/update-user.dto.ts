import { IsOptional } from 'class-validator';

import { User } from '../entities/user.entity';
import {
  UserProviderValueType,
  UserRoleValueType,
} from '../entities/user.type';

export class UpdateUserDto implements Partial<User> {
  @IsOptional()
  nickname?: string;

  @IsOptional()
  provider?: UserProviderValueType;

  @IsOptional()
  providerId?: string;

  @IsOptional()
  role?: UserRoleValueType;
}
