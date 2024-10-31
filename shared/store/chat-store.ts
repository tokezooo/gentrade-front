import { create } from "zustand";
import { ChatAdd, ChatListItem, Chat } from "../services/types/chat";
import { API } from "../services/api-client";

interface ChatState {
  currentUserChat: ChatListItem | null;
  setCurrentUserChat: (chat: ChatListItem) => void;
}

export const useUserChatStore = create<ChatState>((set) => ({
  currentUserChat: null,
  isLoading: false,
  error: false,

  setCurrentUserChat: (chat) => set({ currentUserChat: chat }),
}));
