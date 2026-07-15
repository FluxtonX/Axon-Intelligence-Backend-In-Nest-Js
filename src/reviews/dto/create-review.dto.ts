import { IsString, IsNotEmpty, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 'uuid-of-contract', description: 'The ID of the completed contract' })
  @IsString()
  @IsNotEmpty()
  contractId: string;

  @ApiProperty({ example: 5, description: 'Rating from 1 to 5' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Great to work with!', description: 'Optional feedback comment' })
  @IsString()
  @IsOptional()
  comment?: string;
}
