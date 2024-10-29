import { create } from "zustand";
import { ChatAddDTO, ChatListItemDTO, ChatDTO } from "../services/dto/chat.dto";
import { API } from "../services/api-client";

interface ChatState {
  currentUserChat: ChatDTO | null;
  userChatList: ChatListItemDTO[];

  setCurrentUserChat: (chat: ChatDTO) => void;
  setUserChatList: (chats: ChatListItemDTO[]) => void;
}

export const useUserChatStore = create<ChatState>((set) => ({
  currentUserChat: null,
  userChatList: [],
  isLoading: false,
  error: false,

  setCurrentUserChat: (chat) => set({ currentUserChat: chat }),
  setUserChatList: (chats) => set({ userChatList: chats }),
}));
