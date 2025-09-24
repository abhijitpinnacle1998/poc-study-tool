import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email for password reset',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
