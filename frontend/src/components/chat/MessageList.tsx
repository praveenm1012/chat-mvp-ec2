import type { Message } from '../../types/chat.types';

interface MessageListProps {
  items: Message[];
  isLoading: boolean;
}

export default function MessageList({ items, isLoading }: MessageListProps) {
  if (isLoading && items.length === 0) {
    return <div className="text-center text-gray-500 py-4">Loading messages...</div>;
  }

  if (items.length === 0) {
    return <div className="text-center text-gray-400 py-4">No messages yet</div>;
  }

  return (
    <ul className="space-y-3">
      {items.map((message) => (
        <li key={message.id} className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-gray-800">{message.content}</p>
          <p className="text-xs text-gray-400 mt-1">{new Date(message.created_at).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  );
}
