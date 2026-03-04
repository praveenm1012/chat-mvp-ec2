import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';

import { CreateChatDto } from './dto/create-chat.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @Post('chats')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new chat' })
  @ApiResponse({ status: 201, description: 'Chat created successfully' })
  async createChat(@Body() dto: CreateChatDto) {
    try {
      return await this.chatService.createChat(dto);
    } catch (err) {
      this.logger.error('Error in createChat endpoint', err instanceof Error ? err.stack : String(err));
      throw err;
    }
  }

  @Get('chats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all chats' })
  @ApiResponse({ status: 200, description: 'Chats retrieved successfully' })
  async listChats() {
    try {
      return await this.chatService.listChats();
    } catch (err) {
      this.logger.error('Error in listChats endpoint', err instanceof Error ? err.stack : String(err));
      throw err;
    }
  }

  @Get('chats/:id/messages')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get messages for a chat' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  async getChatMessages(@Param('id') id: string) {
    try {
      return await this.chatService.getChatMessages(id);
    } catch (err) {
      this.logger.error(`Error in getChatMessages endpoint for chat ${id}`, err instanceof Error ? err.stack : String(err));
      throw err;
    }
  }
}
