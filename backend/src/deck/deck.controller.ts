import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { User } from '@/auth/decorators/user.decorator';
import { AuthPayload } from '@/auth/types/auth.types';
import { DecksService } from '@/deck/deck.service';
import { CreateDeckDto } from '@/deck/dto/create.dto';
import { UpdateDeckDto } from '@/deck/dto/update-deck.dto';

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('decks')
@Controller('decks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new deck' })
  @ApiBody({ type: CreateDeckDto })
  @ApiResponse({
    status: 201,
    description: 'Deck created successfully',
  })
  create(@Body() createDeckDto: CreateDeckDto, @User() user: AuthPayload) {
    // Ensure the deck is created for the authenticated user
    const deckData = {
      ...createDeckDto,
      userId: parseInt(user.id), // Set userId from authenticated user
    };
    return this.decksService.create(deckData);
  }

  @Get('By/:id')
  @ApiOperation({
    summary: 'Get deck by ID',
    description: 'Fetch a single deck by its ID',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Deck ID' })
  @ApiResponse({ status: 200, description: 'Deck fetched successfully' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @User() user: AuthPayload
  ) {
    const deck = await this.decksService.findOne(id, parseInt(user.id));

    return {
      ...deck,
      meta: { total: 1 },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all decks' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of decks per page',
    example: 10,
  })
  @ApiQuery({
    name: 'publicOnly',
    required: false,
    description: 'Whether to fetch only public decks',
    example: true,
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by specific user ID',
    example: 42,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort by (e.g., title, createdAt)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (asc or desc)',
    example: 'asc',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search decks by keyword',
  })
  @ApiResponse({ status: 200, description: 'List of decks' })
  findAll(
    @User() user: AuthPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('publicOnly') publicOnly?: string,
    @Query('userId') userId?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('search') search?: string
  ) {
    const targetUserId =
      userId && userId.trim() !== '' ? Number(userId) : parseInt(user.id);

    return this.decksService.findAll({
      page: page && page.trim() !== '' ? Number(page) : undefined,
      limit: limit && limit.trim() !== '' ? Number(limit) : undefined,
      publicOnly: publicOnly === 'true',
      userId: targetUserId,
      sortBy: sortBy && sortBy.trim() !== '' ? sortBy : undefined,
      sortOrder:
        sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : undefined,
      search: search && search.trim() !== '' ? search : undefined,
      requestingUserId: parseInt(user.id), // Pass the requesting user's ID for authorization checks
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update deck', description: 'Update a deck by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Deck ID' })
  @ApiBody({ type: UpdateDeckDto })
  @ApiResponse({ status: 200, description: 'Deck successfully updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDeckDto: UpdateDeckDto,
    @User() user: AuthPayload
  ) {
    return this.decksService.update(id, updateDeckDto, parseInt(user.id));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete deck', description: 'Delete a deck by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Deck ID' })
  @ApiResponse({ status: 200, description: 'Deck successfully deleted' })
  remove(@User() user: AuthPayload, @Param('id', ParseIntPipe) id: number) {
    return this.decksService.remove(id, parseInt(user.id));
  }
}
