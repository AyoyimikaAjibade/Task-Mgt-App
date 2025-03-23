import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    description: 'Whether the task is completed',
    example: true,
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean = false;
}