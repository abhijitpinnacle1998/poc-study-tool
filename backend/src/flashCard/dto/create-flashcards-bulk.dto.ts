import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FlashcardDto {
  @ApiProperty({ description: 'Question text', example: 'What is Node.js?' })
  @IsString()
  @IsNotEmpty({ message: 'question is required' })
  question: string;

  @ApiProperty({
    description: 'Answer text',
    example: 'Node.js is a runtime environment for JavaScript.',
  })
  @IsString()
  @IsNotEmpty({ message: 'answer is required' })
  answer: string;

  @ApiPropertyOptional({
    description: 'Optional tags for categorizing flashcards',
    type: [String],
    example: ['javascript', 'backend'],
  })
  @IsArray()
  @Type(() => String)
  @IsOptional()
  tags?: string[] = [];
}

export class CreateFlashcardsBulkDto {
  @ApiProperty({
    description: 'ID of the deck to which flashcards belong',
    example: 1,
  })
  @IsInt({ message: 'deckId must be an integer' })
  deckId: number;

  @ApiProperty({
    description: 'Array of flashcards to create',
    type: [FlashcardDto],
    example: [
      {
        question: 'What is JavaScript?',
        answer: 'JavaScript is a high-level programming language.',
        tags: ['frontend', 'language'],
      },
      {
        question: 'What is NestJS?',
        answer:
          'NestJS is a progressive Node.js framework for building server-side applications.',
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'flashcards array must not be empty' })
  @ValidateNested({ each: true })
  @Type(() => FlashcardDto)
  flashcards: FlashcardDto[];
}
