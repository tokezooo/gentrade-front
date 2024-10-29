import { useMutation, useQuery } from "@tanstack/react-query";
import { API } from "../services/api-client";
import { ChatAddDTO, ChatDTO } from "../services/dto/chat.dto";
import { useUserChatStore } from "../store/chat-store";

export const useUserChats = () => {
  const { setUserChatList, userChatList } = useUserChatStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["userChatList"],
    queryFn: async () => {
      const response = await API.chats.getUserChats();
      setUserChatList(response);
      return response;
    },
  });

  const { mutate: mutateAddChat, isPending: isPendingAddChat } = useMutation({
    mutationKey: ["add a new chat"],
    mutationFn: async (chat: ChatAddDTO) => {
      const response = await API.chats.addChat(chat);

      const chatExists = userChatList.some(
        (existingChat) => existingChat.thread_id === chat.thread_id
      );
      if (!chatExists) {
        setUserChatList([chat, ...userChatList]);
      }

      return response;
    },
  });

  const { mutate: mutateUpdateChat, isPending: isPendingUpdateChat } =
    useMutation({
      mutationKey: ["update a chat"],
      mutationFn: async (chat: ChatDTO) => {
        const response = await API.chats.updateChat(chat);
        return response;
      },
    });

  return {
    userChatList: data || [],
    isLoading,
    error,
    mutateAddChat,
    isPendingAddChat,
    mutateUpdateChat,
    isPendingUpdateChat,
  };
};
