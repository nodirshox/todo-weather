import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { compareHash, generateBcrypt } from '@const/utils';
import { UsersRepository } from '@users/users.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(body: CreateUserDto) {
    const existingUser = await this.repository.getUserByEmail(body.email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    body.password = await generateBcrypt(body.password);
    await this.repository.createUser(body);

    return { message: 'User created successfully' };
  }

  async login(body: CreateUserDto) {
    const user = await this.repository.getUserByEmail(body.email);

    if (!user) {
      throw new BadRequestException('Email does not exist');
    }

    const isCorrectPassword = await compareHash(body.password, user.password);
    if (!isCorrectPassword) {
      throw new BadRequestException('Incorrect password');
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });

    return {
      message: 'Success',
      token,
    };
  }
}
