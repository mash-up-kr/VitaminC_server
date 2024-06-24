import { Test, TestingModule } from '@nestjs/testing';

import { MockService, MockServiceFactory } from 'src/common/helper/mock.helper';

import { MapController } from './map.controller';
import { MapService } from './map.service';

describe('MapController', () => {
  let controller: MapController;
  let mockedService: MockService<MapService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MapController],
      providers: [
        {
          provide: MapService,
          useFactory: MockServiceFactory.getMockService(MapService),
        },
      ],
    }).compile();

    controller = module.get<MapController>(MapController);
    mockedService = module.get<MockService<MapService>>(MapService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(mockedService).toBeDefined();
  });
});
