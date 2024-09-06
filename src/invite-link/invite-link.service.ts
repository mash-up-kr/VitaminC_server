import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';

import { INVITE_LINK_EXPIRATION_DAYS } from 'src/common/constants';
import {
  GroupMap,
  GroupMapRepository,
  InviteLink,
  InviteLinkRepository,
  User,
  UserMapRoleValueType,
} from 'src/entities';
import {
  InviteLinkInvalidException,
  MapNotFoundException,
} from 'src/exceptions/index';
import { UtilService } from 'src/util/util.service';

@Injectable()
export class InviteLinkService {
  constructor(
    @InjectRepository(InviteLink)
    private readonly inviteLinkRepository: InviteLinkRepository,
    @InjectRepository(GroupMap)
    private readonly mapRepository: GroupMapRepository,
    private readonly utilService: UtilService,
  ) {}

  async create(
    mapId: string,
    role: UserMapRoleValueType,
    by: User,
  ): Promise<InviteLink> {
    const map = await this.mapRepository.findOne({ id: mapId });
    if (map == null) {
      throw new MapNotFoundException();
    }

    const expiration: number = this.getExpiration();
    const input: string = `map_id=${mapId}&user_id=${by.id}&expiration=${expiration}`;
    const token: string = this.utilService.generateMD5TokenWithSalt(input, 5);

    const inviteLink: InviteLink = new InviteLink();
    inviteLink.token = token;
    inviteLink.createdBy = by;
    inviteLink.map = map;
    inviteLink.mapRole = role;
    inviteLink.expiresAt = new Date(expiration);

    await this.inviteLinkRepository.persistAndFlush(inviteLink);

    return inviteLink;
  }

  async validate(inviteLinkToken: string): Promise<InviteLink> {
    const inviteLink = await this.inviteLinkRepository.findOne({
      token: inviteLinkToken,
    });

    if (!inviteLink) {
      throw new InviteLinkInvalidException();
    }

    if (new Date(inviteLink.expiresAt) < new Date()) {
      throw new InviteLinkInvalidException();
    }

    return inviteLink;
  }

  private getExpiration(): number {
    const now: Date = new Date();
    const expirationDate = new Date(
      now.getTime() + INVITE_LINK_EXPIRATION_DAYS * 24 * 60 * 60 * 1000,
    );
    return expirationDate.getTime();
  }
}
