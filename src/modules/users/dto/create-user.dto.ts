import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ description: 'Email', example: 'user@mail.com' })
  email: string;

  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({ description: 'Password', example: 'password' })
  password: string;
}
