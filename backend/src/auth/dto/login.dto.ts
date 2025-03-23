import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Username for authentication',
    example: 'john.doe',
    minLength: 3,
    maxLength: 20
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'Account password',
    example: 'strongP@ssw0rd',
    minLength: 8,
    format: 'password'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
