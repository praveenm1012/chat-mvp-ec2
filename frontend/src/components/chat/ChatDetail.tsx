import type { Chat } from '../../types/chat.types';

interface ChatDetailProps {
  item: Chat;
  isLoading: boolean;
  onEdit: () => void;
}

export default function ChatDetail({ item, isLoading, onEdit }: ChatDetailProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
        <p className="text-xs text-gray-400">Created {new Date(item.created_at).toLocaleDateString()}</p>
      </div>
      <button
        onClick={onEdit}
        disabled={isLoading}
        className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
      >
        Edit
      </button>
    </div>
  );
}
