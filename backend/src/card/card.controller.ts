import {
  Controller,
  Get,
  Param,
  Delete,
  Body,
  Put,
  ParseIntPipe,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CardService } from './card.service';
import { CreateCardDto } from './cardDto/createCard.dto';
import { UpdateCardDto } from '@/card/cardDto/updateCard.dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { AuthService } from '@/auth/auth.service';
import { User } from '@/core/common/decorators/user.decorator';

@ApiTags('cards')
@Controller('cards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CardController {
  constructor(
    private readonly cardService: CardService,
    private readonly authService: AuthService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new card' })
  @ApiResponse({ status: 201, description: 'Card created successfully' })
  async createCard(@Body() createCardDto: CreateCardDto) {
    return this.cardService.createCard(createCardDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a card by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Card ID' })
  @ApiResponse({ status: 200, description: 'Card updated successfully' })
  async updateCard(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardDto: UpdateCardDto,
    @User('id') userId: number
  ) {
    return this.cardService.updateCard(id, updateCardDto, userId);
  }

  @Get(':deckId')
  @ApiOperation({ summary: 'Get all cards in a deck' })
  @ApiParam({ name: 'deckId', type: Number, description: 'Deck ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Cards fetched successfully' })
  async getByDeckId(
    @Param('deckId') deckId: number,
    @User('id') userId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string
  ) {
    return this.cardService.getByDeckId(
      deckId,
      Number(userId),
      page,
      limit,
      search
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a card by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Card ID' })
  @ApiResponse({ status: 200, description: 'Card deleted successfully' })
  async deleteCardById(
    @Param('id', ParseIntPipe) id: number,
    @User('id') userId: number
  ) {
    return this.cardService.deleteById(id, userId);
  }
}
