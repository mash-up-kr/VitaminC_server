import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@mikro-orm/nestjs';

import { ExtendedEntityRepository } from 'src/common/helper/extended-repository.helper';
import {
  MockRepository,
  MockRepositoryFactory,
} from 'src/common/helper/mock.helper';
import { InviteLink, InviteLinkRepository, User } from 'src/entities';

import { InviteLinkService } from './invite-link.service';

type InviteLinkMockRepositoryType = MockRepository<
  ExtendedEntityRepository<InviteLink>
>;
describe('InviteLinkService', () => {
  let service: InviteLinkService;
  let mockedRepository: InviteLinkMockRepositoryType;

  beforeEach(async () => {
    const repositoryToken = getRepositoryToken(User);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InviteLinkService,
        {
          provide: repositoryToken,
          useFactory:
            MockRepositoryFactory.getMockRepository(InviteLinkRepository),
        },
      ],
    }).compile();

    service = module.get<InviteLinkService>(InviteLinkService);
    mockedRepository =
      module.get<InviteLinkMockRepositoryType>(repositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
