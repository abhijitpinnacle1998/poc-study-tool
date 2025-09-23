import {
  IsOptional,
  IsString,
  IsInt,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { ReviewHistoryDto } from './ReviewHistoryDto.dto';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCardDto {
  @ApiPropertyOptional({
    description: 'Updated front side content of the card',
  })
  @IsString()
  @IsOptional()
  frontContent?: string;

  @ApiPropertyOptional({ description: 'Updated back side content of the card' })
  @IsString()
  @IsOptional()
  backContent?: string;

  @ApiPropertyOptional({
    description: 'Deck ID to reassign the card',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  deckId?: number;

  @ApiPropertyOptional({
    description: 'Ease factor used in spaced repetition algorithm',
    example: 2.5,
  })
  @IsNumber()
  @IsOptional()
  aFactor?: number;

  @ApiPropertyOptional({
    description: 'Number of repetitions so far',
    example: 3,
  })
  @IsInt()
  @IsOptional()
  repetitionCount?: number;

  @ApiPropertyOptional({
    description: 'Interval in days until next review',
    example: 7,
  })
  @IsInt()
  @IsOptional()
  intervalDays?: number;

  @ApiPropertyOptional({ description: 'Number of lapses recorded', example: 1 })
  @IsInt()
  @IsOptional()
  lapsesCount?: number;

  @ApiPropertyOptional({
    description: 'Source type (manual, AI-generated, etc.)',
    example: 'manual',
  })
  @IsString()
  @IsOptional()
  sourceType?: string;

  @ApiPropertyOptional({
    description: 'Review history of the card',
    type: [ReviewHistoryDto],
  })
  @ValidateNested({ each: true })
  @Type(() => ReviewHistoryDto)
  @IsOptional()
  reviewHistory?: ReviewHistoryDto[];

  @ApiPropertyOptional({
    description: 'Matrix updates for advanced operations',
  })
  @IsOptional()
  ofMatrixUpdates?: object;
}
