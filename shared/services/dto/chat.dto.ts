import { Message } from "ai";

export interface ChatAddDTO {
  thread_id: string;
  messages: Array<Message>;
}

export interface ChatListItemDTO {
  id?: number;
  thread_id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatDTO extends ChatListItemDTO, ChatAddDTO {}
