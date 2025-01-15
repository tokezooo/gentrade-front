import { useMutation, useQuery } from "@tanstack/react-query";
import { API } from "../services/api-client";
import { StrategyDraft } from "../services/types/strategy-draft";
import { Strategy, StrategyListItem } from "../services/types/strategy";
import { getQueryClient } from "../lib/use-query/get-query-client";
import { useUserChatStore } from "../store/chat-store";
import { toast } from "sonner";

export const useUserStrategies = () => {
  const queryClient = getQueryClient();
  const { currentUserChat } = useUserChatStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["strategies"],
    staleTime: Infinity,
    queryFn: async () => {
      const response = await API.strategies.getUserStrategies();
      return response ?? [];
    },
  });

  const {
    mutateAsync: mutateCreateStrategyFromDraft,
    isPending: isPendingCreateStrategyFromDraft,
  } = useMutation({
    mutationKey: ["strategies", "add"],
    mutationFn: async (strategy_draft: StrategyDraft) => {
      strategy_draft.chat_id = currentUserChat?.id;
      const response = await API.strategies.createStrategyFromDraft(
        strategy_draft
      );
      return response;
    },
    onMutate: async (strategy: StrategyDraft) => {
      await queryClient.cancelQueries({ queryKey: ["strategies"] });

      const previousStrategies = queryClient.getQueryData<StrategyListItem[]>([
        "strategies",
      ]);

      queryClient.setQueryData(["strategies"], (old: StrategyListItem[]) => {
        return [strategy, ...old];
      });

      return { previousStrategies };
    },
    onError: (context: any) => {
      queryClient.setQueryData(["strategies"], context.previousStrategies);
    },
    onSettled: () => {
      toast.success("Strategy created");
      queryClient.invalidateQueries({ queryKey: ["strategies"] });
    },
  });

  const { mutate: mutateUpdateStrategy, isPending: isPendingUpdateStrategy } =
    useMutation({
      mutationKey: ["strategies", "update"],
      mutationFn: async (strategy: Strategy) => {
        const response = await API.strategies.updateStrategy(strategy);
        return response;
      },
    });

  const { mutate: mutateDeleteStrategy, isPending: isPendingDeleteStrategy } =
    useMutation({
      mutationKey: ["strategies", "delete"],
      mutationFn: async (id: number) => {
        await API.strategies.deleteStrategy(id);
      },
      onMutate: async (id: number) => {
        await queryClient.cancelQueries({ queryKey: ["strategies"] });
        const previousStrategies = queryClient.getQueryData<StrategyListItem[]>(
          ["strategies"]
        );

        queryClient.setQueryData(["strategies"], (old: StrategyListItem[]) => {
          return old.filter((strategy) => strategy.id !== id);
        });

        return { previousStrategies };
      },
      onError: (context: any) => {
        queryClient.setQueryData(["strategies"], context.previousStrategies);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["strategies"] });
      },
    });

  return {
    userStrategyList: data || [],
    isLoading,
    error,
    mutateCreateStrategyFromDraft,
    isPendingCreateStrategyFromDraft,
    mutateUpdateStrategy,
    isPendingUpdateStrategy,
    mutateDeleteStrategy,
    isPendingDeleteStrategy,
  };
};
