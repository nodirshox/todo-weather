import { Module } from '@nestjs/common';
import { TasksService } from '@tasks/tasks.service';
import { TasksController } from '@tasks/tasks.controller';
import { TasksRepository } from '@tasks/tasks.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from '@schemas/task.schema';
import { WeatherModule } from '@weather/weather.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    WeatherModule,
  ],
  providers: [TasksService, TasksRepository],
  controllers: [TasksController],
})
export class TasksModule {}
