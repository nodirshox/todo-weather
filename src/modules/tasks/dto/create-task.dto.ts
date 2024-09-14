import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Title', example: 'Read a book' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'description', example: 'Lorem ipsum' })
  description: string;

  @IsBoolean()
  @ApiProperty({ description: 'Completed status', example: true })
  completed: boolean;
}
