import { Module } from '@nestjs/common';
import { TasksService } from '@tasks/tasks.service';
import { TasksController } from '@tasks/tasks.controller';
import { TasksRepository } from '@tasks/tasks.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from '@schemas/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  providers: [TasksService, TasksRepository],
  controllers: [TasksController],
})
export class TasksModule {}
