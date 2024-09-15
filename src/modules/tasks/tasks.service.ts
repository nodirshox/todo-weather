import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TasksRepository } from '@tasks/tasks.repository';
import { CreateTaskDto } from '@tasks/dto/create-task.dto';
import { UpdateTaskDto } from '@tasks/dto/update-task.dto';
import { WeatherService } from '@weather/weather.service';
import { TaskTransform } from '@tasks/tasks.transform';

@Injectable()
export class TasksService {
  constructor(
    private readonly repository: TasksRepository,
    private readonly weatherService: WeatherService,
  ) {}

  async createTask(userId: string, body: CreateTaskDto) {
    const weather = await this.weatherService.fetchWeather();
    await this.repository.createTask(userId, body, weather);
    return { message: 'Task created successfully' };
  }

  async getTasks(userId: string) {
    const tasks = await this.repository.getTasks(userId);

    return {
      tasks: tasks.map(TaskTransform.transformTask),
    };
  }

  async getAllTasks() {
    const tasks = await this.repository.getAllTasks();

    return {
      tasks: tasks.map(TaskTransform.transformTask),
    };
  }

  async getTask(userId: string, taskId: string) {
    const task = await this.repository.getTask(taskId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('Task belongs to other user');
    }

    return TaskTransform.transformTask(task);
  }

  async updateTask(userId: string, taskId: string, body: UpdateTaskDto) {
    await this.getTask(userId, taskId);

    const weather = await this.weatherService.fetchWeather();
    await this.repository.updateTask(taskId, body, weather);

    return { message: 'Task updated successfully' };
  }

  async deleteTask(userId: string, taskId: string) {
    await this.getTask(userId, taskId);

    await this.repository.deleteTask(taskId);

    return { message: 'Task deleted successfully' };
  }
}
