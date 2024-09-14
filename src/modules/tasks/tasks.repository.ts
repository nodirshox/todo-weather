import { Task } from '@schemas/task.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from '@tasks/dto/create-task.dto';
import { UpdateTaskDto } from '@tasks/dto/update-task.dto';
import { WeatherShortResponse } from '@weather/dto/weather.dto';

@Injectable()
export class TasksRepository {
  constructor(@InjectModel(Task.name) private TaskModel: Model<Task>) {}

  createTask(
    userId: string,
    body: CreateTaskDto,
    weather: WeatherShortResponse,
  ) {
    return this.TaskModel.create({ ...body, userId, weather });
  }

  getTasks(userId: string): Promise<Task[]> {
    return this.TaskModel.find({ userId });
  }

  getTask(id: string): Promise<Task> {
    return this.TaskModel.findOne({ id });
  }

  updateTask(id: string, body: UpdateTaskDto, weather: WeatherShortResponse) {
    return this.TaskModel.updateOne(
      { id },
      {
        tite: body.title,
        description: body.description,
        completed: body.completed,
        weather,
      },
    );
  }

  deleteTask(id: string) {
    return this.TaskModel.deleteOne({ id });
  }
}
