import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@mikro-orm/nestjs';

import { ExtendedEntityRepository } from 'src/common/helper/extended-repository.helper';
import {
  MockRepository,
  MockRepositoryFactory,
} from 'src/common/helper/mock.helper';

import { UserMap } from './entities/user-map.entity';
import { UserMapRepository } from './user-map.repository';
import { UserMapService } from './user-map.service';

type UserMapMockRepositoryType = MockRepository<
  ExtendedEntityRepository<UserMap>
>;

describe('UserMapService', () => {
  let service: UserMapService;
  let mockedRepository: UserMapMockRepositoryType;

  beforeEach(async () => {
    const repositoryToken = getRepositoryToken(UserMap);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserMapService,
        {
          provide: repositoryToken,
          useFactory:
            MockRepositoryFactory.getMockRepository(UserMapRepository),
        },
      ],
    }).compile();

    service = module.get<UserMapService>(UserMapService);
    mockedRepository = module.get<UserMapMockRepositoryType>(repositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockedRepository).toBeDefined();
  });
});
