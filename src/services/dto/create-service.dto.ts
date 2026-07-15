import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'Logo Design' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Design' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'I will design a modern logo' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(5)
  price: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(1)
  deliveryDays: number;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
