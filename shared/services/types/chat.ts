import { Message } from "ai";

export interface ChatAdd {
  thread_id: string;
  messages: Array<Message>;
  title: string;
}

export interface ChatListItem {
  id?: number;
  thread_id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Chat extends ChatListItem, ChatAdd {}
