import { Test, TestingModule } from '@nestjs/testing';

import { MockService, MockServiceFactory } from 'src/common/helper/mock.helper';

import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let mockedService: MockService<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useFactory: MockServiceFactory.getMockService(UserService),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    mockedService = module.get<MockService<UserService>>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(mockedService).toBeDefined();
  });
});
