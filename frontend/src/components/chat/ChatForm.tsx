import { useState } from 'react';
import type { CreateChatDto } from '../../types/chat.types';

interface ChatFormProps {
  onSubmit: (data: CreateChatDto) => Promise<void>;
  isLoading: boolean;
}

export default function ChatForm({ onSubmit, isLoading }: ChatFormProps) {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Chat Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter chat name"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
      >
        {isLoading ? 'Creating...' : 'Create Chat'}
      </button>
    </form>
  );
}
