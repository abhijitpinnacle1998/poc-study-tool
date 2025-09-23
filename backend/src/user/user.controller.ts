import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from '@/auth/decorators/user.decorator';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    this.logger.log(`User created via controller: ${user.email}`);
    return user;
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all users' })
  @ApiResponse({ status: 200, description: 'Users fetched successfully.' })
  async findAll() {
    const users = await this.userService.findAll();
    this.logger.log(`Fetched all users via controller`);
    return users;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a single user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User fetched successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    this.logger.log(`Fetched user via controller: ${user.email}`);
    return user;
  }

  @Patch('password')
  @ApiOperation({ summary: 'Update user password' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({ status: 200, description: 'Password updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  async updatePassword(
    @User('id') userId: number,
    @Body() dto: UpdatePasswordDto
  ) {
    this.logger.log(`Updated password via controller`);
    return this.userService.updatePassword(+userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user details' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const updated = await this.userService.update(+id, dto);
    this.logger.log(`Updated user via controller: ${updated.email}`);
    return updated;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(@Param('id') id: string) {
    const deletedUser = await this.userService.remove(+id);
    this.logger.log(`Deleted user via controller: ${deletedUser.email}`);
    return deletedUser;
  }
}
