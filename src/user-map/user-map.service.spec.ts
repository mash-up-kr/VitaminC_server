import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@mikro-orm/nestjs';

import { ExtendedEntityRepository } from 'src/common/helper/extended-repository.helper';
import {
  MockRepository,
  MockRepositoryFactory,
} from 'src/common/helper/mock.helper';
import {
  GroupMap,
  User,
  UserMap,
  UserMapRepository,
  UserMapRole,
} from 'src/entities';

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

  it('should get the user-map by user_id, map_id', async () => {
    const userId = 1;
    const mapId = 'test-map';

    const existUserMap = new UserMap();
    existUserMap.user = new User();
    existUserMap.user.id = userId;
    existUserMap.map = new GroupMap();
    existUserMap.map.id = mapId;
    existUserMap.role = UserMapRole.ADMIN;

    jest.spyOn(mockedRepository, 'findOne').mockResolvedValue(existUserMap);

    const userMap = await service.findOneByUserAndMap(userId, mapId);

    expect(userMap).toBeDefined();
    expect(userMap).toEqual(existUserMap);
  });
});
