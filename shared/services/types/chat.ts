import { Message } from "ai_dryamvlad";

export interface ChatAdd {
  thread_id: string;
  messages: Array<Message>;
  title: string | null;
}

export interface ChatListItem {
  id?: number;
  thread_id: string;
  title: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Chat extends ChatListItem, ChatAdd {}
