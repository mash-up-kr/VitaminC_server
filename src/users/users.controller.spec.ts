import { Test, TestingModule } from '@nestjs/testing';

import { MockService, MockServiceFactory } from 'src/common/helper/mock.helper';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let mockedService: MockService<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: MockServiceFactory.getMockService(UsersService),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    mockedService = module.get<MockService<UsersService>>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(mockedService).toBeDefined();
  });
});
