import { Module } from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { UsersController } from '@users/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@users/jwt.strategy';
import { ACCESS_TOKEN_EXPIRATION_TIME } from '@const/jwt-token';
import { UsersRepository } from '@users/users.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, UsersRepository, JwtStrategy],
  controllers: [UsersController],
})
export class UsersModule {}
