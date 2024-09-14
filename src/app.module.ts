import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { WeatherModule } from './modules/weather/weather.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    UsersModule,
    TasksModule,
    WeatherModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
