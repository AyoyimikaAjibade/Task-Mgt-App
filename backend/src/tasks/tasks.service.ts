import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Like } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskPriority } from './entities/task.entity';
import { User } from '../users/entities/user.entity';

export interface TaskFilters {
  completed?: boolean;
  priority?: TaskPriority;
  dueBefore?: Date;
  dueAfter?: Date;
  search?: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  dueToday: number;
  dueThisWeek: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    try {
      const task = this.tasksRepository.create({
        ...createTaskDto,
        user,
      });
      return await this.tasksRepository.save(task);
    } catch (error) {
      console.error('Error creating task:', error);
      throw new InternalServerErrorException('Could not create task');
    }
  }

  async findAll(user: User, filters?: TaskFilters): Promise<Task[]> {
    const where: FindOptionsWhere<Task> = { user: { id: user.id } };
    
    if (filters) {
      if (filters.completed !== undefined) {
        where.completed = filters.completed;
      }
      if (filters.priority) {
        where.priority = filters.priority;
      }
      if (filters.dueBefore) {
        where.dueDate = LessThanOrEqual(filters.dueBefore);
      }
      if (filters.dueAfter) {
        where.dueDate = MoreThanOrEqual(filters.dueAfter);
      }
      if (filters.search) {
        where.title = Like(`%${filters.search}%`);
      }
    }

    return await this.tasksRepository.find({
      where,
      order: {
        dueDate: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async getTaskStats(user: User): Promise<TaskStats> {
    const today = new Date();
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    const [total, completed] = await Promise.all([
      this.tasksRepository.count({ where: { user: { id: user.id } } }),
      this.tasksRepository.count({ where: { user: { id: user.id }, completed: true } })
    ]);

    const [dueToday, dueThisWeek] = await Promise.all([
      this.tasksRepository.count({
        where: {
          user: { id: user.id },
          dueDate: LessThanOrEqual(endOfToday)
        }
      }),
      this.tasksRepository.count({
        where: {
          user: { id: user.id },
          dueDate: LessThanOrEqual(endOfWeek)
        }
      })
    ]);

    const [low, medium, high] = await Promise.all([
      this.tasksRepository.count({
        where: { user: { id: user.id }, priority: TaskPriority.LOW }
      }),
      this.tasksRepository.count({
        where: { user: { id: user.id }, priority: TaskPriority.MEDIUM }
      }),
      this.tasksRepository.count({
        where: { user: { id: user.id }, priority: TaskPriority.HIGH }
      })
    ]);

    return {
      total,
      completed,
      dueToday,
      dueThisWeek,
      byPriority: {
        low,
        medium,
        high
      }
    };
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    user: User,
): Promise<Task> {
    const task = await this.tasksRepository.findOne({
    where: { id, user: { id: user.id } },
    });
    if (!task) {
    throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    Object.assign(task, updateTaskDto);
    return await this.tasksRepository.save(task);
}

async remove(id: number, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({
    id,
    user: { id: user.id },
    });
    if (result.affected === 0) {
    throw new NotFoundException(`Task with ID "${id}" not found`);
    }
}
}