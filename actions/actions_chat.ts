"use server";

import { Chat, ChatListItem, ChatAdd } from "@/lib/types";
import { auth, currentUser } from "@clerk/nextjs/server";
import { convertToCoreMessages, Message } from "ai";
import axios from "axios";
import { headers } from "next/headers";

export async function saveChat(chat: ChatAdd) {
  const { getToken, userId } = auth();
  const token = await getToken();

  const response = await axios.post(
    `${process.env.GENTRADE_API_URL}/chats`,
    {
      thread_id: chat.thread_id,
      messages: chat.messages,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function getChat(thread_id: string): Promise<Chat | null> {
  const { getToken } = auth();
  const token = await getToken();

  try {
    const response = await axios.get(
      `${process.env.GENTRADE_API_URL}/chats/${thread_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const coreMessages = convertToCoreMessages(response.data.messages);
    response.data.messages = coreMessages;
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
  }
  return null;
}

export async function getUserChats(): Promise<ChatListItem[]> {
  const { getToken } = auth();
  const token = await getToken();

  try {
    const response = await axios.get(`${process.env.GENTRADE_API_URL}/chats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
