import { useState, useEffect, useCallback } from 'react';
import ChatList from '../components/chat/ChatList';
import ChatForm from '../components/chat/ChatForm';
import ChatDetail from '../components/chat/ChatDetail';
import MessageList from '../components/chat/MessageList';
import * as api from '../api/chat.api';
import type { Chat, CreateChatDto, Message } from '../types/chat.types';

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatCursor, setChatCursor] = useState<string | null>(null);
  const [messageCursor, setMessageCursor] = useState<string | null>(null);

  const fetchChats = useCallback(async () => {
    setIsLoadingChats(true);
    setError(null);
    try {
      const result = await api.listChats();
      setChats(result.data);
      setChatCursor(result.cursor);
    } catch (err) {
      setError('Failed to load chats.');
    } finally {
      setIsLoadingChats(false);
    }
  }, []);

  const fetchMessages = useCallback(async (chatId: string) => {
    setIsLoadingMessages(true);
    setError(null);
    try {
      const result = await api.getChatMessages(chatId);
      setMessages(result.data);
      setMessageCursor(result.cursor);
    } catch (err) {
      setError('Failed to load messages.');
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    } else {
      setMessages([]);
    }
  }, [selectedChat, fetchMessages]);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setShowForm(false);
  };

  const handleCreateChat = async (data: CreateChatDto) => {
    setIsCreating(true);
    setError(null);
    try {
      const newChat = await api.createChat(data);
      setChats(prev => [newChat, ...prev]);
      setShowForm(false);
      setSelectedChat(newChat);
    } catch (err) {
      setError('Failed to create chat.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleLoadMoreMessages = async () => {
    if (!selectedChat || !messageCursor) return;
    setIsLoadingMessages(true);
    try {
      const result = await api.getChatMessages(selectedChat.id, messageCursor);
      setMessages(prev => [...prev, ...result.data]);
      setMessageCursor(result.cursor);
    } catch (err) {
      setError('Failed to load more messages.');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Chats</h1>
          <button
            onClick={() => { setShowForm(true); setSelectedChat(null); }}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + New Chat
          </button>
        </div>

        {error && (
          <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <ChatList
            items={chats}
            onSelect={handleSelectChat}
            isLoading={isLoadingChats}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {showForm ? (
          <div className="p-6 max-w-lg mx-auto w-full mt-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Create New Chat</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <ChatForm
                onSubmit={handleCreateChat}
                isLoading={isCreating}
              />
            </div>
          </div>
        ) : selectedChat ? (
          <div className="flex flex-col h-full">
            <div className="bg-white border-b border-gray-200 p-4">
              <ChatDetail
                item={selectedChat}
                isLoading={false}
                onEdit={() => setShowForm(true)}
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <MessageList
                items={messages}
                isLoading={isLoadingMessages}
              />
              {messageCursor && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleLoadMoreMessages}
                    disabled={isLoadingMessages}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300 disabled:opacity-50"
                  >
                    {isLoadingMessages ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-xl font-semibold text-gray-600">Select a chat to start messaging</h2>
              <p className="text-gray-400 mt-2">Or create a new chat to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
