import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TasksService } from '@tasks/tasks.service';
import { TasksRepository } from '@tasks/tasks.repository';
import { WeatherService } from '@weather/weather.service';
import { CreateTaskDto } from '@tasks/dto/create-task.dto';
import { UpdateTaskDto } from '@tasks/dto/update-task.dto';
import { v4 as uuidv4 } from 'uuid';

describe('TasksService', () => {
  let service: TasksService;
  let repository: TasksRepository;
  let weatherService: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useValue: {
            createTask: jest.fn(),
            getTasks: jest.fn(),
            getTask: jest.fn(),
            updateTask: jest.fn(),
            deleteTask: jest.fn(),
          },
        },
        {
          provide: WeatherService,
          useValue: {
            fetchWeather: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<TasksRepository>(TasksRepository);
    weatherService = module.get<WeatherService>(WeatherService);
  });

  describe('createTask', () => {
    it('should create a task and return a success message', async () => {
      const mockWeather = { temperature: 25, condition: 'sunny' };
      const mockCreateTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Task description',
        completed: true,
      };

      (weatherService.fetchWeather as jest.Mock).mockResolvedValue(mockWeather);
      (repository.createTask as jest.Mock).mockResolvedValue(null);

      const result = await service.createTask('user1', mockCreateTaskDto);

      expect(weatherService.fetchWeather).toHaveBeenCalled();
      expect(repository.createTask).toHaveBeenCalledWith(
        'user1',
        mockCreateTaskDto,
        mockWeather,
      );
      expect(result).toEqual({ message: 'Task created successfully' });
    });
  });

  describe('getTasks', () => {
    it('should return formatted tasks', async () => {
      const mockTasks = [
        {
          id: 'task1',
          title: 'Task 1',
          description: 'First task',
          completed: false,
          userId: uuidv4(),
          weather: { temperature: 20, condition: 'cloudy' },
        },
      ];

      (repository.getTasks as jest.Mock).mockResolvedValue(mockTasks);

      const result = await service.getTasks('user1');

      expect(repository.getTasks).toHaveBeenCalledWith('user1');
      expect(result).toEqual({
        tasks: mockTasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          completed: task.completed,
          weather: task.weather,
        })),
      });
    });
  });

  describe('getTask', () => {
    it('should return the task if it belongs to the user', async () => {
      const mockTask = {
        id: 'task1',
        userId: 'user1',
        title: 'Task 1',
        description: 'First task',
        completed: false,
        weather: { temperature: 20, condition: 'cloudy' },
      };

      (repository.getTask as jest.Mock).mockResolvedValue(mockTask);

      const result = await service.getTask('user1', 'task1');

      expect(repository.getTask).toHaveBeenCalledWith('task1');
      expect(result).toEqual({
        id: mockTask.id,
        title: mockTask.title,
        description: mockTask.description,
        completed: mockTask.completed,
        weather: mockTask.weather,
      });
    });

    it('should throw NotFoundException if the task is not found', async () => {
      (repository.getTask as jest.Mock).mockResolvedValue(null);

      await expect(service.getTask('user1', 'task1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if the task belongs to another user', async () => {
      const mockTask = {
        id: 'task1',
        userId: 'user2',
        title: 'Task 1',
        description: 'First task',
        completed: false,
        weather: { temperature: 20, condition: 'cloudy' },
      };

      (repository.getTask as jest.Mock).mockResolvedValue(mockTask);

      await expect(service.getTask('user1', 'task1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('updateTask', () => {
    it('should update a task and return a success message', async () => {
      const mockWeather = { temperature: 22, condition: 'rainy' };
      const mockTask = {
        id: 'task1',
        userId: 'user1',
        title: 'Task 1',
        description: 'First task',
        completed: false,
        weather: { temperature: 20, condition: 'cloudy' },
      };
      const mockUpdateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated description',
        completed: false,
      };

      (repository.getTask as jest.Mock).mockResolvedValue(mockTask);
      (weatherService.fetchWeather as jest.Mock).mockResolvedValue(mockWeather);
      (repository.updateTask as jest.Mock).mockResolvedValue(null);

      const result = await service.updateTask(
        'user1',
        'task1',
        mockUpdateTaskDto,
      );

      expect(repository.getTask).toHaveBeenCalledWith('task1');
      expect(weatherService.fetchWeather).toHaveBeenCalled();
      expect(repository.updateTask).toHaveBeenCalledWith(
        'task1',
        mockUpdateTaskDto,
        mockWeather,
      );
      expect(result).toEqual({ message: 'Task updated successfully' });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and return a success message', async () => {
      const mockTask = {
        id: 'task1',
        userId: 'user1',
        title: 'Task 1',
        description: 'First task',
        completed: false,
        weather: { temperature: 20, condition: 'cloudy' },
      };

      (repository.getTask as jest.Mock).mockResolvedValue(mockTask);
      (repository.deleteTask as jest.Mock).mockResolvedValue(null);

      const result = await service.deleteTask('user1', 'task1');

      expect(repository.getTask).toHaveBeenCalledWith('task1');
      expect(repository.deleteTask).toHaveBeenCalledWith('task1');
      expect(result).toEqual({ message: 'Task deleted successfully' });
    });
  });
});
