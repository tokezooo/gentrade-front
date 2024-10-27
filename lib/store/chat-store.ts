import { create } from "zustand";
import { Chat, ChatListItem } from "@/lib/types";

interface ChatState {
  currentChat: Chat | null;
  setCurrentChat: (chat: Chat) => void;
  chatList: ChatListItem[];
  setChatList: (chats: ChatListItem[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentChat: null,
  setCurrentChat: (chat) => set({ currentChat: chat }),
  chatList: [],
  setChatList: (chats) => set({ chatList: chats }),
}));
