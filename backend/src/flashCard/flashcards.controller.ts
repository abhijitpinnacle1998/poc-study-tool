import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '@/auth/decorators/user.decorator';
import { AuthPayload } from '@/auth/types/auth.types';

import { CreateFlashcardsBulkDto } from './dto/create-flashcards-bulk.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('flashcards')
@ApiBearerAuth()
@Controller('flashcards')
@UseGuards(JwtAuthGuard)
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple flashcards at once' })
  @ApiBody({ type: CreateFlashcardsBulkDto })
  @ApiResponse({ status: 201, description: 'Flashcards created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createBulk(
    @Body() dto: CreateFlashcardsBulkDto,
    @User() user: AuthPayload
  ) {
    const result = await this.flashcardsService.createBulk(
      dto.deckId,
      parseInt(user.id),
      dto.flashcards
    );

    return {
      flashCards: result,
      total: result.length,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Fetch all flashcards with pagination, sorting, and filtering',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (optional)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (optional)',
    example: 10,
  })
  @ApiQuery({
    name: 'deckId',
    required: false,
    type: Number,
    description: 'Filter flashcards by deck ID',
    example: 1,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Sort field',
    example: 'question',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
    example: 'asc',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term',
    example: 'NestJS',
  })
  @ApiResponse({ status: 200, description: 'Flashcards fetched successfully.' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  findAll(
    @User() user: AuthPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('deckId') deckId?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('search') search?: string
  ) {
    return this.flashcardsService.findAll({
      page: page && page.trim() !== '' ? Number(page) : undefined,
      limit: limit && limit.trim() !== '' ? Number(limit) : undefined,
      deckId: deckId && deckId.trim() !== '' ? Number(deckId) : undefined,
      sortBy: sortBy && sortBy.trim() !== '' ? sortBy : undefined,
      sortOrder:
        sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : undefined,
      search: search && search.trim() !== '' ? search : undefined,
      requestingUserId: parseInt(user.id),
    });
  }
}
