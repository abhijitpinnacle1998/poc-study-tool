import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsNumber,
} from 'class-validator';

export class CreateCardDto {
  @ApiProperty({ example: 1, description: 'ID of the user creating the card' })
  @IsInt()
  @IsNotEmpty()
  userId!: number;

  @ApiProperty({
    example: 'What is NestJS?',
    description: 'Front side of the card',
  })
  @IsString()
  @IsNotEmpty()
  frontContent!: string;

  @ApiProperty({
    example: 'A progressive Node.js framework',
    description: 'Back side of the card',
  })
  @IsString()
  @IsNotEmpty()
  backContent!: string;

  @ApiProperty({ example: 5, description: 'Deck ID this card belongs to' })
  @IsInt()
  @IsNotEmpty({ message: 'deckId is required' })
  deckId!: number;

  @ApiProperty({
    example: 2.5,
    required: false,
    description: 'Learning factor for spaced repetition',
  })
  @IsNumber()
  @IsOptional()
  aFactor?: number;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Number of repetitions',
  })
  @IsInt()
  @IsOptional()
  repetitionCount?: number;

  @ApiProperty({ example: 3, required: false, description: 'Interval in days' })
  @IsInt()
  @IsOptional()
  intervalDays?: number;

  @ApiProperty({ example: 0, required: false, description: 'Number of lapses' })
  @IsInt()
  @IsOptional()
  lapsesCount?: number;

  @ApiProperty({
    example: 'manual',
    required: false,
    description: 'Source of card creation',
  })
  @IsString()
  @IsOptional()
  sourceType?: string;
}
