import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TasksService } from '@tasks/tasks.service';
import { CreateTaskDto } from '@tasks/dto/create-task.dto';
import { JwtAuthGuard } from '@users/jwt.strategy';
import { IUser, User } from '@users/dto/user.decorator';
import { UpdateTaskDto } from '@tasks/dto/update-task.dto';

@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiTags('Tasks')
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create task' })
  createTask(@Body() body: CreateTaskDto, @User() user: IUser) {
    return this.service.createTask(user.id, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get tasks' })
  getTasks(@User() user: IUser) {
    return this.service.getTasks(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task' })
  getTask(@User() user: IUser, @Param('id') taskId: string) {
    return this.service.getTask(user.id, taskId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update task' })
  updateTask(
    @User() user: IUser,
    @Param('id') taskId: string,
    @Body() body: UpdateTaskDto,
  ) {
    return this.service.updateTask(user.id, taskId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  deleteTask(@User() user: IUser, @Param('id') taskId: string) {
    return this.service.deleteTask(user.id, taskId);
  }
}
