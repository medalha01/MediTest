import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UserDto } from './auth.dto';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let prismaService: PrismaService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user data when user is found', async () => {
      const payload = { sub: 'test-id', email: 'test@example.com' };
      const user = {
        id: 'test-id',
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      const result = await jwtStrategy.validate(payload);
      expect(result).toEqual(new UserDto(user.email, user.username, user.id));
    });

    it('should return null when user is not found', async () => {
      const payload = { sub: 'test-id', email: 'test@example.com' };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await jwtStrategy.validate(payload);
      expect(result).toBeNull();
    });
  });
});
