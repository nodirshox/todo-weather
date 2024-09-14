import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TasksRepository } from '@tasks/tasks.repository';
import { CreateTaskDto } from '@tasks/dto/create-task.dto';
import { UpdateTaskDto } from '@tasks/dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly repository: TasksRepository) {}

  async createTask(userId: string, body: CreateTaskDto) {
    return this.repository.createTask(userId, body);
  }

  async getTasks(userId: string) {
    const tasks = await this.repository.getTasks(userId);

    return {
      tasks: tasks.map((t) => {
        return {
          id: t.id,
          title: t.title,
          description: t.description,
          completed: t.completed,
        };
      }),
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

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
    };
  }

  async updateTask(userId: string, taskId: string, body: UpdateTaskDto) {
    await this.getTask(userId, taskId);

    await this.repository.updateTask(taskId, body);

    return { message: 'Task updated successfully' };
  }

  async deleteTask(userId: string, taskId: string) {
    await this.getTask(userId, taskId);

    await this.repository.deleteTask(taskId);

    return { message: 'Task deleted successfully' };
  }
}
