import type { Chat } from '../../types/chat.types';

interface ChatListProps {
  items: Chat[];
  onSelect: (chat: Chat) => void;
  isLoading: boolean;
}

export default function ChatList({ items, onSelect, isLoading }: ChatListProps) {
  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading chats...</div>;
  }

  if (items.length === 0) {
    return <div className="p-4 text-center text-gray-400">No chats yet</div>;
  }

  return (
    <ul className="divide-y divide-gray-200">
      {items.map((chat) => (
        <li
          key={chat.id}
          onClick={() => onSelect(chat)}
          className="p-4 hover:bg-gray-50 cursor-pointer"
        >
          <p className="font-medium text-gray-800">{chat.name}</p>
          <p className="text-xs text-gray-400 mt-1">{new Date(chat.created_at).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
  );
}
