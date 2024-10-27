import { Message } from "ai";

export type ChatAdd = {
  thread_id: string;
  messages: Array<Message>;
};

export type ChatListItem = {
  id?: number;
  thread_id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Chat = ChatListItem & ChatAdd;
