import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw an exception if user exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 1 });
      await expect(
        authService.register({
          email: 'user@example.com',
          password: 'strongpassword',
          username: 'marco',
        }),
      ).rejects.toThrow(HttpException);
    });

    it('should create a new user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        email: 'user@example.com',
        username: 'marco',
        password: 'strongPassword',
      });
      const result = await authService.register({
        email: 'user@example.com',
        password: 'strongpassword',
        username: 'marco',
      });
      expect(result).toEqual({
        email: 'user@example.com',
        username: 'marco',
      });
    });
  });

  describe('validateUser', () => {
    it('should return null if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      const result = await authService.validateUser({
        email: 'user@example.com',
        password: 'strongpassword',
      });
      expect(result).toBeNull();
    });

    it('should return user data if password matches', async () => {
      const user = {
        email: 'user@example.com',
        password: await bcrypt.hash('strongpassword', 10),
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      const result = await authService.validateUser({
        email: 'user@example.com',
        password: 'strongpassword',
      });
      expect(result).toEqual({
        email: 'user@example.com',
        username: undefined,
        id: undefined,
      });
    });
  });

  describe('login', () => {
    it('should throw an exception if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(
        authService.login({
          email: 'user@example.com',
          password: 'strongpassword',
        }),
      ).rejects.toThrow(HttpException);
    });

    it('should return an access token if user exists', async () => {
      const user = {
        id: 1,
        email: 'user@example.com',
        password: await bcrypt.hash('strongpassword', 10),
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('token');
      const result = await authService.login({
        email: 'user@example.com',
        password: 'strongpassword',
      });
      expect(result).toEqual({ access_token: 'token' });
    });
  });
});
