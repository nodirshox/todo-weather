import { Task } from '@schemas/task.schema';
import { TaskResponseDto } from '@tasks/dto/task-response.dto';

export class TaskTransform {
  static transformTask(task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      weather: {
        temperature: task.weather.temperature,
        condition: task.weather.condition,
      },
    };
  }
}
