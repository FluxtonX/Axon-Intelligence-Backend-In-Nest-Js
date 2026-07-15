import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProposalDto {
  @ApiProperty({ example: 'proj-123' })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(1)
  bidAmount: number;

  @ApiProperty({ example: 7 })
  @IsNumber()
  @Min(1)
  deliveryDays: number;

  @ApiProperty({ example: 'I am the perfect fit for this job.' })
  @IsString()
  @IsNotEmpty()
  coverLetter: string;
}
