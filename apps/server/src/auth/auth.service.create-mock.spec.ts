import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Collection } from '../collections/collection.entity';
import { UtilsService } from '../utils/utils.service';
import { Link } from '../links/link.entity';
import { CollectionsService } from '../collections/collections.service';

describe('AuthService using createMock with DI', () => {
  // let service: AuthService;
  let userRepo: Repository<User>;
  let collectionRepo: Repository<Collection>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JwtService,
        ConfigService,
        UtilsService,
        {
          provide: getRepositoryToken(User),
          useValue: createMock<Repository<User>>(),
        },
        {
          provide: getRepositoryToken(Collection),
          useValue: createMock<Repository<Collection>>(),
        },
      ],
    }).compile();

    // service = module.get<AuthService>(AuthService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    collectionRepo = module.get<Repository<Collection>>(
      getRepositoryToken(Collection),
    );
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });
  it('should have the repo mocked', () => {
    expect(typeof userRepo.find).toBe('function');
    expect(typeof collectionRepo.find).toBe('function');
  });
});

describe('AuthService using createMock without DI', () => {
  const userRepo = createMock<Repository<User>>();
  const collectionRepo = createMock<Repository<Collection>>();

  beforeEach(async () => {
    await Test.createTestingModule({
      providers: [
        UsersService,
        CollectionsService,
        ConfigService,
        UtilsService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepo,
        },
        {
          provide: getRepositoryToken(Collection),
          useValue: collectionRepo,
        },
      ],
    }).compile();
  });

  it('should have the repo mocked', async () => {
    const link = new Link();
    link.title = 'test';
    link.description = 'test';
    link.url = 'test';
    const collection = new Collection();
    collection.title = 'test';
    collection.description = 'test';
    const user = {
      id: 1,
      username: 'user1',
      password: 'password',
      links: [link],
      collections: [collection],
    };
    userRepo.find.mockResolvedValue([user]);
    // tslint:disable-next-line: no-invalid-await
    expect(await userRepo.find()).toEqual([user]);
  });
});
