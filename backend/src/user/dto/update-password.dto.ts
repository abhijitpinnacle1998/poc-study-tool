import { IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Current password of the user',
    example: 'OldPass123',
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description:
      'New password (must contain at least one letter and one number)',
    example: 'NewPass456',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, {
    message: 'Password must contain at least one letter and one number',
  })
  newPassword: string;

  @ApiProperty({
    description: 'Confirmation of the new password',
    example: 'NewPass456',
  })
  @IsString()
  confirmPassword: string;
}
