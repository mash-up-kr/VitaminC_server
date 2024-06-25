import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@mikro-orm/nestjs';

import { ExtendedEntityRepository } from 'src/common/helper/extended-repository.helper';
import {
  MockRepository,
  MockRepositoryFactory,
} from 'src/common/helper/mock.helper';

import { GroupMap } from './entities/map.entity';
import { MapRepository } from './map.repository';
import { MapService } from './map.service';

type MapMockRepositoryType = MockRepository<ExtendedEntityRepository<GroupMap>>;

describe('MapService', () => {
  let service: MapService;
  let mockedRepository: MapMockRepositoryType;

  beforeEach(async () => {
    const repositoryToken = getRepositoryToken(GroupMap);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MapService,
        {
          provide: repositoryToken,
          useFactory: MockRepositoryFactory.getMockRepository(MapRepository),
        },
      ],
    }).compile();

    service = module.get<MapService>(MapService);
    mockedRepository = module.get<MapMockRepositoryType>(repositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockedRepository).toBeDefined();
  });
});
