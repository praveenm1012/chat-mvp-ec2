import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';

import { ChatMember } from './entities/chatmember.entity';

import { Message } from './entities/message.entity';

import { User } from './entities/user.entity';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,

    @InjectRepository(ChatMember)
    private readonly chatmemberRepository: Repository<ChatMember>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createChat(dto: CreateChatDto): Promise<Chat> {
    this.logger.log(`Creating chat with name: ${dto.name}`);
    try {
      const chat = this.chatRepository.create(dto);
      const saved = await this.chatRepository.save(chat);
      this.logger.log(`Chat created: ${saved.id}`);
      return saved;
    } catch (err) {
      this.logger.error('Error creating chat', err instanceof Error ? err.stack : String(err));
      throw err;
    }
  }

  async listChats(): Promise<Chat[]> {
    this.logger.log('Listing all chats');
    try {
      return await this.chatRepository.find();
    } catch (err) {
      this.logger.error('Error listing chats', err instanceof Error ? err.stack : String(err));
      throw err;
    }
  }

  async getChatMessages(chatId: string): Promise<Message[]> {
    this.logger.log(`Fetching messages for chat: ${chatId}`);
    try {
      const chat = await this.chatRepository.findOne({ where: { id: chatId } });
      if (!chat) {
        this.logger.warn(`Chat not found: ${chatId}`);
        throw new NotFoundException(`Chat ${chatId} not found`);
      }
      return await this.messageRepository.find({ where: { chat_id: chatId } });
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      this.logger.error(`Error fetching messages for chat ${chatId}`, err instanceof Error ? err.stack : String(err));
      throw err;
    }
  }
}
