import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@mikro-orm/nestjs';

import { ExtendedEntityRepository } from 'src/common/helper/extended-repository.helper';
import {
  MockRepository,
  MockRepositoryFactory,
} from 'src/common/helper/mock.helper';
import { User, UserRepository } from 'src/entities';
import {
  DuplicateNicknameException,
  UserNotFoundException,
} from 'src/exceptions';

import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';

type UserMockRepositoryType = MockRepository<ExtendedEntityRepository<User>>;

describe('UserService', () => {
  let service: UserService;
  let mockedRepository: UserMockRepositoryType;

  beforeEach(async () => {
    const repositoryToken = getRepositoryToken(User);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: repositoryToken,
          useFactory: MockRepositoryFactory.getMockRepository(UserRepository),
          useValue: {
            findOne: jest.fn(),
            persistAndFlush: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockedRepository = module.get<UserMockRepositoryType>(repositoryToken);
  });

  it('should update user successfully', async () => {
    const userId = 1;
    const updateUserDto: UpdateUserDto = {
      nickname: 'updatedNickname',
    };

    const existingUser = new User();
    existingUser.id = userId;
    existingUser.nickname = 'originalNickname';

    jest.spyOn(mockedRepository, 'findOne').mockResolvedValue(existingUser);

    const updatedUser = await service.update(userId, updateUserDto);

    expect(updatedUser).toBeDefined();
    expect(updatedUser.id).toEqual(userId);
    expect(updatedUser.nickname).toEqual(updateUserDto.nickname);
    expect(updatedUser.role).toEqual(updateUserDto.role);
    expect(updatedUser.kakaoAccessToken).toEqual(
      updateUserDto.kakaoAccessToken,
    );
    expect(updatedUser.kakaoRefreshToken).toEqual(
      updateUserDto.kakaoRefreshToken,
    );

    expect(mockedRepository.persistAndFlush).toHaveBeenCalledWith(existingUser);
  });

  it('should throw UserNotFoundException if user does not exist', async () => {
    const userId = 999;

    jest.spyOn(mockedRepository, 'findOne').mockResolvedValue(undefined);

    await expect(
      service.update(userId, {} as UpdateUserDto),
    ).rejects.toBeInstanceOf(UserNotFoundException);
  });

  it('can check duplicate nickname', async () => {
    const existingUser = new User();
    const nickname = 'nickname';
    existingUser.id = 1;
    existingUser.nickname = nickname;

    jest.spyOn(mockedRepository, 'findOne').mockResolvedValue(existingUser);

    await expect(
      service.checkDuplicateNickname(nickname),
    ).rejects.toBeInstanceOf(DuplicateNicknameException);
  });
});
