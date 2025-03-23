import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TasksService, TaskFilters } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Task, TaskPriority } from './entities/task.entity';

@ApiTags('tasks')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Unauthorized - JWT token is missing or invalid' })
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @ApiCreatedResponse({
    description: 'Task has been successfully created',
    type: Task
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(createTaskDto, req.user);
  }

  @ApiOperation({ summary: 'Get all tasks with optional filters' })
  @ApiOkResponse({
    description: 'List of tasks matching the filters',
    type: [Task]
  })
  @ApiQuery({
    name: 'completed',
    required: false,
    type: Boolean,
    description: 'Filter by completion status'
  })
  @ApiQuery({
    name: 'priority',
    required: false,
    enum: TaskPriority,
    description: 'Filter by priority level'
  })
  @ApiQuery({
    name: 'dueBefore',
    required: false,
    type: String,
    description: 'Filter tasks due before date (ISO format)'
  })
  @ApiQuery({
    name: 'dueAfter',
    required: false,
    type: String,
    description: 'Filter tasks due after date (ISO format)'
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search tasks by title or description'
  })
  @Get()
  findAll(
    @Request() req,
    @Query('completed') completed?: string,
    @Query('priority') priority?: TaskPriority,
    @Query('dueBefore') dueBefore?: string,
    @Query('dueAfter') dueAfter?: string,
    @Query('search') search?: string,
  ) {
    const filters: TaskFilters = {};
    
    if (completed !== undefined) {
      filters.completed = completed === 'true';
    }
    if (priority) {
      filters.priority = priority;
    }
    if (dueBefore) {
      filters.dueBefore = new Date(dueBefore);
    }
    if (dueAfter) {
      filters.dueAfter = new Date(dueAfter);
    }
    if (search) {
      filters.search = search;
    }

    return this.tasksService.findAll(req.user, filters);
  }

  @ApiOperation({ summary: 'Get task statistics' })
  @ApiOkResponse({
    description: 'Task statistics including counts by status and priority',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 10 },
        completed: { type: 'number', example: 4 },
        dueToday: { type: 'number', example: 2 },
        dueThisWeek: { type: 'number', example: 5 },
        byPriority: {
          type: 'object',
          properties: {
            low: { type: 'number', example: 3 },
            medium: { type: 'number', example: 4 },
            high: { type: 'number', example: 3 }
          }
        }
      }
    }
  })
  @Get('stats')
  getStats(@Request() req) {
    return this.tasksService.getTaskStats(req.user);
  }

  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiOkResponse({
    description: 'Task details',
    type: Task
  })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    type: Number,
    example: 1
  })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.tasksService.findOne(+id, req.user);
  }

  @ApiOperation({ summary: 'Update a task' })
  @ApiOkResponse({
    description: 'Task has been successfully updated',
    type: Task
  })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    type: Number,
    example: 1
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
      return this.tasksService.update(+id, updateTaskDto, req.user);
    }
  
  @ApiOperation({ summary: 'Delete a task' })
  @ApiOkResponse({ description: 'Task has been successfully deleted' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    type: Number,
    example: 1
  })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
      return this.tasksService.remove(+id, req.user);
    }
  }