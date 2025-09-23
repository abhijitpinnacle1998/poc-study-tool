import { IsInt, IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewHistoryDto {
  @ApiProperty({
    description: 'Date of the review in ISO format (YYYY-MM-DD)',
    example: '2025-09-19',
  })
  @IsDateString()
  date!: string;

  @ApiProperty({ description: 'Interval between reviews in days', example: 3 })
  @IsInt()
  interval!: number;

  @ApiProperty({
    description: 'Grade given for this review (e.g. "easy", "hard", "again")',
    example: 'easy',
  })
  @IsString()
  grade!: string;
}
