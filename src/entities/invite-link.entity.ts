import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import {
  UserMapRole,
  UserMapRoleValueType,
} from 'src/entities/user-map.entity';
import { User } from 'src/entities/user.entity';

import { InviteLinkRepository } from './invite-link.repository';

@Entity({ tableName: 'invite_link', repository: () => InviteLinkRepository })
export class InviteLink {
  @PrimaryKey()
  token: string;

  @ManyToOne(() => User)
  createdBy: User;

  @Property({ type: 'string' })
  map_id: string;

  @Property({ type: 'string', default: UserMapRole.WRITE })
  @Enum({ items: [UserMapRole.ADMIN, UserMapRole.READ, UserMapRole.WRITE] })
  map_role: UserMapRoleValueType;

  @Property({ type: 'timestamp' })
  expires_at: Date;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
