import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UsersService } from '@users/users.service';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { LoginUserDto } from '@users/dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Post('registraion')
  @ApiOperation({ description: 'Create user' })
  async registration(@Body() body: CreateUserDto) {
    return this.service.create(body);
  }

  @Post('login')
  @ApiOperation({ description: 'Login user' })
  async login(@Body() body: LoginUserDto) {
    return this.service.login(body);
  }
}
