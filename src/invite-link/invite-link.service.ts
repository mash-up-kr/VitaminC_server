import { GoneException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';

import { INVITE_LINK_EXPIRATION_DAYS } from 'src/common/constants';
import { InviteLink, InviteLinkRepository, User } from 'src/entities';
import { InviteLinkGoneException } from 'src/exceptions/index';
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
      inviteLinkToken: token,
    };
  }

  async validate(inviteLinkToken: string): Promise<InviteLink> {
    const inviteLink = await this.inviteLinkRepository.findOne({
      token: inviteLinkToken,
    });

    if (new Date(inviteLink.expires_at) < new Date()) {
      throw new InviteLinkGoneException();
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
