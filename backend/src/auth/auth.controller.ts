import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  return local[0] + '***@' + domain;
}
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    //type: RegisterResponseDto,
  })
  signup(@Body() dto: RegisterDto) {
    this.logger.log(`Signup attempt for email: ${maskEmail(dto.email)}`);
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  //@ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    //type: LoginResponseDto,
  })
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    this.logger.log(`Signup attempt for email: ${maskEmail(dto.email)}`);
    return this.authService.login(dto);
  }

  @Post('refresh-token')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Refresh JWT token' })
  // @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    //type: RefreshResponseDto,
  })
  @HttpCode(200)
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshTokens(body.refreshToken);
  }

  @Post('reset-password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent',
    //type: MessageResponseDto,
  })
  @HttpCode(200)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    this.logger.log(
      `Password reset request for email: ${maskEmail(dto.email)}`
    );
    return this.authService.resetPassword(dto.email);
  }

  @Post('reset-password/confirm')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Confirm password reset' })
  //@ApiBody({ type: ResetPasswordConfirmDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
    //type: MessageResponseDto,
  })
  @HttpCode(200)
  async resetPasswordConfirm(
    @Body() body: { resetToken: string; newPassword: string }
  ) {
    return this.authService.resetPasswordConfirm(
      body.resetToken,
      body.newPassword
    );
  }
}
