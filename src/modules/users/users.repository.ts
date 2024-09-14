import { User } from '@schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '@users/dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  getUserByEmail(email: string): Promise<User> {
    return this.UserModel.findOne({ email });
  }

  createUser(body: CreateUserDto): Promise<User> {
    return this.UserModel.create(body);
  }

  async getUserForAuth(id: string): Promise<User> {
    return this.UserModel.findOne({ id });
  }
}
