import { PartialType } from '@nestjs/mapped-types';
import { CreateDeckDto } from './create.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDeckDto extends PartialType(CreateDeckDto) {
  @ApiPropertyOptional({
    description: 'Title of the deck',
    example: 'Updated JS Basics',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Optional description of the deck',
    example: 'Updated deck description.',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Set to true to make the deck public',
    example: true,
  })
  isPublic?: boolean;
}
