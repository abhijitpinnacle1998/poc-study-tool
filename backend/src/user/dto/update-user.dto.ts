import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'New email address for the user',
    example: 'updateduser@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Optional OpenAI API Key for the user',
    example: 'sk-abc123xyz456',
  })
  @IsOptional()
  @IsString()
  openAiApiKey?: string;
}
