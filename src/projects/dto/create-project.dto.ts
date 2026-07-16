import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Build a mobile app' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'I need a flutter developer to build my app' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @Min(1)
  budget: number;

  @ApiPropertyOptional({ example: '3 weeks' })
  @IsOptional()
  @IsString()
  timeline?: string;

  @ApiPropertyOptional({ example: ['Flutter', 'Firebase'] })
  @IsOptional()
  @IsString({ each: true })
  skills?: string[];
}
