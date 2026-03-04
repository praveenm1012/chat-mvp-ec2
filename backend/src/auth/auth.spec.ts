import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';

describe('Auth', () => {
  let service: AuthService;
  let controller: AuthController;
  let userRepository: jest.Mocked<Repository<User>>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: User = {
    id: 'uuid-1234',
    email: 'test@example.com',
    password_hash: '$2b$12$hashedpassword',
    created_at: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  };

  beforeEach(async () => {
    const mockUserRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findOneOrFail: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('should register a new user and return id, email, created_at', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.register({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        created_at: mockUser.created_at,
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(userRepository.create).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.register({ email: 'test@example.com', password: 'password123' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should hash the password before saving', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      await service.register({ email: 'test@example.com', password: 'plaintext' });

      const createCall = userRepository.create.mock.calls[0][0] as Partial<User>;
      expect(createCall.password_hash).toBeDefined();
      expect(createCall.password_hash).not.toBe('plaintext');
    });
  });

  describe('login', () => {
    it('should return access_token on valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const userWithHash = { ...mockUser, password_hash: hashedPassword };

      userRepository.findOne.mockResolvedValue(userWithHash);
      jwtService.sign.mockReturnValue('signed.jwt.token');

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({ access_token: 'signed.jwt.token' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: userWithHash.id,
        email: userWithHash.email,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nonexistent@example.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 12);
      const userWithHash = { ...mockUser, password_hash: hashedPassword };

      userRepository.findOne.mockResolvedValue(userWithHash);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('AuthController', () => {
    it('should call authService.register and return result', async () => {
      const registerDto = { email: 'test@example.com', password: 'password123' };
      const expectedResult = { id: 'uuid-1234', email: 'test@example.com', created_at: new Date() };

      jest.spyOn(service, 'register').mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);
      expect(result).toEqual(expectedResult);
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });

    it('should call authService.login and return access_token', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const expectedResult = { access_token: 'signed.jwt.token' };

      jest.spyOn(service, 'login').mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);
      expect(result).toEqual(expectedResult);
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
