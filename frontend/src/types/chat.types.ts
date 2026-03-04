export interface Chat {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateChatDto {
  name: string;
}

export interface Message {
  id: string;
  chat_id: string;
  user_id: string;
  content: string;
  created_at: string;
}
