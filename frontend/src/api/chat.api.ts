import apiClient from './client';
import type { Chat, CreateChatDto } from '../types/chat.types';
import type { Message } from '../types/chat.types';

export interface ChatListResponse {
  data: Chat[];
  cursor: string | null;
}

export interface MessageListResponse {
  data: Message[];
  cursor: string | null;
}

export async function createChat(dto: CreateChatDto): Promise<Chat> {
  try {
    const response = await apiClient.post<Chat>('/chats', dto);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function listChats(cursor?: string): Promise<ChatListResponse> {
  try {
    const params: Record<string, string> = {};
    if (cursor) params.cursor = cursor;
    const response = await apiClient.get<ChatListResponse>('/chats', { params });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getChatMessages(chatId: string, cursor?: string): Promise<MessageListResponse> {
  try {
    const params: Record<string, string> = {};
    if (cursor) params.cursor = cursor;
    const response = await apiClient.get<MessageListResponse>(`/chats/${chatId}/messages`, { params });
    return response.data;
  } catch (err) {
    throw err;
  }
}
