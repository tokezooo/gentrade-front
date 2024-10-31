"use server";
import axios from "axios";
import { ApiEndpoints } from "./common/constants";
import { getInstance } from "./common/instance";
import { Chat, ChatAdd, ChatListItem } from "./types/chat";
import { convertToCoreMessages } from "ai";

/**
 * Fetches the list of user chats from the API.
 * All user info is fetched from clerk in the axios instance.
 *
 * @returns {Promise<ChatListItem[]>} A promise that resolves to an array of ChatListItem objects.
 */
export const getUserChats = async (): Promise<ChatListItem[]> => {
  try {
    const axiosInstance = await getInstance();
    const response = await axiosInstance.get(ApiEndpoints.CHATS);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Saves a new chat to the API.
 *
 * @param chat The chat data to save
 */
export const addChat = async (chat: ChatAdd): Promise<void> => {
  const axiosInstance = await getInstance();
  await axiosInstance.post(ApiEndpoints.CHATS, {
    thread_id: chat.thread_id,
    messages: chat.messages,
  });
};

/**
 * Updates an existing chat in the API.
 *
 * @param chat The chat data to update
 */
export const updateChat = async (chat: Chat): Promise<void> => {
  const axiosInstance = await getInstance();
  await axiosInstance.patch(ApiEndpoints.CHATS, {
    thread_id: chat.thread_id,
    messages: chat.messages,
  });
};

/**
 * Fetches a specific chat by its thread ID.
 *
 * @param thread_id The ID of the chat thread to fetch
 * @returns The chat data or null if not found
 */
export const getChat = async (thread_id: string): Promise<Chat | null> => {
  try {
    const axiosInstance = await getInstance();
    const response = await axiosInstance.get(
      `${ApiEndpoints.CHATS}/${thread_id}`
    );
    const coreMessages = convertToCoreMessages(response.data.messages);
    response.data.messages = coreMessages;
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Deletes a specific chat by its thread ID.
 *
 * @param thread_id The ID of the chat thread to delete
 * @returns A promise that resolves when the chat is deleted
 */
export const deleteChat = async (thread_id: string): Promise<void> => {
  const axiosInstance = await getInstance();
  await axiosInstance.delete(`${ApiEndpoints.CHATS}/${thread_id}`);
};
