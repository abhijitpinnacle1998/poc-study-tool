import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDeckDto {
  @ApiProperty({
    description: 'Title of the deck',
    example: 'JavaScript Basics',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiPropertyOptional({
    description: 'Optional description of the deck',
    example: 'This deck contains JS flashcards.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Set to true to make the deck public',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean = false;
}
