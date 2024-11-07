import { create } from "zustand";
import { ChatListItem } from "../services/types/chat";

interface ChatState {
  currentUserChat: ChatListItem | null;
  setCurrentUserChat: (chat: ChatListItem) => void;
}

export const useUserChatStore = create<ChatState>((set) => ({
  currentUserChat: null,

  setCurrentUserChat: (chat) => set({ currentUserChat: chat }),
}));
