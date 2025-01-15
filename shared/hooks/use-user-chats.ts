import { useMutation, useQuery } from "@tanstack/react-query";
import { API } from "../services/api-client";
import { ChatAdd, Chat, ChatListItem } from "../services/types/chat";
import { getQueryClient } from "../lib/use-query/get-query-client";
import { useUserChatStore } from "../store/chat-store";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export const useUserChats = () => {
  const { setCurrentUserChat } = useUserChatStore();
  const queryClient = getQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading, error } = useQuery({
    queryKey: ["getUserChats"],
    staleTime: Infinity,
    queryFn: async () => {
      const response = await API.chats.getUserChats();

      return response ?? [];
    },
  });

  const { mutate: mutateAddChat, isPending: isPendingAddChat } = useMutation({
    mutationKey: ["mutateAddChat"],
    mutationFn: async (chat: ChatAdd) => {
      const response = await API.chats.addChat(chat);
      return response ?? [];
    },
    onMutate: async (chat: ChatAdd) => {
      await queryClient.cancelQueries({ queryKey: ["getUserChats"] });
      const previousChats = queryClient.getQueryData<ChatListItem[]>([
        "getUserChats",
      ]);
      queryClient.setQueryData(["getUserChats"], (old: ChatListItem[]) => {
        return [chat, ...old];
      });
      return { previousChats };
    },
    onError: (context: any) => {
      queryClient.setQueryData(["getUserChats"], context.previousChats);
    },
    onSettled: (data, error, variables) => {
      if (!error && data) {
        setCurrentUserChat(data);
      }
      queryClient.invalidateQueries({ queryKey: ["getUserChats"] });
    },
  });

  const { mutate: mutateUpdateChat, isPending: isPendingUpdateChat } =
    useMutation({
      mutationKey: ["mutateUpdateChat"],
      mutationFn: async (chat: Chat) => {
        const response = await API.chats.updateChat(chat);
        return response;
      },
    });

  const { mutate: mutateDeleteChat, isPending: isPendingDeleteChat } =
    useMutation({
      mutationKey: ["mutateDeleteChat"],
      mutationFn: async (thread_id: string) => {
        await API.chats.deleteChat(thread_id);
      },
      onMutate: async (thread_id: string) => {
        await queryClient.cancelQueries({ queryKey: ["getUserChats"] });
        const previousChats = queryClient.getQueryData<ChatListItem[]>([
          "getUserChats",
        ]);

        queryClient.setQueryData(["getUserChats"], (old: ChatListItem[]) => {
          return old.filter((chat) => chat.thread_id !== thread_id);
        });

        if (pathname.includes(thread_id)) {
          router.push("/chat");
        }
        return { previousChats };
      },
      onError: (context: any) => {
        queryClient.setQueryData(["getUserChats"], context.previousChats);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["getUserChats"] });
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
    mutateDeleteChat,
    isPendingDeleteChat,
  };
};
