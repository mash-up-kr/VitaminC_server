import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';

import { INVITE_LINK_EXPIRATION_DAYS } from 'src/common/constants';
import { InviteLink, InviteLinkRepository, User } from 'src/entities';
import { InviteLinkResponseDto } from 'src/map/dtos/invite-link-response.dto';
import { UtilService } from 'src/util/util.service';

@Injectable()
export class InviteLinkService {
  constructor(
    @InjectRepository(InviteLink)
    private readonly inviteLinkRepository: InviteLinkRepository,
    private readonly utilService: UtilService,
  ) {}

  async create(mapId: string, by: User): Promise<InviteLinkResponseDto> {
    const expiration: number = this.getExpiration();
    const input: string = `map_id=${mapId}&user_id=${by.id}&expiration=${expiration}`;
    const token: string = this.utilService.generateMD5TokenWithSalt(input, 5);

    const inviteLink: InviteLink = new InviteLink();
    inviteLink.token = token;
    inviteLink.createdBy = by;
    inviteLink.map_id = mapId;
    inviteLink.expires_at = new Date(expiration);

    await this.inviteLinkRepository.persistAndFlush(inviteLink);

    return {
      invite_link_token: token,
    };
  }

  private getExpiration(): number {
    const now: Date = new Date();
    const expirationDate: Date = new Date(
      now.setDate(now.getDate() + INVITE_LINK_EXPIRATION_DAYS),
    );
    return expirationDate.getTime();
  }
}
