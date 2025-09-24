import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  @IsEmail()
  email!: string;
  @ApiProperty({ example: 'Password123!', description: 'Strong password' })
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/, {
    message:
      'Password must be at least 8 characters long, include 1 uppercase, 1 lowercase, and 1 number',
  })
  password!: string;
}
