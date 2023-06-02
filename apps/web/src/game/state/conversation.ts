import { create } from 'zustand';

import { CharacterId } from '../common/config';

export interface Message {
  sender: CharacterId;
  content: string;
  timestamp: number;
}

export interface ConversationState {
  messages: Message[];
  addMessage: (sender: CharacterId, content: string) => void;
}

export const useConversationStore = create<ConversationState>()((set) => ({
  messages: [],
  addMessage: (sender: CharacterId, content: string) =>
    set((state) => {
      const timestamp = Date.now();

      return { messages: [...state.messages, { sender, content, timestamp }] };
    }),
}));
