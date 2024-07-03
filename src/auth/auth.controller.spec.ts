// Importing necessary modules and dependencies
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { LocalAuthGuard } from './local-auth.guard';

// Mocking AuthService for isolation in unit tests
const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const dto: RegisterDto = {
        email: 'user@example.com',
        password: 'strongpassword',
        username: 'test',
      };
      const mockResponse = { id: 1, ...dto };
      mockAuthService.register.mockResolvedValue(mockResponse);

      await expect(controller.register(dto)).resolves.toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'User successfully registered',
        data: mockResponse,
      });
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });

    it('should handle registration failure', async () => {
      const dto: RegisterDto = {
        email: 'user@example.com',
        password: 'strongpassword',
        username: 'test',
      };
      const error = new Error('Registration failed');
      mockAuthService.register.mockRejectedValue(error);

      await expect(controller.register(dto)).rejects.toThrow(HttpException);
      await expect(controller.register(dto)).rejects.toHaveProperty(
        'message',
        'Registration failed',
      );
    });
  });

  describe('login', () => {
    it('should successfully log in a user', async () => {
      const dto: LoginDto = {
        email: 'user@example.com',
        password: 'strongpassword',
      };
      const mockResponse = { access_token: 'token' };
      mockAuthService.login.mockResolvedValue(mockResponse);

      await expect(controller.login(dto)).resolves.toEqual({
        statusCode: HttpStatus.OK,
        message: 'User successfully logged in',
        data: { token: 'token' },
      });
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });

    it('should fail to log in a user', async () => {
      const dto: LoginDto = {
        email: 'user@example.com',
        password: 'wrongpassword',
      };
      const errorResponse = {
        message: 'Login failed',
        status: HttpStatus.UNAUTHORIZED,
      };
      mockAuthService.login.mockRejectedValue(
        new HttpException(errorResponse.message, errorResponse.status),
      );

      await expect(controller.login(dto)).rejects.toThrow(HttpException);
      await expect(controller.login(dto)).rejects.toHaveProperty(
        'response',
        'Login failed',
      );
      await expect(controller.login(dto)).rejects.toHaveProperty(
        'status',
        HttpStatus.UNAUTHORIZED,
      );
    });
  });

  describe('test', () => {
    it('should throw a Forbidden exception', async () => {
      await expect(controller.test()).rejects.toThrow(HttpException);
      await expect(controller.test()).rejects.toThrow('Forbidden');
      await expect(controller.test()).rejects.toHaveProperty(
        'status',
        HttpStatus.FORBIDDEN,
      );
    });
  });
});
