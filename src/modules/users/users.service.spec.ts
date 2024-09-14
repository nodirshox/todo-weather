import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@users/users.service';
import { UsersRepository } from '@users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { compareHash, generateBcrypt } from '@const/utils';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';

jest.mock('@const/utils', () => ({
  generateBcrypt: jest.fn(),
  compareHash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            getUserByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('create', () => {
    it('should create a user if email does not exist', async () => {
      const body: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      (repository.getUserByEmail as jest.Mock).mockResolvedValue(null);
      (generateBcrypt as jest.Mock).mockResolvedValue('password123');
      (repository.createUser as jest.Mock).mockResolvedValue(null);

      const result = await service.create(body);

      expect(repository.getUserByEmail).toHaveBeenCalledWith(body.email);
      expect(generateBcrypt).toHaveBeenCalledWith(body.password);
      expect(repository.createUser).toHaveBeenCalledWith({
        ...body,
        password: 'password123',
      });
      expect(result).toEqual({ message: 'User created successfully' });
    });

    it('should throw BadRequestException if email already exists', async () => {
      const body: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      (repository.getUserByEmail as jest.Mock).mockResolvedValue({
        id: uuidv4(),
        email: 'test@example.com',
      });

      await expect(service.create(body)).rejects.toThrow(BadRequestException);
      expect(repository.getUserByEmail).toHaveBeenCalledWith(body.email);
      expect(repository.createUser).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return a token if credentials are valid', async () => {
      const body: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const user = {
        id: uuidv4(),
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      (repository.getUserByEmail as jest.Mock).mockResolvedValue(user);
      (compareHash as jest.Mock).mockResolvedValue(true);
      (jwtService.sign as jest.Mock).mockReturnValue('jwt-token');

      const result = await service.login(body);

      expect(repository.getUserByEmail).toHaveBeenCalledWith(body.email);
      expect(compareHash).toHaveBeenCalledWith(body.password, user.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
      });
      expect(result).toEqual({ message: 'Success', token: 'jwt-token' });
    });

    it('should throw BadRequestException if email does not exist', async () => {
      const body: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      (repository.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(service.login(body)).rejects.toThrow(BadRequestException);
      expect(repository.getUserByEmail).toHaveBeenCalledWith(body.email);
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      const body: CreateUserDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };
      const user = {
        id: uuidv4(),
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      (repository.getUserByEmail as jest.Mock).mockResolvedValue(user);
      (compareHash as jest.Mock).mockResolvedValue(false);

      await expect(service.login(body)).rejects.toThrow(BadRequestException);
      expect(repository.getUserByEmail).toHaveBeenCalledWith(body.email);
      expect(compareHash).toHaveBeenCalledWith(body.password, user.password);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
});
